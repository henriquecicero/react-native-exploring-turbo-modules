package com.sampleapp.specs

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewManagerDelegate
import com.facebook.react.uimanager.annotations.ReactProp
import com.facebook.react.viewmanagers.NativeWebViewManagerInterface
import com.facebook.react.viewmanagers.NativeWebViewManagerDelegate

@ReactModule(name = NativeWebViewManager.REACT_CLASS)
class NativeWebViewManager(context: ReactApplicationContext) :
    SimpleViewManager<NativeWebView>(), NativeWebViewManagerInterface<NativeWebView> {
    private val delegate: NativeWebViewManagerDelegate<NativeWebView, NativeWebViewManager> =
        NativeWebViewManagerDelegate(this)

    override fun getDelegate(): ViewManagerDelegate<NativeWebView> = delegate

    override fun getName(): String = REACT_CLASS

    override fun createViewInstance(context: ThemedReactContext): NativeWebView =
        NativeWebView(context)

    @ReactProp(name = "sourceUrl")
    override fun setSourceURL(view: NativeWebView, sourceUrl: String?) {
        if (sourceUrl == null) {
            view.emitOnScriptLoaded(NativeWebView.OnScriptLoadedResult.Error)
            return;
        }
        view.loadUrl(sourceUrl, emptyMap())
    }

    companion object {
        const val REACT_CLASS = "NativeWebView"
    }

    override fun getExportedCustomBubblingEventTypeConstants(): Map<String, Any> = mapOf(
        "onScriptLoaded" to mapOf(
            "phasedRegistrationNames" to mapOf(
                "bubbled" to "onScriptLoaded",
                "captured" to "onScriptLoadedCapture"
            )
        )
    )
}