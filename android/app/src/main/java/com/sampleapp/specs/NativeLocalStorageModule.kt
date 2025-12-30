package com.sampleapp.specs

import android.content.Context
import androidx.core.content.edit
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactApplicationContext

class NativeLocalStorageModule(
    reactContext: ReactApplicationContext
) : NativeLocalStorageSpec(reactContext) {

    private val prefs by lazy {
        reactApplicationContext.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
    }

    override fun getName() = NAME

    override fun setItem(value: String, key: String) {
        val existed = prefs.contains(key)
        prefs.edit { putString(key, value) }
        if (existed) {
            emitOnKeyAdded(
                Arguments.createMap().apply {
                    putString("key", key)
                    putString("value", value)
                }
            )
        }
    }

    override fun getItem(key: String): String? =
        prefs.getString(key, null)

    override fun removeItem(key: String) {
        prefs.edit { remove(key) }
    }

    override fun clear() {
        prefs.edit { clear() }
    }

    companion object {
        private const val PREFS_NAME = "my_prefs"
        const val NAME = "NativeLocalStorage"
    }
}
