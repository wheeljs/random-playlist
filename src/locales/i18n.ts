import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en.json';
import zhCN from './zh-CN.json';

i18n.use(initReactI18next).init({
  resources: {
    'zh-CN': {
      translation: zhCN,
    },
    en: {
      translation: en,
    },
  },
  supportedLngs: ['zh-CN', 'en'],
  fallbackLng: 'en',
});

export default i18n;
