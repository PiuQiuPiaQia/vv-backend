import { ChatMessages } from '../entity/chat_messages';
import { Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/orm';
import { Chats } from '../entity/chats';
import { Repository } from 'typeorm';
import { UserChats } from '../entity/user_chats';

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

  // todo  保存一条假数据进去
  async saveChatMessage(chat_id: string): Promise<ChatMessages> {
    return await this.chatMessagesModel.save({
      chat_id,
      messages: [
        {
          user: 1,
          content: '11111',
          read: false,
        },
        {
          user: 2,
          content: '222222',
          read: false,
        },
      ],
    });
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
