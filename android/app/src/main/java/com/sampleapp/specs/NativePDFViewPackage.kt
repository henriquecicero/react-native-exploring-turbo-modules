package com.sampleapp.specs

import com.facebook.react.BaseReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.module.model.ReactModuleInfoProvider
import com.facebook.react.uimanager.ViewManager

class NativePDFViewPackage : BaseReactPackage() {
    override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
        return listOf(NativePDFViewManager(reactContext))
    }

    override fun getModule(
        name: String,
        reactContext: ReactApplicationContext
    ): NativeModule? {
        when (name) {
            NativePDFViewManager.REACT_CLASS -> return NativePDFViewManager(reactContext)
        }
        return null
    }

    override fun getReactModuleInfoProvider(): ReactModuleInfoProvider = ReactModuleInfoProvider {
        mapOf(
            NativePDFViewManager.REACT_CLASS to ReactModuleInfo(
                name = NativePDFViewManager.REACT_CLASS,
                className = NativePDFViewManager.REACT_CLASS,
                canOverrideExistingModule = false,
                needsEagerInit = false,
                isCxxModule = false,
                isTurboModule = true
            )
        )
    }
}
