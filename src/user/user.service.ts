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
    constructor(private readonly userRepository: UserRepository) {}
  /**
   * Retrieves a single user based on provided query parameters.
   * @param qs - Query parameters for the user repository.
   * @param query - General query parameter.
   * @returns A single user.
   */
    async getOne(qs: OneRepoQuery<User>, query?: string) {
      if (query) {
        return this.userRepository.getOne(qs, query);
      } else {
        return this.userRepository.findOne(qs as FindOneOptions<User>);
      }
    }
  /**
   * Retrieves multiple users based on provided query parameters.
   * @param qs - Query parameters for the user repository.
   * @param query - General query parameter.
   * @returns A list of users.
   */
    getMany(qs?: RepoQuery<User>, query?: string) {
      return this.userRepository.getMany(qs || {}, query);
    }
  /**
   * Creates a new user.
   * @param input - User details for creation.
   * @returns The created user.
   */
    async create(input: CreateUserInput | SignUpInput): Promise<User> {
      return this.userRepository.save(Object.assign(new User(), input));
    }
 /**
   * Creates multiple users.
   * @param input - Array of user details for creation.
   * @returns An array of created users.
   */
    createMany(input: CreateUserInput[]): Promise<User[]> {
      return this.userRepository.save(input);
    }
  /**
   * Updates an existing user by their ID.
   * @param id - ID of the user to be updated.
   * @param input - Updated user details.
   * @returns The updated user.
   */
    async update(id: number, input: UpdateUserInput): Promise<User> {
      const user = await User.findOne({ where: { id } });
      return this.userRepository.save({ ...user, ...input });
    }

  /**
   * Updates verification details of a user by their ID.
   * @param id - ID of the user to be updated.
   * @param input - Updated verification details.
   * @returns The updated user with verification details.
   */
    async updateVerification(
      id: number,
      input: UpdateVerificationInput,
    ): Promise<User> {
      const user = await User.findOne({ where: { id } });
      return this.userRepository.save({ ...user, ...input });
    }
  /**
   * Updates profile details of a user by their ID.
   * @param id - ID of the user to be updated.
   * @param input - Updated profile details.
   * @returns The updated user with profile details.
   */
    async updateProfile(id: number, input: UpdateUserInput): Promise<User> {
      const user = await User.findOne({ where: { id } });
      return this.userRepository.save({ ...user, ...input });
    }

  /**
   * Deletes a user by their ID.
   * @param id - ID of the user to be deleted.
   * @returns Object indicating the status of the deletion.
   */
    async delete(id: number) {
      const { affected } = await this.userRepository.delete({ id });
      return { status: affected > 0 ? 'success' : 'fail' };
    }
  /**
   * Retrieves all users within a specific ID range (for example, between ID 20 and 20).
   * @returns An array of users within the specified ID range.
   */
    async findAll(): Promise<User[]> {
      // return this.userRepository.find();
      return this.userRepository.find({ where: { id: Between(20, 20) } });
    }
  }
