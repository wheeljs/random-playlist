/* eslint-disable class-methods-use-this */
import { omit } from 'lodash';
import { ViewMode, Workspace } from '../../common/models';

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
  list(): Promise<Workspace[]> {
    return Workspace.find({
      where: `${Workspace.name}_directories_deleted_at IS NULL`,
    }).then(normalizeEntity);
  }

  add(workspace: SaveWorkspace) {
    return Workspace.create(workspace).save().then(normalizeEntity);
  }

  async update(workspace: UpdateWorkspace) {
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

  async remove({ workspaceId }: { workspaceId: string }) {
    const workspace = await Workspace.findOne(workspaceId);
    return normalizeEntity(await workspace.softRemove());
  }
}

export default new WorkspaceService();
