package com.sampleapp.specs

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewManagerDelegate
import com.facebook.react.uimanager.annotations.ReactProp
import com.facebook.react.viewmanagers.NativeCounterViewManagerDelegate
import com.facebook.react.viewmanagers.NativeCounterViewManagerInterface

@ReactModule(name = NativeCounterViewManager.REACT_CLASS)
class NativeCounterViewManager(context: ReactApplicationContext) :
    SimpleViewManager<NativeCounterView>(),
    NativeCounterViewManagerInterface<NativeCounterView> {
    private val delegate:
            NativeCounterViewManagerDelegate<NativeCounterView, NativeCounterViewManager> =
        NativeCounterViewManagerDelegate(this)

    override fun getDelegate(): ViewManagerDelegate<NativeCounterView> = delegate

    override fun getName(): String = REACT_CLASS

    override fun createViewInstance(context: ThemedReactContext): NativeCounterView =
        NativeCounterView(context)

    @ReactProp(name = "label")
    override fun setLabel(view: NativeCounterView, label: String?) {
        view.setLabel(label)
    }

    @ReactProp(name = "count")
    override fun setCount(view: NativeCounterView?, count: Double) {
        view?.setCount(count.toInt())
    }

    companion object {
        const val REACT_CLASS = "NativeCounterView"
    }

    override fun getExportedCustomBubblingEventTypeConstants(): Map<String, Any> = mapOf(
        "onPress" to mapOf(
            "phasedRegistrationNames" to mapOf(
                "bubbled" to "onPress",
                "captured" to "onPressCapture"
            )
        )
    )
}
