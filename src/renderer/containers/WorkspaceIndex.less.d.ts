declare namespace WorkspaceIndexLessNamespace {
  export interface IWorkspaceIndexLess {
    'workspace-index-container': string;
  }
}

declare const WorkspaceIndexLessModule: WorkspaceIndexLessNamespace.IWorkspaceIndexLess & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: WorkspaceIndexLessNamespace.IWorkspaceIndexLess;
};

export = WorkspaceIndexLessModule;
