declare namespace WorkspaceItemLessNamespace {
  export interface IWorkspaceItemLess {
    'add-directory': string;
    anticon: string;
  }
}

declare const WorkspaceItemLessModule: WorkspaceItemLessNamespace.IWorkspaceItemLess & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: WorkspaceItemLessNamespace.IWorkspaceItemLess;
};

export = WorkspaceItemLessModule;
