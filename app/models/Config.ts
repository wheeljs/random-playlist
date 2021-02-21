import { classToPlain, Transform } from 'class-transformer';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';
import { dateTransformer } from './BaseModel';

export interface IConfig {
  id: number;
  key: string;
  value: string | string[];
  valueType: 'string' | 'separated-string';
  version: number;
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

@Entity('t_config')
export class Config extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, unique: true })
  key: string;

  @Column({ type: 'text' })
  @Transform(({ value, obj }) => {
    switch (obj.valueType) {
      case 'separated-string':
        return value.split(',');
      default:
        return value;
    }
  })
  value: string;

  @Column({ name: 'value_type', default: 'string' })
  valueType: 'string' | 'separated-string';

  @VersionColumn()
  version: number;

  @Column({ default: true })
  enabled: boolean;

  @CreateDateColumn({ name: 'created_at' })
  @Transform(dateTransformer)
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  @Transform(dateTransformer)
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  @Transform(dateTransformer)
  deletedAt: Date;

  static async get(
    key: string,
    {
      specifyVersion,
      ignoreEnabled = false,
    }: { specifyVersion?: number; ignoreEnabled?: boolean } = {
      ignoreEnabled: false,
    }
  ): Promise<IConfig> {
    const queryBuilder = this.createQueryBuilder(
      'config'
    ).where('config.key = :key', { key });
    if (typeof specifyVersion === 'number') {
      queryBuilder.andWhere('config.version = :version', {
        verion: specifyVersion,
      });
    }
    if (!ignoreEnabled) {
      queryBuilder.andWhere('config.enabled = true');
    }

    try {
      const config = await queryBuilder.getOneOrFail();
      return (classToPlain(config) as unknown) as IConfig;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      switch (e.name) {
        case 'EntityNotFound':
          throw new Error(
            `Config '${key}' does not exists or not matched with version = ${specifyVersion}, ignoreEnabled = ${ignoreEnabled}.`
          );
        default:
          throw e;
      }
    }
  }
}

export default Config;
