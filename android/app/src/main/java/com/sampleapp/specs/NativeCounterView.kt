package com.sampleapp.specs

import android.content.Context
import android.util.AttributeSet
import android.view.Gravity
import android.view.ViewGroup.LayoutParams
import android.view.ViewGroup.LayoutParams.MATCH_PARENT
import androidx.appcompat.widget.AppCompatTextView
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.WritableMap
import com.facebook.react.uimanager.UIManagerHelper
import com.facebook.react.uimanager.events.Event

class NativeCounterView : AppCompatTextView {
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

    private var countValue = 0
    private var labelValue = "Count"

    private fun configureComponent() {
        layoutParams = LayoutParams(MATCH_PARENT, MATCH_PARENT)
        gravity = Gravity.CENTER
        textSize = 16f
        isClickable = true
        updateText()
        setOnClickListener {
            countValue += 1
            updateText()
            emitOnPress(countValue.toDouble())
        }
    }

    fun setCount(count: Int) {
        countValue = count
        updateText()
    }

    fun setLabel(label: String?) {
        labelValue = label?.takeIf { it.isNotBlank() } ?: "Count"
        updateText()
    }

    private fun updateText() {
        "$labelValue: $countValue".also { text = it }
    }

    private fun emitOnPress(count: Double) {
        val reactContext = context as ReactContext
        val surfaceId = UIManagerHelper.getSurfaceId(reactContext)
        val eventDispatcher = UIManagerHelper.getEventDispatcherForReactTag(reactContext, id)
        val payload = Arguments.createMap().apply {
            putDouble("count", count)
        }
        val event = OnPressEvent(surfaceId, id, payload)
        eventDispatcher?.dispatchEvent(event)
    }

    inner class OnPressEvent(
        surfaceId: Int, viewId: Int, private val payload: WritableMap
    ) : Event<OnPressEvent>(surfaceId, viewId) {
        override fun getEventName() = "onPress"
        override fun getEventData() = payload
    }
}
