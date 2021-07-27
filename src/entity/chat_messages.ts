import { EntityModel } from '@midwayjs/orm';
import {
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { message } from '../types';

@EntityModel('chat_messages')
export class ChatMessages {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  chat_id: string;

  @Column('json')
  messages: message[];

  @CreateDateColumn()
  create_time: string;

  @UpdateDateColumn()
  update_time: string;
}
