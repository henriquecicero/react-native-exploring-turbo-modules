package com.sampleapp.specs

import android.content.Context
import android.graphics.Bitmap
import android.graphics.Color
import android.graphics.pdf.PdfRenderer
import android.net.Uri
import android.os.Handler
import android.os.Looper
import android.os.ParcelFileDescriptor
import android.util.AttributeSet
import android.util.Log
import android.util.LruCache
import android.view.MotionEvent
import android.view.ViewConfiguration
import android.widget.FrameLayout
import android.widget.ImageView
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.WritableMap
import com.facebook.react.uimanager.UIManagerHelper
import com.facebook.react.uimanager.events.Event
import java.io.File
import java.io.FileOutputStream
import java.io.IOException
import java.net.HttpURLConnection
import java.net.URL
import java.util.concurrent.ExecutorService
import java.util.concurrent.Executors
import java.util.concurrent.Future
import kotlin.math.abs
import kotlin.math.roundToInt
import androidx.core.graphics.createBitmap
import androidx.core.net.toUri

class NativePDFView : FrameLayout {
    constructor(context: Context) : super(context) {
        configureComponent()
    }

    constructor(context: Context, attrs: AttributeSet?) : super(context, attrs) {
        configureComponent()
    }

    constructor(context: Context, attrs: AttributeSet?, defStyleAttr: Int) : super(
        context, attrs, defStyleAttr
    ) {
        configureComponent()
    }

    private val mainHandler = Handler(Looper.getMainLooper())
    private val renderExecutor: ExecutorService = Executors.newSingleThreadExecutor()
    private val connectionLock = Any()
    private val logTag = "NativePDFView"

    private lateinit var imageView: ImageView

    private var pfd: ParcelFileDescriptor? = null
    private var renderer: PdfRenderer? = null

    private var sourceUrl: String? = null
    private var requestedPage = 0
    private var currentPage = 0
    private var pageCount = 0
    private var scale = 0.0
    private var pagingEnabled = false

    private var pendingLoadEvent = false

    @Volatile
    private var loadToken = 0

    @Volatile
    private var renderToken = 0
    private var loadFuture: Future<*>? = null
    private var cacheFile: File? = null
    private var cacheFileIsTemp = false
    private var activeConnection: HttpURLConnection? = null

    private val bitmapCache = object : LruCache<String, Bitmap>(cacheSizeKb()) {
        override fun sizeOf(key: String, value: Bitmap): Int = value.byteCount / 1024
    }

    private var touchStartX = 0f
    private var touchStartY = 0f
    private var handlingSwipe = false

    private val touchSlop: Int by lazy { ViewConfiguration.get(context).scaledTouchSlop }
    private val swipeThresholdPx: Int by lazy { touchSlop * 2 }

