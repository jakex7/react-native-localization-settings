import { NativeModules, Platform } from 'react-native';

const LINKING_ERROR =
  `The package 'react-native-localization-settings' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

// @ts-expect-error
const isTurboModuleEnabled = global.__turboModuleProxy != null;

const LocalizationSettingsModule = isTurboModuleEnabled
  ? require('./NativeLocalizationSettings').default
  : NativeModules.LocalizationSettings;

const LocalizationSettings = LocalizationSettingsModule
  ? LocalizationSettingsModule
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

/**
 * Get language (sync)
 * @returns Language in IETF BCP 47 format (like 'en-US')
 * @example
 * console.log(getLanguage())
 */
export function getLanguage(): string {
  return LocalizationSettings.getConstants().language.split('_')[0];
}

/**
 * Get language (async)
 * @param fallback - fallback language
 * @returns Promise with Language in IETF BCP 47 format (like 'en-US')
 * @example
 * getLanguageAsync().then(console.log)
 */
export function getLanguageAsync(fallback?: string): Promise<string> {
  return LocalizationSettings.getLanguage()
    .then((res: string) => res.split('_'))
    .then((res: string[]) => {
      if (res[0]) {
        return res[0];
      }
      if (fallback) {
        return fallback;
      }
      throw new Error('Invalid language format');
    });
}

/**
 * Set language
 * @param language - locale string
 * @example
 * Usage:
 * setLanguage('en-US')
 *
 * Preferred format:
 * IETF BCP 47 format - "en-US"
 *
 * Other:
 * ISO 639-1 format - "en"
 *
 */
export function setLanguage(language: string): void {
  LocalizationSettings.setLanguage(language);
}

/**
 * Set default language (unset previously set language)
 * @example
 * Usage:
 * setDefaultLanguage()
 */
export function setDefaultLanguage(): void {
  LocalizationSettings.setDefaultLanguage();
}
