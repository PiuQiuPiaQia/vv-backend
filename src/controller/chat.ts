import { UserService } from './../service/user';
import { Context } from 'egg';
import { ChatService } from '../service/chat';
import { Controller, Get, Inject, Provide } from '@midwayjs/decorator';

@Provide()
@Controller('/chat')
export class ChatController {
  @Inject()
  chatService: ChatService;

  @Inject()
  userService: UserService;

  @Get('/getChatList')
  async getUserChatList(ctx: Context) {
    const { id: user_id } = ctx.userinfo;
    const userChat = await this.chatService.getUserChat(user_id);
    const chatIds = userChat?.chat_id ?? [];
    let chatList = [];

    for (const chat_id of chatIds) {
      const { chat_name, is_group, members } =
        await this.chatService.getChatList(chat_id);
      let chatMembers: Record<string, string> = {};
      for (const member_id of members) {
        const member = await this.userService.getUserById(member_id);
        chatMembers[member_id] = member.username;
      }
      const chat_message = await this.chatService.getChatMessage(chat_id);
      const messages = chat_message.messages ?? [];
      chatList.push({
        chat_id,
        chat_name,
        is_group,
        members: chatMembers,
        messages: messages,
      });
    }

    ctx.body = {
      code: 200,
      message: '执行成功',
      data: chatList,
    };
  }

  @Get('/getUserList')
  async getUserList(ctx: Context) {
    const userList = await this.userService.getUserList();
    ctx.body = {
      code: 200,
      message: '执行成功',
      data: userList ?? [],
    };
  }
}
