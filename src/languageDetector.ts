import { getLanguage, getLanguageAsync, setLanguage } from './api';

interface I18nLanguageDetectorModule {
  type: 'languageDetector';
  init?(): void;
  detect(): string | readonly string[] | undefined;
  cacheUserLanguage?(lang: string): void;
}
interface I18nLanguageDetectorAsyncModule {
  type: 'languageDetector';
  async: true;
  init?(): void;
  detect(
    callback: (lng: string | readonly string[] | undefined) => void | undefined
  ): void | Promise<string | readonly string[] | undefined>;
  cacheUserLanguage?(lng: string): void | Promise<void>;
}

type LanguageDetectorOptions = {
  cacheCurrentLanguage?: boolean;
  async?: boolean;
};

/**
 * @deprecated Use createLanguageDetector instead
 */
export const ReactNativeLanguageDetector: I18nLanguageDetectorModule = {
  type: 'languageDetector',
  init: () => {},
  detect: () => getLanguage(),
  cacheUserLanguage: (lang: string) => setLanguage(lang),
};

/**
 * I18next language detector generator
 * @param options - detector options
 * @returns I18nLanguageDetectorModule | I18nLanguageDetectorAsyncModule
 * @example
 * Usage:
 * const languageDetector = createLanguageDetector(options);
 * i18next
 *   .use(languageDetector)
 *   .init({
 *     ...
 *   });
 */
export const createLanguageDetector = (
  options?: LanguageDetectorOptions
): I18nLanguageDetectorModule | I18nLanguageDetectorAsyncModule => {
  const { cacheCurrentLanguage = false } = options || {};
  let skipNextCache = false;

  let languageDetector:
    | I18nLanguageDetectorModule
    | I18nLanguageDetectorAsyncModule = {
    type: 'languageDetector',
    init: () => {
      skipNextCache = true;
    },
    detect: () => getLanguage(),
    cacheUserLanguage: (lang: string) => {
      if (cacheCurrentLanguage === false && skipNextCache) {
        skipNextCache = false;
        return;
      }
      setLanguage(lang);
    },
  };
  if (options?.async) {
    languageDetector = {
      ...languageDetector,
      async: true,
      detect: (callback) => {
        getLanguageAsync().then(callback);
      },
    };
  }
  return languageDetector;
};
