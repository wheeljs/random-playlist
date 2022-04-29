import { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import type { History } from 'history';
import { ConfigProvider } from 'antd';
import type { Locale } from 'antd/lib/locale-provider';
import enUS from 'antd/lib/locale/en_US';
import zhCN from 'antd/lib/locale/zh_CN';
import watchStore from 'redux-watch';
import { useTranslation } from 'react-i18next';

import i18n from '../locales/i18n';
import type { Store } from './store';
import Routes from './Routes';
import { selectConfig } from './store/features/config/configSlice';
import { ConfigKeys } from './services';
import type { SupportedLngs } from '../common/models';
import darkModeStyles from './antd-dark-mode.theme.less';

type Props = {
  store: Store;
  history: History;
};

const AntdLocaleMapping = new Map<SupportedLngs, Locale>([
  ['zh-CN', zhCN],
  ['en', enUS],
]);

const Root = ({ store, history }: Props) => {
  const { t } = useTranslation();

  const [locale, setLocale] = useState<Locale>(
    AntdLocaleMapping.get(
      AntdLocaleMapping.has(i18n.language) ? i18n.language : 'en'
    )
  );

  const [useDarkTheme, setUseDarkTheme] = useState<boolean>(
    store.getState().config.useDarkTheme
  );

  useEffect(() => {
    const watcher = watchStore(() => store.getState().config.useDarkTheme);
    const unsubcribe = store.subscribe(
      watcher((storeUseDarkTheme) => {
        setUseDarkTheme(storeUseDarkTheme);
        if (storeUseDarkTheme) {
          /* eslint-disable @typescript-eslint/ban-ts-comment */
          /* @ts-ignore */
          darkModeStyles.use();
        } else {
          /* @ts-ignore */
          darkModeStyles.unuse();
          /* eslint-enable @typescript-eslint/ban-ts-comment */
        }
      })
    );

    return () => {
      unsubcribe();
    };
  }, [store]);

  useEffect(() => {
    i18n.on('languageChanged', (lng: string) => {
      const antdLocale = AntdLocaleMapping.get(
        AntdLocaleMapping.has(lng) ? lng : 'en'
      );
      setLocale(antdLocale);
    });

    const watcher = watchStore(
      () => selectConfig(store.getState(), ConfigKeys.Language),
      'value'
    );
    const unsubscribe = store.subscribe(
      watcher((lng: SupportedLngs) => {
        i18n.changeLanguage(lng);
        document.title = t('appName');
      })
    );

    return () => {
      i18n.off('languageChanged');
      unsubscribe();
    };
  }, [store, t]);

  const antdPrefix = useDarkTheme ? 'dark-ant' : 'ant';

  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <ConfigProvider locale={locale} prefixCls={antdPrefix}>
          <Routes />
        </ConfigProvider>
      </ConnectedRouter>
    </Provider>
  );
};

export default Root;
