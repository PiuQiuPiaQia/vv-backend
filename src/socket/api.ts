import { message } from './../types/index.d';
import {
  App,
  Inject,
  OnWSConnection,
  OnWSDisConnection,
  OnWSMessage,
  Provide,
  WSController,
  WSEmit,
} from '@midwayjs/decorator';
import { UserService } from '../service/user';
import { Application } from 'egg';
import { IMidwaySocketIOContext } from '@midwayjs/socketio';
import { ChatService } from '../service/chat';

@Provide()
@WSController('/')
export class APIController {
  @App()
  app: Application;

  @Inject()
  ctx: IMidwaySocketIOContext;

  @Inject()
  userService: UserService;

  @Inject()
  chatService: ChatService;

  @OnWSConnection()
  async init(): Promise<void> {
    // auth middleware
    this.ctx.use(async (event, next) => {
      const [, token] = this.ctx.request.headers.authorization.split(' ');

      if (token) {
        // redisToken不存在表示token已过期
        try {
          // 解密，获取payload
          const { payload } = this.app.jwt.decode<{ id: number }>(token);

          const redisUser = await this.app.redis.get(`${payload.id}`);
          const { redisToken, userinfo } = JSON.parse(redisUser);

          if (token !== redisToken) {
            throw '';
          }
          this.ctx.data.userinfo = userinfo;

          next();
        } catch (error) {
          console.log(error);
          this.ctx.emit('error', {
            code: 500,
            message: '未知错误',
          });
        }
      } else {
        this.ctx.emit('error', {
          code: 401,
          message: '未登录',
        });
      }
    });
    console.log(`namespace / got a connection ${this.ctx.id}`);
  }

  @OnWSMessage('hi')
  @WSEmit('ha')
  async gotMyMessage(payload: unknown): Promise<any> {
    return 'heart dance';
  }

  @OnWSMessage('addRooms')
  async addRooms() {
    const { id } = await this.ctx.data.userinfo;
    const userChat = await this.chatService.getUserChat(id);
    const chatIds = userChat?.chat_id ?? [];
    chatIds.forEach(chat_id => {
      this.ctx.join(chat_id);
    });
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
    this.ctx.to(chat_id).emit('receiverMessage', { chat_id, message });
    // this.ctx;
    return {
      code: 200,
      message: 'success',
    };
  }

  // 发起新的聊天
  @OnWSMessage('createChat')
  async createChat({ chat_user_id }) {
    const { id } = await this.ctx.data.userinfo;
    const chat = await this.chatService.createChat({
      user_id: id,
      chat_user_id,
    });
    let chatMembers: Record<string, string> = {};
    for (const member_id of chat.members) {
      const member = await this.userService.getUserById(member_id);
      chatMembers[member_id] = member.username;
    }
    const chat_message = await this.chatService.getChatMessage(chat.chat_id);
    let messages = chat_message.messages ?? [];
    return {
      code: 200,
      data: {
        chat_id: chat.chat_id,
        chat_name: chat.chat_name,
        is_group: chat.is_group,
        members: chatMembers,
        messages: messages,
      },
    };
  }

  @OnWSDisConnection()
  disconnect(reason: string): void {
    console.log(this.ctx.id + ' disconnect ' + reason);
  }
}
