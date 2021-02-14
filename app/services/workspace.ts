/* eslint-disable class-methods-use-this */
import { classToPlain } from 'class-transformer';
import { Workspace } from '../models';

export interface SaveWorkspace {
  name: string;
  order: number;
}

export class WorkspaceService {
  async list(): Promise<Workspace[]> {
    return (classToPlain(await Workspace.find()) as unknown) as Workspace[];
  }

  async save(workspace: SaveWorkspace): Promise<Workspace> {
    const newWorkspace = Workspace.create(workspace);
    return (classToPlain(newWorkspace.save()) as unknown) as Workspace;
  }
}

export default new WorkspaceService();
