declare namespace WorkspaceItemLessNamespace {
  export interface IWorkspaceItemLess {
    'directories-container': string;
    'directory-actions': string;
    'directory-item': string;
    'directory-item-name': string;
    'directory-item-summary': string;
    'workspace-item': string;
  }
}

declare const WorkspaceItemLessModule: WorkspaceItemLessNamespace.IWorkspaceItemLess & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: WorkspaceItemLessNamespace.IWorkspaceItemLess;
};

export = WorkspaceItemLessModule;
