package com.sampleapp.specs

import com.facebook.react.BaseReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.module.model.ReactModuleInfoProvider
import com.facebook.react.uimanager.ViewManager

class NativeCounterViewPackage : BaseReactPackage() {
    override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
        return listOf(NativeCounterViewManager(reactContext))
    }

    override fun getModule(
        name: String,
        reactContext: ReactApplicationContext
    ): NativeModule? {
        when (name) {
            NativeCounterViewManager.REACT_CLASS -> return NativeCounterViewManager(reactContext)
        }
        return null
    }

    override fun getReactModuleInfoProvider(): ReactModuleInfoProvider = ReactModuleInfoProvider {
        mapOf(
            NativeCounterViewManager.REACT_CLASS to ReactModuleInfo(
                name = NativeCounterViewManager.REACT_CLASS,
                className = NativeCounterViewManager.REACT_CLASS,
                canOverrideExistingModule = false,
                needsEagerInit = false,
                isCxxModule = false,
                isTurboModule = true
            )
        )
    }
}
