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
 * Get language
 * @returns Language in IETF BCP 47 format (like 'en-US')
 * @example
 * console.log(getLanguage())
 */
export function getLanguage(): string {
  LocalizationSettings.getLanguage();
  return LocalizationSettings.getConstants().language.split('_')[0];
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
 * i18next language detector
 * @example
 * Usage:
 * i18next
 *   .use(ReactNativeLanguageDetector)
 *   .init({
 *     ...
 *   });
 */
export const ReactNativeLanguageDetector: I18nLanguageDetectorModule = {
  type: 'languageDetector',
  init: () => {},
  detect: () => getLanguage(),
  cacheUserLanguage: (lng: string) => setLanguage(lng),
};

interface I18nLanguageDetectorModule {
  type: 'languageDetector';
  init?(): void;
  detect(): string | readonly string[] | undefined;
  cacheUserLanguage?(lng: string): void;
}
