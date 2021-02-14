/* eslint-disable class-methods-use-this */
import { classToPlain } from 'class-transformer';
import { Workspace } from '../models';

export interface SaveWorkspace {
  name: string;
  order: number;
}

export interface UpdateWorkspace extends SaveWorkspace {
  id: string;
}

export class WorkspaceService {
  async list(): Promise<Workspace[]> {
    return (classToPlain(await Workspace.find()) as unknown) as Workspace[];
  }

  async add(workspace: SaveWorkspace): Promise<Workspace> {
    const newWorkspace = Workspace.create(workspace);
    return (classToPlain(newWorkspace.save()) as unknown) as Workspace;
  }

  async update(workspace: UpdateWorkspace): Promise<Workspace> {
    const dbWorkspace = await Workspace.findOne(workspace.id);

    dbWorkspace.name = workspace.name;
    dbWorkspace.order = workspace.order;

    return dbWorkspace.save();
  }
}

export default new WorkspaceService();
