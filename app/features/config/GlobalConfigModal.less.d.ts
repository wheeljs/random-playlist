declare namespace GlobalConfigModalLessNamespace {
  export interface IGlobalConfigModalLess {
    'config-category': string;
  }
}

declare const GlobalConfigModalLessModule: GlobalConfigModalLessNamespace.IGlobalConfigModalLess & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: GlobalConfigModalLessNamespace.IGlobalConfigModalLess;
};

export = GlobalConfigModalLessModule;
