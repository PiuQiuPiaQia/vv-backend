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
@WSController('/test')
export class APIController {
  @Inject()
  ctx: IMidwaySocketIOContext;

  @Inject()
  userService: UserService;

  @OnWSConnection()
  init(): void {
    console.log(`namespace /test got a connection ${this.ctx.id}`);
  }

  @OnWSMessage('hi')
  @WSEmit('ha')
  async gotMyMessage(payload: unknown): Promise<any> {
    return 'heart dance';
  }

  @OnWSDisConnection()
  disconnect(reason: string): void {
    console.log(this.ctx.id + ' disconnect ' + reason);
  }
}
