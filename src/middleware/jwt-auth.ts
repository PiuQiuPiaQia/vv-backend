import { Provide } from '@midwayjs/decorator';
import { IWebMiddleware, IMidwayWebNext } from '@midwayjs/web';
import { Context } from 'egg';

@Provide()
export class JwtAuthMiddleware implements IWebMiddleware {
  resolve() {
    return async (ctx: Context, next: IMidwayWebNext): Promise<void> => {
      // 免登陆页面
      const whiteList = ctx.app.config['jwtAuth'].ignore;
      if (!whiteList.includes(ctx.request.url)) {
        const [, token] = ctx.header.authorization.split(' ');
        if (token) {
          // redisToken不存在表示token已过期
          try {
            // 解密，获取payload
            const { payload } = ctx.app.jwt.decode<{ id: number }>(token);

            const redisUser = await ctx.app.redis.get(`${payload.id}`);
            const { redisToken, userinfo } = JSON.parse(redisUser);

            if (token !== redisToken) {
              throw '';
            }
            ctx.userinfo = userinfo;

            await next();
          } catch (error) {
            throw {
              code: 401,
              message: '请重新登录',
            };
          }
        } else {
          throw {
            code: 401,
            message: '未登录',
          };
        }
      } else {
        await next();
      }
    };
  }
}
