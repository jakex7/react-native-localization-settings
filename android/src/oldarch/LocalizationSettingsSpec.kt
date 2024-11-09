package com.localizationsettings

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.Promise

abstract class LocalizationSettingsSpec internal constructor(context: ReactApplicationContext) :
  ReactContextBaseJavaModule(context) {

  abstract fun getLanguage(promise: Promise)
  abstract fun setLanguage(language: String)
  abstract fun getTypedExportedConstants(): Map<String, String?>?

  override fun getConstants(): Map<String, String?>? {
    return getTypedExportedConstants()
  }
}
