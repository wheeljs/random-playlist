/* eslint-disable import/no-cycle */
import { Entity, Column, OneToMany } from 'typeorm';
import { BaseModel } from './BaseModel';
import { Directory } from './Directory';

@Entity('t_workspace')
export class Workspace extends BaseModel {
  @OneToMany(() => Directory, (directory) => directory.workspace, {
    eager: true,
  })
  directories: Directory[];

  @Column({ length: 50 })
  name: string;

  @Column({
    nullable: true,
  })
  order: number;
}
export default Workspace;
