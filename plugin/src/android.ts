import {
  AndroidConfig,
  ConfigPlugin,
  withAndroidManifest,
} from '@expo/config-plugins';
import path from 'path';
import fs from 'fs';

export const withAndroidLanguages: ConfigPlugin<{
  languages?: string[];
}> = (config, { languages = [] } = {}) => {
  config = withAndroidManifest(config, (config) => {
    const mainApplication = AndroidConfig.Manifest.getMainApplicationOrThrow(
      config.modResults
    );

    // Add the `android:localeConfig` attribute to the `<application>` tag
    mainApplication.$['android:localeConfig'] = '@xml/locales_config';

    const localesConfigPath = path.join(
      config.modRequest.platformProjectRoot,
      'app/src/main/res/xml/locales_config.xml'
    );
    // Ensure the `res/xml` directory exists
    fs.mkdirSync(path.dirname(localesConfigPath), { recursive: true });

    // Prepare locales_config.xml content
    const xmlContent = `<?xml version="1.0" encoding="utf-8"?>
<locale-config xmlns:android="http://schemas.android.com/apk/res/android">
  ${languages.map((lang) => `<locale android:name="${lang}" />`).join('\n  ')}
</locale-config>`;

    // Write the `res/xml/locales_config.xml` file
    fs.writeFileSync(localesConfigPath, xmlContent);

    return config;
  });

  return config;
};
