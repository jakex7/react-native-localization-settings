import {
  ConfigPlugin,
  IOSConfig,
  withXcodeProject,
} from '@expo/config-plugins';

const generateLocalizableContent = (
  languages: string[],
  defaultLanguage?: string
) => `{
  "sourceLanguage" : "${defaultLanguage || languages[0]}",
  "strings" : {
    "react-native-localization-settings" : {
      "extractionState" : "manual",
      "localizations" : {
        ${languages
          .map(
            (lang) =>
              `"${lang}" : {"stringUnit" : {"state" : "translated","value" : ""}},`
          )
          .join('\n        ')}
      }
    }
  },
  "version" : "1.0"
}`;

export const withIosLanguages: ConfigPlugin<{
  defaultLanguage?: string;
  languages?: string[];
}> = (config, { defaultLanguage, languages = [] } = {}) => {
  config = withXcodeProject(config, (config) => {
    const project = config.modResults;
    const projectObject =
      project.pbxProjectSection()[project.getFirstProject().uuid];
    if (projectObject) {
      // Add known regions to the project
      projectObject.knownRegions = languages;

      // Write the Localizable.xcstrings file
      IOSConfig.XcodeProjectFile.createBuildSourceFile({
        project,
        nativeProjectRoot: config.modRequest.platformProjectRoot,
        filePath: 'Localizable.xcstrings',
        fileContents: generateLocalizableContent(languages, defaultLanguage),
        overwrite: true,
      });
    }
    return config;
  });
  return config;
};
