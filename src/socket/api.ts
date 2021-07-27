import { message } from './../types/index.d';
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
import { ChatService } from '../service/chat';

@Provide()
@WSController('/')
export class APIController {
  @Inject()
  ctx: IMidwaySocketIOContext;

  @Inject()
  userService: UserService;

  @Inject()
  chatService: ChatService;

  @OnWSConnection()
  init(): void {
    console.log(`namespace /test got a connection ${this.ctx.id}`);
  }

  @OnWSMessage('hi')
  @WSEmit('ha')
  async gotMyMessage(payload: unknown): Promise<any> {
    return 'heart dance';
  }

  @OnWSMessage('sendMessage')
  async saveMessage({
    chat_id,
    message,
  }: {
    chat_id: string;
    message: message;
  }): Promise<any> {
    await this.chatService.saveChatMessage(chat_id, message);
    // this.ctx;
    return {
      code: 200,
      message: 'success',
    };
  }

  @OnWSDisConnection()
  disconnect(reason: string): void {
    console.log(this.ctx.id + ' disconnect ' + reason);
  }
}
