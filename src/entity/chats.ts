import { EntityModel } from '@midwayjs/orm';
import {
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Generated,
} from 'typeorm';

@EntityModel('chats')
export class Chats {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Generated('uuid')
  chat_id: string;

  @Column()
  is_group: boolean;

  @Column('simple-array')
  members: string[];

  @CreateDateColumn()
  create_time: string;

  @UpdateDateColumn()
  update_time: string;
}
