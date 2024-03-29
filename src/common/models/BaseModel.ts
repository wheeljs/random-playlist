import { Transform } from 'class-transformer';
import type { TransformFnParams } from 'class-transformer';
import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  BaseEntity,
} from 'typeorm';

export const dateTransformer = ({ value }: TransformFnParams) => {
  if (!(value instanceof Date)) {
    return value;
  }
  return value.getTime();
};

export type ViewMode = 'list' | 'thumb';

export interface IModel {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export abstract class BaseModel extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ name: 'created_at' })
  @Transform(dateTransformer)
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  @Transform(dateTransformer)
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  @Transform(dateTransformer)
  deletedAt: Date;
}
export default BaseModel;
