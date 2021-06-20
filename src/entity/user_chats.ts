import { EntityModel } from '@midwayjs/orm';
import {
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@EntityModel('user_chats')
export class UserChats {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: string;

  @Column('simple-array')
  chat_id: string[];

  @CreateDateColumn()
  create_time: string;

  @UpdateDateColumn()
  update_time: string;
}
