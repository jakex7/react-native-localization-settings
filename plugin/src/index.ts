import { ConfigPlugin } from '@expo/config-plugins';
import { withAndroidLanguages } from './android';
import { withIosLanguages } from './ios';

const withReactNativeLocalizationSettings: ConfigPlugin<{
  defaultLanguage?: string;
  languages?: string[];
}> = (config, { defaultLanguage, languages = [] } = {}) => {
  config = withAndroidLanguages(config, { languages });
  config = withIosLanguages(config, { defaultLanguage, languages });

  return config;
};

export default withReactNativeLocalizationSettings;
