import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  getLanguage(): Promise<string>;
  setLanguage(lang: string): void;
  language: string;
}

export default TurboModuleRegistry.getEnforcing<Spec>('LocalizationSettings');
