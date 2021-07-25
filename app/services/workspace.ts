/* eslint-disable class-methods-use-this */
import { omit } from 'lodash-es';
import { ViewMode, Workspace } from '../models';

import { normalizeEntity } from './util';

export interface SaveWorkspace {
  name: string;
  order: number;
}

export interface UpdateWorkspace extends Partial<SaveWorkspace> {
  id: string;
  viewMode: ViewMode;
}

export class WorkspaceService {
  async list(): Promise<Workspace[]> {
    return normalizeEntity(
      await Workspace.find({
        where: `${Workspace.name}_directories_deleted_at IS NULL`,
      })
    );
  }

  async add(workspace: SaveWorkspace): Promise<Workspace> {
    const newWorkspace = Workspace.create(workspace);
    return normalizeEntity(await newWorkspace.save());
  }

  async update(workspace: UpdateWorkspace): Promise<Workspace> {
    const dbWorkspace = await Workspace.findOne(workspace.id);

    let changed = false;
    Object.entries(omit(workspace, 'id')).forEach(([key, value]) => {
      if (!Object.prototype.hasOwnProperty.call(dbWorkspace, key)) {
        return;
      }

      changed = true;
      dbWorkspace[key] = value;

      if (key === 'viewMode') {
        // eslint-disable-next-line no-return-assign
        dbWorkspace.directories.forEach((x) => (x.viewMode = null));
      }
    });

    let result = dbWorkspace;
    if (changed) {
      result = await dbWorkspace.save();
    }
    return normalizeEntity(result);
  }

  async remove({ workspaceId }: { workspaceId: string }): Promise<Workspace> {
    const workspace = await Workspace.findOne(workspaceId);
    return normalizeEntity(await workspace.softRemove());
  }
}

export default new WorkspaceService();
