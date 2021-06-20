import { Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/orm';
import { Users } from '../entity/users';
import { Repository } from 'typeorm';

@Provide()
export class UserService {
  @InjectEntityModel(Users)
  userModel: Repository<Users>;

  async getUser(username: string, password: string): Promise<Users> {
    return await this.userModel.findOne({
      username,
      password,
    });
  }
}
