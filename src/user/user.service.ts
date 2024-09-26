import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { SignUpInput, SignUpWithEmailInput } from 'src/auth/inputs/auth.input';
import { OneRepoQuery, RepoQuery } from 'src/declare/types';
import { User } from './entities/user.entity';
import {
  CreateUserInput,
  UpdateUserInput,
  UpdateUserWithStudentSocialsAndAddressInput,
  UpdateVerificationInput,
} from './inputs/user.input';
import { Between, FindOneOptions, UpdateResult } from 'typeorm';
import * as crypto from 'crypto';
import { SocialService } from '@/social/social.service';
import { AddressService } from '@/address/address.service';
import { StudentService } from '@/student/student.service';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly socialService: SocialService,
    private readonly addressService: AddressService,
    private readonly studentService: StudentService,
  ) {}

  async getOne(qs: OneRepoQuery<User>, query?: string) {
    if (query) {
      return await this.userRepository.getOne(qs, query);
    } else {
      return await this.userRepository.findOne(qs as FindOneOptions<User>);
    }
  }

  async getMany(qs?: RepoQuery<User>, query?: string) {
    return await this.userRepository.getMany(qs || {}, query);
  }

  async create(
    input: CreateUserInput | SignUpInput | SignUpWithEmailInput,
  ): Promise<User> {
    const username = this.generateUniqueUsername();
    return await this.userRepository.save(
      Object.assign(new User(), { ...input, username }),
    );
  }

  createMany(input: CreateUserInput[]): Promise<User[]> {
    return this.userRepository.save(input);
  }

  async update(id: number, input: UpdateUserInput): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    return await this.userRepository.save({ ...user, ...input });
  }

  async updateVerification(id: number, input: UpdateVerificationInput) {
    const user = await this.userRepository.findOne({ where: { id } });
    console.log(user);
    const value = await this.userRepository.save({
      ...user, // don't think this is necessary
      ...input,
    });
    // Fetch the updated user to verify the changes
    const updatedUser = await this.userRepository.findOne({ where: { id } });
    return updatedUser;
  }

  // used in client frontend
  async updateUserProfile(
    id: number,
    input: UpdateUserWithStudentSocialsAndAddressInput,
  ): Promise<UpdateResult | User> {
    const user = await this.userRepository.findOne({ where: { id } });

    const { student, socials, address, ...user_input } = input;

    if (student) {
      await this.studentService.update(user.student.id, student);
    }
    if (socials) {
      const updated_social = [];
      input.socials.forEach((social) => {
        updated_social.push(social.social_type);
        this.socialService.updateSpecificSocialInformation(user, social);
      });
      await this.socialService.bulkDeleteSocialInformationByTypes(
        updated_social,
      );
    }

    if (address) {
      await this.addressService.createOrUpdateAddressForUser(user, address);
    }
    if (user_input && Object.keys(user_input).length > 0) {
      return await this.userRepository.update(user.id, user_input);
    }
    return await this.userRepository.findOne({ where: { id } });
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
    const username = Array.from(
      crypto.getRandomValues(new Uint32Array(usernameLength)),
    )
      .map((x) => allowedChars[x % allowedChars.length])
      .join('');
    return username;
  }
}
