import * as React from 'react';

import { StyleSheet, View, Text, Button } from 'react-native';
import { ReactNativeLanguageDetector } from 'react-native-localization-settings';
import i18next from 'i18next';
import { initReactI18next, useTranslation } from 'react-i18next';

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

  return (
    <View style={styles.container}>
      <Text>{t('key')}</Text>
      <Button
        title={'change to pl'}
        onPress={() => i18next.changeLanguage('pl-PL')}
      />
      <Button
        title={'change to en'}
        onPress={() => i18next.changeLanguage('en-US')}
      />
      <Button
        title={'change to fr'}
        onPress={() => i18next.changeLanguage('fr-FR')}
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
