import type { ConfigService } from './config';
import type { WorkspaceService } from './workspace';
import type { DirectoryService } from './directory';
import { rendererService } from './util';

export * from './config';
export * from './workspace';
export * from './directory';

const configService = rendererService<ConfigService>('configService');

const workspaceService = rendererService<WorkspaceService>('workspaceService');

const directoryService = rendererService<DirectoryService>('directoryService');

export { configService, workspaceService, directoryService };

export default {
  configService,
  workspaceService,
  directoryService,
};
