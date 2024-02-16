import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { SignUpInput } from 'src/auth/inputs/auth.input';
import { OneRepoQuery, RepoQuery } from 'src/declare/types';
import { User } from './entities/user.entity';
import {
  CreateUserInput,
  UpdateUserInput,
  UpdateVerificationInput,
} from './inputs/user.input';
import { Between, FindOneOptions } from 'typeorm';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) { }

  async getOne(qs: OneRepoQuery<User>, query?: string) {
    if (query) {
      return this.userRepository.getOne(qs, query);
    } else {
      return this.userRepository.findOne(qs as FindOneOptions<User>);
    }
  }

  getMany(qs?: RepoQuery<User>, query?: string) {
    return this.userRepository.getMany(qs || {}, query);
  }

  async create(input: CreateUserInput | SignUpInput): Promise<User> {
    const username = this.generateUniqueUsername()
    return this.userRepository.save(Object.assign(new User(), { ...input, username }));
  }

  createMany(input: CreateUserInput[]): Promise<User[]> {
    return this.userRepository.save(input);
  }

  async update(id: number, input: UpdateUserInput): Promise<User> {
    const user = await User.findOne({ where: { id } });
    return this.userRepository.save({ ...user, ...input });
  }

  async updateVerification(
    id: number,
    input: UpdateVerificationInput,
  ): Promise<User> {
    const user = await User.findOne({ where: { id } });
    return this.userRepository.save({ ...user, ...input });
  }

  async updateProfile(id: number, input: UpdateUserInput): Promise<User> {
    const user = await User.findOne({ where: { id } });
    return this.userRepository.save({ ...user, ...input });
  }

  async delete(id: number) {
    const { affected } = await this.userRepository.delete({ id });
    return { status: affected > 0 ? 'success' : 'fail' };
  }

  async findAll(): Promise<User[]> {
    // return this.userRepository.find();
    return this.userRepository.find({ where: { id: Between(20, 20) } });
  }


  private generateUniqueUsername(): string {
    const allowedChars = 'abcdefghijklmnopqrstuvwxyz0123456789.';
    const usernameLength = 8;
    let username = Array.from(crypto.getRandomValues(new Uint32Array(usernameLength)))
      .map((x) => allowedChars[x % allowedChars.length])
      .join('');
    return username;
  }

}
