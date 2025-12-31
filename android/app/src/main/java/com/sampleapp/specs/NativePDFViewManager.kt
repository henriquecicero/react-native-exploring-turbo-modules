package com.sampleapp.specs

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewManagerDelegate
import com.facebook.react.uimanager.annotations.ReactProp
import com.facebook.react.viewmanagers.NativePDFViewManagerDelegate
import com.facebook.react.viewmanagers.NativePDFViewManagerInterface

@ReactModule(name = NativePDFViewManager.REACT_CLASS)
class NativePDFViewManager(context: ReactApplicationContext) :
    SimpleViewManager<NativePDFView>(), NativePDFViewManagerInterface<NativePDFView> {
    private val delegate: NativePDFViewManagerDelegate<NativePDFView, NativePDFViewManager> =
        NativePDFViewManagerDelegate(this)

    override fun getDelegate(): ViewManagerDelegate<NativePDFView> = delegate

    override fun getName(): String = REACT_CLASS

    override fun createViewInstance(context: ThemedReactContext): NativePDFView =
        NativePDFView(context)

    @ReactProp(name = "sourceURL")
    override fun setSourceURL(view: NativePDFView, sourceURL: String?) {
        view.setSourceURL(sourceURL)
    }

    @ReactProp(name = "page")
    override fun setPage(view: NativePDFView, page: Int) {
        view.setPage(page)
    }

    @ReactProp(name = "scale")
    override fun setScale(view: NativePDFView, scale: Double) {
        view.setScale(scale)
    }

    @ReactProp(name = "pagingEnabled")
    override fun setPagingEnabled(view: NativePDFView, pagingEnabled: Boolean) {
        view.setPagingEnabled(pagingEnabled)
    }

    companion object {
        const val REACT_CLASS = "NativePDFView"
    }

    override fun getExportedCustomBubblingEventTypeConstants(): Map<String, Any> = mapOf(
        "onLoad" to mapOf(
            "phasedRegistrationNames" to mapOf(
                "bubbled" to "onLoad",
                "captured" to "onLoadCapture"
            )
        ),
        "onPageChanged" to mapOf(
            "phasedRegistrationNames" to mapOf(
                "bubbled" to "onPageChanged",
                "captured" to "onPageChangedCapture"
            )
        ),
        "onError" to mapOf(
            "phasedRegistrationNames" to mapOf(
                "bubbled" to "onError",
                "captured" to "onErrorCapture"
            )
        )
    )
}
