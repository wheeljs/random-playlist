/* eslint-disable import/no-cycle */
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseModel } from './BaseModel';
import { File } from './File';
import { Workspace } from './Workspace';

@Entity('t_directory')
export class Directory extends BaseModel {
  @ManyToOne(() => Workspace, (workspace) => workspace.directories)
  workspace: Workspace;

  @OneToMany(() => File, (file) => file.directory)
  files: File[];

  @Column()
  path: string;

  @Column()
  order: number;
}
export default Directory;
