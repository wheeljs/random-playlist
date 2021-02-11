/* eslint-disable class-methods-use-this */
import { classToPlain } from 'class-transformer';
import { Workspace } from '../models';

export class WorkspaceService {
  async list(): Promise<Workspace[]> {
    return (classToPlain(await Workspace.find()) as unknown) as Workspace[];
  }
}

export default new WorkspaceService();
