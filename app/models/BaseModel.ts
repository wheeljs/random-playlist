import { Transform, TransformFnParams } from 'class-transformer';
import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  BaseEntity,
} from 'typeorm';

const dateTransformer = ({ value }: TransformFnParams) => {
  if (!(value instanceof Date)) {
    return value;
  }
  return value.getTime();
};

export abstract class BaseModel extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  @Transform(dateTransformer)
  created_at: Date;

  @UpdateDateColumn()
  @Transform(dateTransformer)
  updated_at: Date;

  @DeleteDateColumn()
  @Transform(dateTransformer)
  deleted_at: Date;
}
export default BaseModel;