    private fun configureComponent() {
        layoutParams = LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT)
        imageView = ImageView(context).apply {
            layoutParams = LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT)
            scaleType = ImageView.ScaleType.FIT_CENTER
            setBackgroundColor(Color.WHITE)
        }
        addView(imageView)
    }

    fun setSourceURL(sourceUrl: String?) {
        Log.d(logTag, "setSourceURL url=$sourceUrl")
        if (this.sourceUrl == sourceUrl) {
            return
        }
        this.sourceUrl = sourceUrl
        loadDocument()
    }

    fun setPage(page: Int) {
        Log.d(logTag, "setPage page=$page current=$currentPage requested=$requestedPage")
        if (requestedPage == page) {
            return
        }
        requestedPage = page
        applyPageFromProps()
    }

    fun setScale(scale: Double) {
        if (this.scale == scale) {
            return
        }
        this.scale = scale
        applyScale()
        requestRenderCurrentPage()
    }

    fun setPagingEnabled(enabled: Boolean) {
        Log.d(logTag, "setPagingEnabled enabled=$enabled")
        if (pagingEnabled == enabled) {
            return
        }
        pagingEnabled = enabled
    }

    override fun onAttachedToWindow() {
        super.onAttachedToWindow()
        applyScale()
        requestRenderCurrentPage()
    }

    override fun onDetachedFromWindow() {
        super.onDetachedFromWindow()
        cancelLoading()
        clearDocument()
    }

    override fun onInterceptTouchEvent(event: MotionEvent): Boolean {
        if (!pagingEnabled || pageCount <= 1) {
            return super.onInterceptTouchEvent(event)
        }
        when (event.actionMasked) {
            MotionEvent.ACTION_DOWN -> {
                touchStartX = event.x
                touchStartY = event.y
                handlingSwipe = false
            }

            MotionEvent.ACTION_MOVE -> {
                val dx = event.x - touchStartX
                val dy = event.y - touchStartY
                if (!handlingSwipe && abs(dx) > touchSlop && abs(dx) > abs(dy)) {
                    handlingSwipe = true
                    parent?.requestDisallowInterceptTouchEvent(true)
                    return true
                }
            }

            MotionEvent.ACTION_CANCEL, MotionEvent.ACTION_UP -> {
                handlingSwipe = false
            }
        }
        return super.onInterceptTouchEvent(event)
    }

    override fun onTouchEvent(event: MotionEvent): Boolean {
        if (!pagingEnabled || pageCount <= 1) {
            return super.onTouchEvent(event)
        }
        when (event.actionMasked) {
            MotionEvent.ACTION_DOWN -> {
                touchStartX = event.x
                touchStartY = event.y
                handlingSwipe = true
                return true
            }

            MotionEvent.ACTION_UP, MotionEvent.ACTION_CANCEL -> {
                val dx = event.x - touchStartX
                val dy = event.y - touchStartY
                if (abs(dx) > abs(dy) && abs(dx) > swipeThresholdPx) {
                    if (dx < 0f) {
                        goToPage(currentPage + 1, userInitiated = true)
                    } else {
                        goToPage(currentPage - 1, userInitiated = true)
                    }
                }
                handlingSwipe = false
                parent?.requestDisallowInterceptTouchEvent(false)
                return true
            }
        }
        return true
    }

    override fun onSizeChanged(w: Int, h: Int, oldw: Int, oldh: Int) {
        super.onSizeChanged(w, h, oldw, oldh)
        if (w != oldw) {
            requestRenderCurrentPage()
        }
    }

    private fun applyScale() {
        val scaleValue = if (scale > 0.0) scale.toFloat() else 1f
        imageView.scaleX = scaleValue
        imageView.scaleY = scaleValue
    }

    private fun loadDocument() {
        cancelLoading()
        clearDocument()
        bitmapCache.evictAll()

        val source = sourceUrl?.trim()
        if (source.isNullOrEmpty()) {
            return
        }

        val token = ++loadToken
        val uri = source.toUri()
        val scheme = uri.scheme?.lowercase()
        when (scheme) {
            null, "file" -> {
                val path = uri.path ?: source
                val file = File(path)
                openPdfFromFile(file, isTemp = false, token = token)
            }

            "content" -> {
                openPdfFromContentUri(uri, token)
            }

            "http", "https" -> {
                downloadRemotePdf(source, token)
            }

            else -> {
                emitOnError("Unsupported URL scheme.", "E_UNSUPPORTED_SCHEME")
            }
        }
    }

    private fun openPdfFromFile(file: File, isTemp: Boolean, token: Int) {
        loadFuture = renderExecutor.submit {
            val descriptor = try {
                ParcelFileDescriptor.open(file, ParcelFileDescriptor.MODE_READ_ONLY)
            } catch (_: Exception) {
                null
            }

            if (descriptor == null) {
                mainHandler.post {
                    if (token == loadToken) {
                        emitOnError("Unable to open PDF file.", "E_OPEN_FILE")
                    }
                    if (isTemp) {
                        file.delete()
                    }
                }
                return@submit
            }

            val pdfRenderer = try {
                PdfRenderer(descriptor)
            } catch (_: Exception) {
                try {
                    descriptor.close()
                } catch (_: Exception) {
                    // ignored
                }
                mainHandler.post {
                    if (token == loadToken) {
                        emitOnError("Failed to parse PDF.", "E_PDF_PARSE")
                    }
                    if (isTemp) {
                        file.delete()
                    }
                }
                return@submit
            }

            val count = pdfRenderer.pageCount
            mainHandler.post {
                if (token != loadToken) {
                    closeRenderer(pdfRenderer, descriptor)
                    if (isTemp) {
                        file.delete()
                    }
                    return@post
                }
                setActiveRenderer(
                    pdfRenderer,
                    descriptor,
                    count,
                    tempFile = if (isTemp) file else null
                )
            }
        }
    }

    private fun openPdfFromContentUri(uri: Uri, token: Int) {
        loadFuture = renderExecutor.submit {
            val descriptor = try {
                context.contentResolver.openFileDescriptor(uri, "r")
            } catch (_: Exception) {
                null
            }

            if (descriptor == null) {
                mainHandler.post {
                    if (token == loadToken) {
                        emitOnError("Unable to open PDF URI.", "E_OPEN_URI")
                    }
                }
                return@submit
            }

            val pdfRenderer = try {
                PdfRenderer(descriptor)
            } catch (_: Exception) {
                try {
                    descriptor.close()
                } catch (_: Exception) {
                    // ignored
                }
                mainHandler.post {
                    if (token == loadToken) {
                        emitOnError("Failed to parse PDF.", "E_PDF_PARSE")
                    }
                }
                return@submit
            }

            val count = pdfRenderer.pageCount
            mainHandler.post {
                if (token != loadToken) {
                    closeRenderer(pdfRenderer, descriptor)
                    return@post
                }
                setActiveRenderer(pdfRenderer, descriptor, count, tempFile = null)
            }
        }
    }

    private fun downloadRemotePdf(source: String, token: Int) {
        loadFuture = renderExecutor.submit {
            var connection: HttpURLConnection? = null
            try {
                connection = (URL(source).openConnection() as HttpURLConnection).apply {
                    connectTimeout = 15000
                    readTimeout = 15000
                    instanceFollowRedirects = true
                }
                synchronized(connectionLock) {
                    activeConnection = connection
                }

                val responseCode = connection.responseCode
                if (responseCode !in 200..299) {
                    throw IOException("HTTP $responseCode")
                }

                val tempFile = File.createTempFile("native_pdf_", ".pdf", context.cacheDir)
                connection.inputStream.use { input ->
                    FileOutputStream(tempFile).use { output ->
                        input.copyTo(output)
                    }
                }

                mainHandler.post {
                    if (token != loadToken) {
                        tempFile.delete()
                        return@post
                    }
                    openPdfFromFile(tempFile, isTemp = true, token = token)
                }
            } catch (_: Exception) {
                mainHandler.post {
                    if (token == loadToken) {
                        emitOnError("Failed to download PDF.", "E_DOWNLOAD")
                    }
                }
            } finally {
                synchronized(connectionLock) {
                    if (activeConnection == connection) {
                        activeConnection = null
                    }
                }
                connection?.disconnect()
            }
        }
    }

    private fun setActiveRenderer(
        pdfRenderer: PdfRenderer,
        descriptor: ParcelFileDescriptor,
        pageCount: Int,
        tempFile: File?
    ) {
        clearRenderer()

        renderer = pdfRenderer
        pfd = descriptor
        this.pageCount = pageCount
        cacheFile = tempFile
        cacheFileIsTemp = tempFile != null

        if (pageCount <= 0) {
            emitOnError("PDF has no pages.", "E_PDF_EMPTY")
            clearDocument()
            return
        }

        pendingLoadEvent = true
        currentPage = clampPage(requestedPage, pageCount)
        imageView.setImageDrawable(null)
        requestRenderCurrentPage()
    }

    private fun applyPageFromProps() {
        if (pageCount <= 0) {
            return
        }
        val clamped = clampPage(requestedPage, pageCount)
        if (clamped == currentPage) {
            return
        }
        currentPage = clamped
        requestRenderCurrentPage()
    }

    private fun goToPage(pageIndex: Int, userInitiated: Boolean) {
        if (pageCount <= 0) {
            return
        }
        val clamped = clampPage(pageIndex, pageCount)
        if (clamped == currentPage) {
            return
        }
        requestedPage = clamped
        currentPage = clamped
        requestRenderCurrentPage()
        if (userInitiated) {
            emitOnPageChanged(clamped)
        }
    }

    private fun requestRenderCurrentPage() {
        if (renderer == null) {
            return
        }
        val renderWidth = renderTargetWidthPx()
        if (renderWidth <= 0) {
            return
        }

        val pageIndex = currentPage
        val token = ++renderToken
        val cacheKey = "$pageIndex@$renderWidth"
        bitmapCache.get(cacheKey)?.let { cached ->
            imageView.setImageBitmap(cached)
            if (pendingLoadEvent) {
                pendingLoadEvent = false
                emitOnLoad(pageCount, currentPage)
            }
            return
        }

        renderExecutor.submit {
            val pdfRenderer = renderer ?: return@submit
            if (token != renderToken) {
                return@submit
            }
            val bitmap = try {
                pdfRenderer.openPage(pageIndex).use { page ->
                    val targetWidth = renderWidth.coerceAtLeast(1)
                    val scaleFactor = targetWidth.toFloat() / page.width.toFloat()
                    val targetHeight =
                        (page.height.toFloat() * scaleFactor).roundToInt().coerceAtLeast(1)
                    createBitmap(targetWidth, targetHeight).also {
                        it.eraseColor(Color.WHITE)
                        page.render(
                            it,
                            /* destClip */ null,
                            /* transform */ null,
                            PdfRenderer.Page.RENDER_MODE_FOR_DISPLAY
                        )
                    }
                }
            } catch (_: Exception) {
                null
            }

            mainHandler.post {
                if (token != renderToken) {
                    return@post
                }
                if (bitmap == null) {
                    pendingLoadEvent = false
                    emitOnError("Failed to render PDF page.", "E_RENDER")
                    return@post
                }
                bitmapCache.put(cacheKey, bitmap)
                imageView.setImageBitmap(bitmap)
                if (pendingLoadEvent) {
                    pendingLoadEvent = false
                    emitOnLoad(pageCount, currentPage)
                }
            }
        }
    }

    private fun renderTargetWidthPx(): Int {
        val baseWidth = width.takeIf { it > 0 } ?: measuredWidth
        if (baseWidth <= 0) {
            return 0
        }
        val rawScale = if (scale > 0.0) scale else 1.0
        val clampedScale = rawScale.coerceIn(0.5, 3.0)
        return (baseWidth.toDouble() * clampedScale).roundToInt().coerceAtLeast(1)
    }

    private fun cancelLoading() {
        loadFuture?.cancel(true)
        loadFuture = null
        synchronized(connectionLock) {
            activeConnection?.disconnect()
            activeConnection = null
        }
    }

    private fun clearDocument() {
        invalidateRenders()
        clearRenderer()
        bitmapCache.evictAll()
        pendingLoadEvent = false
        pageCount = 0
        currentPage = 0
        imageView.setImageDrawable(null)
    }

    private fun invalidateRenders() {
        renderToken += 1
    }

    private fun clearRenderer() {
        renderer?.let { existingRenderer ->
            pfd?.let { existingPfd ->
                closeRenderer(existingRenderer, existingPfd)
            } ?: run {
                try {
                    existingRenderer.close()
                } catch (_: Exception) {
                    // ignored
                }
            }
        }
        renderer = null
        pfd = null

        if (cacheFileIsTemp) {
            cacheFile?.delete()
        }
        cacheFile = null
        cacheFileIsTemp = false
    }

    private fun closeRenderer(pdfRenderer: PdfRenderer, descriptor: ParcelFileDescriptor) {
        try {
            pdfRenderer.close()
        } catch (_: Exception) {
            // ignored
        }
        try {
            descriptor.close()
        } catch (_: Exception) {
            // ignored
        }
    }

    private fun clampPage(page: Int, count: Int): Int {
        if (count <= 0) {
            return 0
        }
        return page.coerceIn(0, count - 1)
    }

    private fun cacheSizeKb(): Int {
        val maxMemoryKb = (Runtime.getRuntime().maxMemory() / 1024).toInt()
        return (maxMemoryKb / 8).coerceIn(8 * 1024, 32 * 1024)
    }

    private fun emitOnLoad(pageCount: Int, page: Int) {
        val reactContext = context as? ReactContext ?: return
        val surfaceId = UIManagerHelper.getSurfaceId(reactContext)
        val eventDispatcher = UIManagerHelper.getEventDispatcherForReactTag(reactContext, id)
        val payload = Arguments.createMap().apply {
            putInt("pageCount", pageCount)
            putInt("page", page)
        }
        val event = OnLoadEvent(surfaceId, id, payload)
        eventDispatcher?.dispatchEvent(event)
    }

    private fun emitOnPageChanged(page: Int) {
        val reactContext = context as? ReactContext ?: return
        val surfaceId = UIManagerHelper.getSurfaceId(reactContext)
        val eventDispatcher = UIManagerHelper.getEventDispatcherForReactTag(reactContext, id)
        val payload = Arguments.createMap().apply {
            putInt("page", page)
        }
        val event = OnPageChangedEvent(surfaceId, id, payload)
        eventDispatcher?.dispatchEvent(event)
    }

    private fun emitOnError(message: String, code: String) {
        val reactContext = context as? ReactContext ?: return
        val surfaceId = UIManagerHelper.getSurfaceId(reactContext)
        val eventDispatcher = UIManagerHelper.getEventDispatcherForReactTag(reactContext, id)
        val payload = Arguments.createMap().apply {
            putString("message", message)
            putString("code", code)
        }
        val event = OnErrorEvent(surfaceId, id, payload)
        eventDispatcher?.dispatchEvent(event)
    }

    inner class OnLoadEvent(
        surfaceId: Int,
        viewId: Int,
        private val payload: WritableMap
    ) : Event<OnLoadEvent>(surfaceId, viewId) {
        override fun getEventName() = "onLoad"
        override fun getEventData() = payload
    }

    inner class OnPageChangedEvent(
        surfaceId: Int,
        viewId: Int,
        private val payload: WritableMap
    ) : Event<OnPageChangedEvent>(surfaceId, viewId) {
        override fun getEventName() = "onPageChanged"
        override fun getEventData() = payload
    }

    inner class OnErrorEvent(
        surfaceId: Int,
        viewId: Int,
        private val payload: WritableMap
    ) : Event<OnErrorEvent>(surfaceId, viewId) {
        override fun getEventName() = "onError"
        override fun getEventData() = payload
    }
}
