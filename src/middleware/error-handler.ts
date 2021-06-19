import { Provide } from '@midwayjs/decorator';
import {
  IWebMiddleware,
  IMidwayWebNext,
  MidwayWebMiddleware,
} from '@midwayjs/web';
import { Context } from 'egg';

@Provide()
export class ErrorHandlerMiddleware implements IWebMiddleware {
  resolve(): MidwayWebMiddleware {
    return ErrHandleMiddleware;
  }
}

async function ErrHandleMiddleware(
  ctx: Context,
  next: IMidwayWebNext
): Promise<void> {
  try {
    await next();
    if (ctx.code === 404) {
      ctx.body = { code: 404, message: 'Not Found' };
    }
  } catch (err) {
    // 所有的异常都在 app 上触发一个 error 事件，框架会记录一条错误日志
    ctx.app.emit('error', err, ctx);

    // 处理egg-jwt的报错信息
    if (err.message === 'Authentication Failed') {
      err.code = 401;
      err.message = '未登录，请重新登录';
    }

    ctx.body = {
      code: err.code || 500,
      message: err.message || '服务器内部错误',
      data: err.data || null,
    };
  }
}
