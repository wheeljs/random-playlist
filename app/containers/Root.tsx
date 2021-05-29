import React, { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { hot } from 'react-hot-loader/root';
import { History } from 'history';
import { ConfigProvider } from 'antd';
import { Locale } from 'antd/lib/locale-provider';
import enUS from 'antd/lib/locale/en_US';
import zhCN from 'antd/lib/locale/zh_CN';

import i18n from '../locales/i18n';
import { Store } from '../store';
import Routes from '../Routes';
import { SupportedLngs } from '../models';

type Props = {
  store: Store;
  history: History;
};

const AntdLocaleMapping = new Map<SupportedLngs, Locale>([
  ['zh-CN', zhCN],
  ['en', enUS],
]);

const Root = ({ store, history }: Props) => {
  const [locale, setLocale] = useState<Locale>(
    AntdLocaleMapping.get(
      AntdLocaleMapping.has(i18n.language) ? i18n.language : 'en'
    )
  );

  useEffect(() => {
    i18n.on('languageChanged', (lng: string) => {
      const antdLocale = AntdLocaleMapping.get(
        AntdLocaleMapping.has(lng) ? lng : 'en'
      );
      setLocale(antdLocale);
    });

    return () => {
      i18n.off('languageChanged');
    };
  }, [store]);

  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <ConfigProvider locale={locale}>
          <Routes />
        </ConfigProvider>
      </ConnectedRouter>
    </Provider>
  );
};

export default hot(Root);
