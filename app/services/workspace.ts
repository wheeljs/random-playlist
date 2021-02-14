/* eslint-disable class-methods-use-this */
import { Workspace } from '../models';

import { normalizeEntity } from './util';

export interface SaveWorkspace {
  name: string;
  order: number;
}

export interface UpdateWorkspace extends SaveWorkspace {
  id: string;
}

export class WorkspaceService {
  async list(): Promise<Workspace[]> {
    return normalizeEntity(await Workspace.find());
  }

  async add(workspace: SaveWorkspace): Promise<Workspace> {
    const newWorkspace = Workspace.create(workspace);
    return normalizeEntity(await newWorkspace.save());
  }

  async update(workspace: UpdateWorkspace): Promise<Workspace> {
    const dbWorkspace = await Workspace.findOne(workspace.id);

    dbWorkspace.name = workspace.name;
    dbWorkspace.order = workspace.order;

    return normalizeEntity(await dbWorkspace.save());
  }

  async remove({ workspaceId }: { workspaceId: string }): Promise<Workspace> {
    const workspace = await Workspace.findOne(workspaceId);
    return normalizeEntity(await workspace.softRemove());
  }
}

export default new WorkspaceService();
