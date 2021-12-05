/* eslint-disable import/no-cycle */
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseModel } from './BaseModel';
import type { IModel } from './BaseModel';
import { Directory } from './Directory';

export interface IFile extends IModel {
  directory: Directory;
  path: string;
  duration: number;
  extension: string;
  thumb?: string;
}

@Entity('t_file')
export class File extends BaseModel {
  @ManyToOne(() => Directory, (directory) => directory.files)
  @JoinColumn({
    name: 'directory_id',
    referencedColumnName: 'id',
  })
  directory: Directory;

  @Column()
  path: string;

  @Column()
  duration: number;

  @Column({ length: 50 })
  extension: string;

  @Column()
  thumb?: string;
}
export default File;
