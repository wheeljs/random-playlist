/* eslint-disable import/no-cycle */
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseModel } from './BaseModel';
import { File } from './File';
import { Workspace } from './Workspace';

@Entity('t_directory')
export class Directory extends BaseModel {
  @ManyToOne(() => Workspace, (workspace) => workspace.directories)
  @JoinColumn({
    name: 'workspace_id',
    referencedColumnName: 'id',
  })
  workspace: Workspace;

  @OneToMany(() => File, (file) => file.directory, {
    cascade: true,
    eager: true,
  })
  files: File[];

  @Column({
    type: 'text',
  })
  glob: string;

  @Column()
  path: string;

  @Column()
  order: number;
}
export default Directory;
