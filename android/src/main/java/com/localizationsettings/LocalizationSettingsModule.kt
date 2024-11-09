package com.localizationsettings

import android.content.Context
import android.content.SharedPreferences
import android.os.Build
import androidx.appcompat.app.AppCompatDelegate
import androidx.core.os.LocaleListCompat
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactMethod
import java.util.*


class LocalizationSettingsModule internal constructor(context: ReactApplicationContext) :
  LocalizationSettingsSpec(context) {

  override fun getName(): String {
    return NAME
  }

  /**
   * Get IETF BCP 47 (language-COUNTRY "pl-PL")
   * if country is not available in locale, then use system defaults (even if it's not 100% correct, like "pl-US")
   **/
  private fun getLanguageTag(language: String): String {
    val locale = Locale.forLanguageTag(language);

    // if language has format language-COUNTRY, then return it
    if (locale.country != "") return locale.toLanguageTag()
    // fallback for system country
    return Locale(locale.language, Locale.getDefault().country).toLanguageTag()
  }


  /**
   * Get current language
   * returns string in IETF BCP 47 (language-COUNTRY "pl-PL")
   *  If API version >= 33, use native per-app language feature
   *  else, fallback to SharedPreferences
   **/
  private fun getCurrentLanguage(): String? {
    // If API version is >= 33, then use per-app language settings
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
      val currentLocaleName = if (!AppCompatDelegate.getApplicationLocales().isEmpty) {
        // get per-app language
        AppCompatDelegate.getApplicationLocales()[0]?.toLanguageTag()
      } else {
        // Fallback to the default System Locale
        Locale.getDefault().toLanguageTag()
      }
      return currentLocaleName
    }
    // if API is < 33, then use SharedPreferences with fallback to default System Locale
    if (getPreferences().getString("languageFrom", null) == Locale.getDefault().language) {
      return getPreferences().getString("language", Locale.getDefault().toLanguageTag())
    }
    return Locale.getDefault().toLanguageTag()
  }


  /**
   * Set current language
   * passed language can be in ISO 639-1 (language "pl")
   * or IETF BCP 47 (language-COUNTRY "pl-PL")
   *  If API version >= 33, use native per-app language feature
   *  else, fallback to SharedPreferences
   **/
  private fun setCurrentLanguage(language: String) {
    // If API version is >= 33, then use per-app language settings
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
      val localeList = LocaleListCompat.forLanguageTags(getLanguageTag(language))
      AppCompatDelegate.setApplicationLocales(localeList)
    } else {
      // if API is < 33, then set SharedPreferences language
      val editor = getEditor();
      editor.putString("languageFrom", Locale.getDefault().language)
      editor.putString("language", getLanguageTag(language))
      editor.apply()
    }
  }


  /**
   * Expose functions to react-native
   **/
  @ReactMethod
  override fun getLanguage(promise: Promise) {
    promise.resolve(getCurrentLanguage())
  }

  @ReactMethod
  override fun setLanguage(language: String) {
    setCurrentLanguage(language)
  }

  /**
   * Expose constants to react-native
   **/
  override fun getTypedExportedConstants(): MutableMap<String, String?>? {
    val constants: MutableMap<String, String?> = HashMap()
    constants["language"] = getCurrentLanguage()
    return constants
  }

  /**
   * SharedPreferences (only used when API version is below 33)
   **/
  private fun getPreferences(): SharedPreferences {
    return reactApplicationContext.getSharedPreferences(
      "LocalizationSettings", Context.MODE_PRIVATE
    )
  }

  private fun getEditor(): SharedPreferences.Editor {
    return getPreferences().edit()
  }

  companion object {
    const val NAME = "LocalizationSettings"
  }
}
