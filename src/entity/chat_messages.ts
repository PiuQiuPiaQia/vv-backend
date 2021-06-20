import { EntityModel } from '@midwayjs/orm';
import {
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@EntityModel('chat_messages')
export class ChatMessages {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  chat_id: string;

  @Column('simple-array')
  message: { user: string; content: string; read: boolean }[];

  @CreateDateColumn()
  create_time: string;

  @UpdateDateColumn()
  update_time: string;
}
