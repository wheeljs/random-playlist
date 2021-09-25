declare namespace ImportDirectoriesModalLessNamespace {
  export interface IImportDirectoriesModalLess {
    'import-path-container': string;
    'import-path-path': string;
    'import-path-summary-count': string;
  }
}

declare const ImportDirectoriesModalLessModule: ImportDirectoriesModalLessNamespace.IImportDirectoriesModalLess & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ImportDirectoriesModalLessNamespace.IImportDirectoriesModalLess;
};

export = ImportDirectoriesModalLessModule;
