import { EntityModel } from '@midwayjs/orm';
import {
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum UserRole {
  Admin,
  Normal,
  Ghost,
}

@EntityModel('users')
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.Normal,
  })
  role: UserRole;

  @CreateDateColumn()
  create_time: string;

  @UpdateDateColumn()
  update_time: string;
}
