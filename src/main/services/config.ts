/* eslint-disable class-methods-use-this */
import { Config } from '../../common/models';
import type { IConfig } from '../../common/models';
import { SaveOrUpdateConfig } from '../../common/models/Config';

export class ConfigService {
  get(
    key: string,
    options?: { specifyVersion?: number; ignoreEnabled?: boolean }
  ): Promise<IConfig> {
    return Config.get(key, options);
  }

  listByKeys(keys?: string[]): Promise<Record<string, IConfig>> {
    return Config.listByKeys(keys);
  }

  update(configs: SaveOrUpdateConfig[]): Promise<Record<string, IConfig>> {
    return Config.saveOrUpdate(configs);
  }
}

export default new ConfigService();
