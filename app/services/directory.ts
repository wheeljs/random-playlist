/* eslint-disable class-methods-use-this */
import { getManager } from 'typeorm';
import { Directory, File } from '../models';
import { normalizeEntity } from './util';

type FileForAdd = Pick<File, 'path' | 'extension' | 'duration' | 'thumb'>;

export interface ImportDirectoriesToWorkspace {
  workspaceId: string;
  directories: {
    path: string;
    glob?: string;
    files?: Promise<FileForAdd[]> | FileForAdd[];
  }[];
}

export interface SyncDirectoryFiles {
  directoryId: string;
  files: FileForAdd[];
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
            files: Array.isArray(dir.files)
              ? dir.files.map((file) => File.create(file))
              : [],
          }))
        )
      )
    );
  }

  async remove(directoryId: string): Promise<Directory> {
    const entityManager = getManager();
    const directory = await entityManager.findOne(Directory, directoryId);
    if (directory == null) {
      return directory;
    }

    await entityManager.transaction(async (tEntityManager) => {
      if (Array.isArray(directory.files) && directory.files.length > 0) {
        await tEntityManager.remove(directory.files);
      }

      await tEntityManager.softRemove(directory);
    });

    return normalizeEntity(directory);
  }

  async syncFiles(directories: SyncDirectoryFiles[]) {
    return normalizeEntity(
      await Directory.save(
        await Promise.all(
          directories.map(async (x) => {
            const directory = await Directory.findOne(x.directoryId);
            directory.files = x.files.map((file) => File.create(file));
            return directory;
          })
        )
      )
    );
  }
}

export default new DirectoryService();
