import { classToPlain, Transform } from 'class-transformer';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  In,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';
import { keyBy } from 'lodash';
import { dateTransformer } from './BaseModel';

export type SupportedLngs = 'zh-CN' | 'en' | string;

export type ConfigValueType = 'string' | 'separated-string';

export interface IConfig {
  id: number;
  key: string;
  value: string | string[];
  valueType: ConfigValueType;
  version: number;
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export type SaveOrUpdateConfig = Pick<IConfig, 'key' | 'value'> &
  Partial<Pick<IConfig, 'valueType'>>;

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

  @Column({ name: 'value_type', type: 'text', default: 'string' })
  valueType: ConfigValueType;

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
    const queryBuilder = this.createQueryBuilder('config').where(
      'config.key = :key',
      { key }
    );
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
      return classToPlain(config) as unknown as IConfig;
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

  static async listByKeys(keys?: string[]): Promise<Record<string, IConfig>> {
    const queryBuilder = this.createQueryBuilder('config').where(
      'config.enabled = true'
    );
    if (Array.isArray(keys)) {
      queryBuilder.andWhere('config.keys IN (:...keys)', { keys });
    }

    const configs = await queryBuilder.getMany();
    return keyBy(classToPlain(configs) as unknown as IConfig[], (x) => x.key);
  }

  static async saveOrUpdate(
    configs: SaveOrUpdateConfig[]
  ): Promise<Record<string, IConfig>> {
    const configKeys = configs.map((x) => x.key);

    const dbConfigs = await Config.find({
      key: In(configKeys),
    });
    const toSaveConfigs = configs.map((config) => {
      let dbConfig = dbConfigs.find((x) => x.key === config.key);
      if (dbConfig == null) {
        dbConfig = Config.create({
          key: config.key,
          valueType: config.valueType ?? 'string',
        });
      }

      switch (dbConfig.valueType) {
        case 'separated-string':
          dbConfig.value = (config.value as string[]).join(',');
          break;
        default:
          dbConfig.value = config.value as string;
          break;
      }

      return dbConfig;
    });

    return keyBy(
      classToPlain(await Config.save(toSaveConfigs)) as unknown as IConfig[],
      (x) => x.key
    );
  }
}

export default Config;
