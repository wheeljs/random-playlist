import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  BaseEntity,
  ValueTransformer,
} from 'typeorm';

export const DateTransformer: ValueTransformer = {
  from(value: Date) {
    if (value == null) {
      return value;
    }
    return value.getTime();
  },
  to(value: number) {
    if (typeof value !== 'number') {
      return value;
    }
    return new Date(value);
  },
};

export abstract class BaseModel extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({
    transformer: DateTransformer,
  })
  created_at: number;

  @UpdateDateColumn({
    transformer: DateTransformer,
  })
  updated_at: number;

  @DeleteDateColumn({
    transformer: DateTransformer,
  })
  deleted_at: number;
}
export default BaseModel;
