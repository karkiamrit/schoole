import { Injectable } from '@nestjs/common';
import { OneRepoQuery, RepoQuery } from 'src/declare/types';
import { InstitutionRepository } from './institution.repository';
import { Institution } from './entities/institution.entity';
import {
  CreateInstitutionInput,
  UpdateInstitutionInput,
} from './inputs/institution.input';

import { FindOneOptions } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
@Injectable()
export class InstitutionService {
  constructor(private readonly institutionRepository: InstitutionRepository) {}

    /**
   * Retrieves multiple institutions based on provided query parameters.
   * @param qs - Query parameters for the institution repository.
   * @param query - General query parameter.
   * @returns A list of institutions with user relations.
   */

  getMany(qs?: RepoQuery<Institution>, query?: string) {
    return this.institutionRepository.getMany(qs || {}, query);
  }

  /**
   * Retrieves a single institution based on provided query parameters.
   * @param qs - Query parameters for the institution repository.
   * @param query - General query parameter.
   * @returns A single institution with user relations.
   */
  getOne(qs: OneRepoQuery<Institution>, query?: string) {
    if (query) {
      return this.institutionRepository.getOne(qs, query);
    } else {
      return this.institutionRepository.findOne(
        qs as FindOneOptions<Institution>,
      );
    }
  }

  /**
   * Creates a new institution associated with a user.
   * @param input - Institution details.
   * @param user - User associated with the institution.
   * @returns The created institution.
   */
  create(input: CreateInstitutionInput, user: User): Promise<Institution> {
    const institution = new Institution();
    Object.assign(institution, input);
    institution.user = user;
    return this.institutionRepository.save(institution);
  }
    /**
   * Creates multiple institutions.
   * @param input - Array of institution details.
   * @returns An array of created institutions.
   */

  createMany(input: CreateInstitutionInput[]): Promise<Institution[]> {
    return this.institutionRepository.save(input);
  }
  /**
   * Updates an existing institution by its ID.
   * @param id - ID of the institution to be updated.
   * @param input - Updated institution details.
   * @returns The updated institution.
   */
  async update(
    id: number,
    input: UpdateInstitutionInput,
  ): Promise<Institution> {
    const institution = await this.institutionRepository.findOne({
      where: { id },
    });
    return this.institutionRepository.save({ ...institution, ...input });
  }
  /**
   * Deletes an institution by its ID.
   * @param id - ID of the institution to be deleted.
   * @returns The deleted institution.
   */
  async delete(id: number) {
    const institution = this.institutionRepository.findOne({ where: { id } });
    await this.institutionRepository.delete({ id });
    return institution;
  }
}
