import { ConfigPlugin } from '@expo/config-plugins';
import { withAndroidLanguages } from './android';
import { withIosLanguages } from './ios';

const withReactNativeLocalizationSettings: ConfigPlugin<{
  languages?: string[];
}> = (config, { languages = [] } = {}) => {
  config = withAndroidLanguages(config, { languages });
  config = withIosLanguages(config, { languages });

  return config;
};

export default withReactNativeLocalizationSettings;
