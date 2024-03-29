/* eslint-disable class-methods-use-this */
import { omit } from 'lodash';
import { getManager } from 'typeorm';
import { Directory, File } from '../../common/models';
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

export type UpdateDirectory = Pick<Directory, 'id'> &
  Partial<Omit<Directory, 'id' | 'workspace'>> & {
    workspace: { id: string };
  };

export class DirectoryService {
  async importToWorkspace({
    workspaceId,
    directories,
  }: ImportDirectoriesToWorkspace): Promise<Directory[]> {
    return Directory.save(
      Directory.create(
        directories.map((dir) => ({
          ...dir,
          workspace: { id: workspaceId },
          files: Array.isArray(dir.files)
            ? dir.files.map((file) => File.create(file))
            : [],
        }))
      )
    ).then(normalizeEntity);
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

  async syncFiles(directories: SyncDirectoryFiles[]): Promise<void> {
    const entityManager = getManager();

    return entityManager.transaction(async (tEntityManager) => {
      await tEntityManager
        .createQueryBuilder()
        .delete()
        .from(File)
        .where('directory.id IN (:...ids)', {
          ids: directories.map((x) => x.directoryId),
        })
        .execute();

      await tEntityManager.save<Directory>(
        await Promise.all(
          directories.map(async (x) => {
            const directory = await tEntityManager.findOne<Directory>(
              Directory,
              x.directoryId
            );
            directory.files = x.files.map((file) => File.create(file));
            return directory;
          })
        )
      );
    });
  }

  async update(directory: UpdateDirectory) {
    const dir = await Directory.getRepository()
      .createQueryBuilder('directory')
      .leftJoinAndSelect('directory.workspace', 'workspace')
      .where({
        id: directory.id,
      })
      .getOne();
    if (dir == null) {
      return dir;
    }

    let changed = false;
    Object.entries(omit(directory, 'id')).forEach(([key, value]) => {
      if (!Object.prototype.hasOwnProperty.call(dir, key)) {
        return;
      }

      changed = true;
      dir[key] = value;
    });

    let result = dir;
    if (changed) {
      result = await dir.save();
    }

    return normalizeEntity(result);
  }
}

export default new DirectoryService();
