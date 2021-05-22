/* eslint-disable class-methods-use-this */
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
    const directory = await Directory.findOne(directoryId);
    if (directory == null) {
      return directory;
    }

    return normalizeEntity(await directory.softRemove());
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
