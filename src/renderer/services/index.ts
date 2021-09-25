import configService from './config';
import workspaceService from './workspace';
import directoryService from './directory';

export type { SaveWorkspace, UpdateWorkspace } from './workspace';
export type { UpdateDirectory } from './directory';
export type { ConfigKeys } from './config';

export { configService, workspaceService, directoryService };

export default {
  configService,
  workspaceService,
  directoryService,
};
