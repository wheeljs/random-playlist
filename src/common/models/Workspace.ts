/* eslint-disable import/no-cycle */
import { Entity, Column, OneToMany } from 'typeorm';
import { BaseModel } from './BaseModel';
import type { ViewMode } from './BaseModel';
import { Directory } from './Directory';

@Entity({
  name: 't_workspace',
  orderBy: {
    order: 'ASC',
    created_at: 'DESC',
  },
})
export class Workspace extends BaseModel {
  @OneToMany(() => Directory, (directory) => directory.workspace, {
    eager: true,
    cascade: ['update'],
  })
  directories: Directory[];

  @Column({ length: 50 })
  name: string;

  @Column({
    nullable: true,
  })
  order: number;

  @Column({
    name: 'view_mode',
    type: 'varchar',
  })
  viewMode: ViewMode;
}
export default Workspace;
