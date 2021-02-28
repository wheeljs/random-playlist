/* eslint-disable class-methods-use-this */
import { Config, IConfig } from '../models';

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
}

export default new ConfigService();
