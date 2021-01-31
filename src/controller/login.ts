import { Redis } from 'ioredis';
import { Jwt, JwtEggConfig } from '@waiting/egg-jwt';
import {
  Provide,
  Inject,
  Controller,
  Post,
  Body,
  Plugin,
  Config,
} from '@midwayjs/decorator';
import { Context } from 'egg';
import { UserService } from '../service/user';
import { JwtAuthMiddlewareConfig } from '../config/config.types';

@Provide()
@Controller('/')
export class LoginController {
  @Config('jwt')
  jwtConfig: JwtEggConfig;

  @Config('jwtAuth')
  jwtAuthConfig: JwtAuthMiddlewareConfig;

  @Plugin()
  jwt: Jwt;

  @Plugin()
  redis: Redis;

  @Inject()
  userService: UserService;

  @Post('/login')
  async login(
    ctx: Context,
    @Body('username') username: string,
    @Body('password') password: string
  ): Promise<void> {
    const userinfo = await this.userService.getUser(username, password);
    if (!userinfo) {
      throw {
        status: 500,
        message: '账号密码错误或此用户不存在',
      };
    }

    const token = this.jwt.sign(
      { id: userinfo.id },
      this.jwtConfig.client.secret,
      {
        expiresIn: this.jwtAuthConfig.accessTokenExpiresIn,
      }
    );

    this.redis.set(
      `${userinfo.id}`,
      JSON.stringify({
        redisToken: token,
        userinfo,
      }),
      'EX',
      this.jwtAuthConfig.accessTokenExpiresIn
    );

    ctx.body = {
      status: 200,
      message: '登录成功',
      data: token,
    };
  }

  @Post('/verify')
  async verify(ctx: Context): Promise<void> {
    const { username, role } = ctx.userinfo;
    ctx.body = {
      status: 200,
      message: '执行成功',
      data: {
        username,
        role,
      },
    };
  }

  @Post('/logout')
  async logout(ctx: Context): Promise<void> {
    const { id, username } = ctx.userinfo;
    this.redis.set(
      `${id}`,
      JSON.stringify({}),
      'EX',
      this.jwtAuthConfig.accessTokenExpiresIn
    );
    ctx.body = {
      status: 200,
      message: '执行成功',
      data: {
        username,
      },
    };
  }
}
