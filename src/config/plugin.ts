import { EggPlugin } from 'egg';

// 启用redis
const redis = {
  enable: true,
  package: 'egg-redis',
};

const jwt = {
  enable: true,
  package: '@waiting/egg-jwt',
};

export default {
  static: false, // default is true
  jwt,
  redis,
} as EggPlugin;
