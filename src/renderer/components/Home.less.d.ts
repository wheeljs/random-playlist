declare namespace HomeLessNamespace {
  export interface IHomeLess {
    'ant-tabs': string;
    'ant-tabs-nav': string;
    'ant-tabs-nav-wrap': string;
    'home-container': string;
  }
}

declare const HomeLessModule: HomeLessNamespace.IHomeLess & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: HomeLessNamespace.IHomeLess;
};

export = HomeLessModule;
