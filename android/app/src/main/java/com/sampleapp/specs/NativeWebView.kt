package com.sampleapp.specs

import android.content.Context
import android.util.AttributeSet
import android.view.ViewGroup.LayoutParams.MATCH_PARENT
import android.webkit.WebView
import android.webkit.WebViewClient
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.WritableMap
import com.facebook.react.uimanager.events.Event
import com.facebook.react.uimanager.UIManagerHelper

class NativeWebView : WebView {
    constructor(context: Context) : super(context) {
        configureComponent()
    }

    constructor(context: Context, attrs: AttributeSet?) : super(context) {
        configureComponent()
    }

    constructor(context: Context, attrs: AttributeSet?, defStyleAttr: Int) : super(
        context, attrs, defStyleAttr
    ) {
        configureComponent()
    }

    private fun configureComponent() {
        this.layoutParams = LayoutParams(MATCH_PARENT, MATCH_PARENT)
        this.webViewClient = object : WebViewClient() {
            override fun onPageFinished(view: WebView, url: String) {
                emitOnScriptLoaded(OnScriptLoadedResult.Success)
            }
        }
    }

    fun emitOnScriptLoaded(result: OnScriptLoadedResult) {
        val reactContext = context as ReactContext
        val surfaceId = UIManagerHelper.getSurfaceId(reactContext)
        val eventDispatcher = UIManagerHelper.getEventDispatcherForReactTag(reactContext, id)
        val payload = Arguments.createMap().apply {
            putString("result", result.name)
        }
        val event = OnScripLoadedEvent(surfaceId, id, payload)
        eventDispatcher?.dispatchEvent(event)
    }

    enum class OnScriptLoadedResult {
        Success, Error,
    }

    inner class OnScripLoadedEvent(
        surfaceId: Int, viewId: Int, private val payload: WritableMap
    ) : Event<OnScripLoadedEvent>(surfaceId, viewId) {
        override fun getEventName() = "onScriptLoaded"
        override fun getEventData() = payload
    }
}