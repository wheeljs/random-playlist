/* eslint-disable class-methods-use-this */
import { Directory } from '../models';
import { normalizeEntity } from './util';

export interface ImportDirectoriesToWorkspace {
  workspaceId: string;
  directories: {
    path: string;
    glob?: string;
  }[];
}

export class DirectoryService {
  async importToWorkspace({
    workspaceId,
    directories,
  }: ImportDirectoriesToWorkspace): Promise<Directory[]> {
    return normalizeEntity(
      await Directory.save(
        Directory.create(
          directories.map((dir) => ({
            ...dir,
            workspace: { id: workspaceId },
          }))
        )
      )
    );
  }
}

export default new DirectoryService();
