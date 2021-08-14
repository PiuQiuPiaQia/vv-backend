import { Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/orm';
import { Users } from '../entity/users';
import { Repository } from 'typeorm';

@Provide()
export class UserService {
  @InjectEntityModel(Users)
  userModel: Repository<Users>;

  async login(username: string, password: string): Promise<Users> {
    return await this.userModel.findOne({
      username,
      password,
    });
  }

  async getUserById(id: number): Promise<Users> {
    return await this.userModel.findOne(
      {
        id,
      },
      {
        select: ['username'],
      }
    );
  }

  async getUserList(){
    return await this.userModel.find({
      select: ['username'],
      order: {
        username: 'ASC',
      },
    });
  }
}
