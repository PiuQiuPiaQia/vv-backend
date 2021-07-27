import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';

export type DefaultConfig = PowerPartial<EggAppConfig>;

export default (appInfo: EggAppInfo): PowerPartial<EggAppConfig> => {
  const config = {} as DefaultConfig;

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_{{keys}}';

  // add your config here
  // 坑：开头首位一定要小写
  config.middleware = ['errorHandlerMiddleware', 'jwtAuthMiddleware'];

  // jwt配置
  config.jwt = {
    enable: true,
    client: {
      secret: '123456', // 默认密钥，生产环境一定要更改
    },
    ignore: ['/login'],
  };
  // jwt token 校验中间件(需配合jwt使用, ignore的配置与jwt一致)
  config.jwtAuth = {
    ignore: config.jwt.ignore,
    accessTokenExpiresIn: 60 * 60 * 24 * 3, // 签名过期时间也可写
  };

  config.security = {
    csrf: {
      enable: false,
    },
  };

  return config;
};
