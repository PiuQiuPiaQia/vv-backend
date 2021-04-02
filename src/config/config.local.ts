import { EggRedisOptions } from 'egg-redis';
import { ConnectionOptions } from 'typeorm';

export const redis: EggRedisOptions = {
  client: {
    port: 6379, // Redis port
    host: '127.0.0.1', // Redis host
    password: '123456',
    db: 0,
  },
};

export const orm: ConnectionOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '12345678',
  database: 'vv',
  synchronize: true,
  logging: false,
  timezone: '+08:00',
};
