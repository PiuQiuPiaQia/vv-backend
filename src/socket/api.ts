import {
  Inject,
  OnWSConnection,
  OnWSDisConnection,
  OnWSMessage,
  Provide,
  WSController,
  WSEmit,
} from '@midwayjs/decorator';
import { UserService } from '../service/user';
import { IMidwaySocketIOContext } from '@midwayjs/socketio';

@Provide()
@WSController('/')
export class APIController {
  @Inject()
  ctx: IMidwaySocketIOContext;

  @Inject()
  userService: UserService;

  @OnWSConnection()
  init(): void {
    console.log(`namespace / got a connection ${this.ctx.id}`);
  }

  @OnWSMessage('my')
  @WSEmit('ok')
  async gotMyMessage(payload: unknown): Promise<any> {
    if (typeof payload === 'string') {
      return { payload };
    }
    return { message: '请发送string' };
  }

  @OnWSDisConnection()
  disconnect(reason: string): void {
    console.log(this.ctx.id + ' disconnect ' + reason);
  }
}
