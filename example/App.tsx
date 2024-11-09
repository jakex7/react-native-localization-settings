import React from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import i18next from 'i18next';
import { initReactI18next, useTranslation } from 'react-i18next';
import {
  getLanguage,
  getLanguageAsync,
  ReactNativeLanguageDetector,
} from 'react-native-localization-settings';

i18next
  .use(ReactNativeLanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          key: 'hello world in english',
        },
      },
      pl: {
        translation: {
          key: 'hello world in polish',
        },
      },
      fr: {
        translation: {
          key: 'hello world in french',
        },
      },
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    compatibilityJSON: 'v3',
  });

export default function App() {
  const { t } = useTranslation();
  const [lang, setLang] = React.useState(getLanguage());

  const changeLanguage = (language: string) => () => {
    i18next.changeLanguage(language);
    setLang(getLanguage());
  };
  return (
    <View style={styles.container}>
      <Text>{t('key')}</Text>
      <Text>{lang}</Text>
      <Button title={'change to pl'} onPress={changeLanguage('pl-PL')} />
      <Button title={'change to en'} onPress={changeLanguage('en-US')} />
      <Button title={'change to fr'} onPress={changeLanguage('fr-FR')} />
      <Button
        title={'get language sync'}
        onPress={() => console.log(getLanguage())}
      />
      <Button
        title={'get language async'}
        onPress={() => getLanguageAsync().then(console.log)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
