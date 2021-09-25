declare namespace FileListCardLessNamespace {
  export interface IFileListCardLess {
    'file-item': string;
    'file-name': string;
  }
}

declare const FileListCardLessModule: FileListCardLessNamespace.IFileListCardLess & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: FileListCardLessNamespace.IFileListCardLess;
};

export = FileListCardLessModule;
