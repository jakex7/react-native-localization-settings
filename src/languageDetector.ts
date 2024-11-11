import { getLanguage, setLanguage } from './api';

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
