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

  // 全部的chat_id
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

  // 当前消息列表的chat，非全量
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

  // 全量的chat和messsage
  async getChatMessage(chat_id: string) {
    let res = await this.chatMessagesModel.findOne(
      {
        chat_id: chat_id,
      },
      {
        select: ['messages'],
      }
    );
    if (!res) {
      await this.chatMessagesModel.save({
        chat_id,
      });
    }
    return (
      res ?? {
        messages: [],
      }
    );
  }

  async saveChatMessage(chat_id: string, message: message) {
    const chat_message = await this.chatMessagesModel.findOne({
      chat_id: chat_id,
    });
    const messages = chat_message?.messages ?? [],
      id = chat_message?.id;

    messages.push(message);

    return await this.chatMessagesModel.save({
      id: id,
      chat_id: chat_id,
      messages,
    });
  }

  async createChat({
    user_id,
    chat_user_id,
    chat_name = '',
    is_group = false,
  }) {
    const { chat_id: chat_ids } = await this.userChatsModel.findOne(user_id);
    let currentChat: Chats;
    for (let index = 0; index < chat_ids.length; index++) {
      currentChat = await this.chatsModel.findOne(
        {
          chat_id: chat_ids[index],
          is_group: false,
        },
        {
          where: {
            members: `like ${chat_user_id}`,
          },
          withDeleted: true,
        }
      );
      if (currentChat) {
        await this.chatsModel.restore({
          chat_id: currentChat.chat_id,
        });
        break;
      }
    }

    // chat_id存在判断
    if (!currentChat) {
      currentChat = await this.chatsModel.save({
        chat_name,
        is_group,
        members: [user_id, chat_user_id],
      });
    }

    return {
      chat_id: currentChat.chat_id,
      chat_name: currentChat.chat_name,
      is_group: currentChat.is_group,
      members: currentChat.members,
    };
  }
}
