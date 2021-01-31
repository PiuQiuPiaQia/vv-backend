import { JwtEggConfig } from '@waiting/egg-jwt';
import { EggAppConfig, PowerPartial } from 'egg';

export interface DefaultConfig extends PowerPartial<EggAppConfig> {
  jwt: JwtEggConfig;
}

/** JwtAuthMiddleware */
export interface JwtAuthMiddlewareConfig {
  /** 签名过期时间也可写 */
  accessTokenExpiresIn: number;
  ignore: JwtEggConfig['ignore'];
}
