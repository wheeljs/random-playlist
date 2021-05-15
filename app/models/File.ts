/* eslint-disable import/no-cycle */
import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseModel } from './BaseModel';
import { Directory } from './Directory';

@Entity('t_file')
export class File extends BaseModel {
  @ManyToOne(() => Directory, (directory) => directory.files)
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
