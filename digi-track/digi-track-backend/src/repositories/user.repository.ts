import { BaseRepository } from './base.repository';
import { UserModel } from '../models/user.model';

export class UserRepository extends BaseRepository<UserModel> {
  constructor() { super('users'); }

  async findByEmail(email: string): Promise<UserModel | null> {
    const users = await this.findAll((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    return users[0] || null;
  }
}

export const userRepository = new UserRepository();
