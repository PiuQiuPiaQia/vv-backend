import { ChatMessages } from '../entity/chat_messages';
import { Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/orm';
import { Chats } from '../entity/chats';
import { Repository } from 'typeorm';
import { UserChats } from '../entity/user_chats';
import { message } from '../types';

@Provide()
export class ChatService {
  @InjectEntityModel(UserChats)
  userChatsModel: Repository<UserChats>;

  @InjectEntityModel(Chats)
  chatsModel: Repository<Chats>;

  @InjectEntityModel(ChatMessages)
  chatMessagesModel: Repository<ChatMessages>;

  async getUserChat(id: string): Promise<UserChats> {
    return await this.userChatsModel.findOne(
      {
        user_id: id,
      },
      {
        select: ['chat_id'],
      }
    );
  }

  async getChatList(chat_id: string): Promise<Chats> {
    return await this.chatsModel.findOne(
      {
        chat_id: chat_id,
      },
      {
        select: ['chat_name', 'is_group', 'members'],
      }
    );
  }

  async saveChatMessage(chat_id: string, message: message) {
    const { messages } = await this.chatMessagesModel.findOne();
    messages.push(message);
    return await this.chatMessagesModel.update(
      {
        chat_id: chat_id,
      },
      { messages }
    );
  }

  async getChatMessage(chat_id: string): Promise<ChatMessages> {
    return await this.chatMessagesModel.findOne(
      {
        chat_id: chat_id,
      },
      {
        select: ['messages'],
      }
    );
  }
}
