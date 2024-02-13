import { Injectable } from '@nestjs/common';
import { OneRepoQuery, RepoQuery } from 'src/declare/types';
import { OrganizerRepository } from './organizer.repository';
import { Organizer } from './entities/organizer.entity';
import {
  CreateOrganizerInput,
  UpdateOrganizerInput,
} from './inputs/organizer.input';

import { FindOneOptions } from 'typeorm';
@Injectable()
export class OrganizerService {
  constructor(private readonly organizerRepository: OrganizerRepository) {}
  /**
   * Retrieves multiple organizers based on provided query parameters.
   * @param qs - Query parameters for the organizer repository.
   * @param query - General query parameter.
   * @returns A list of organizers.
   */
  getMany(qs?: RepoQuery<Organizer>, query?: string) {
    return this.organizerRepository.getMany(qs || {}, query);
  }
  /**
   * Retrieves a single organizer based on provided query parameters.
   * @param qs - Query parameters for the organizer repository.
   * @param query - General query parameter.
   * @returns A single organizer.
   */
  getOne(qs: OneRepoQuery<Organizer>, query?: string) {
    if (query) {
      return this.organizerRepository.getOne(qs, query);
    } else {
      return this.organizerRepository.findOne(qs as FindOneOptions<Organizer>);
    }
  }
  /**
   * Creates a new organizer.
   * @param input - Organizer details.
   * @returns The created organizer.
   */
  create(input: CreateOrganizerInput): Promise<Organizer> {
    const organizer = new Organizer();
    Object.assign(organizer, input);
    return this.organizerRepository.save(organizer);
  }

  /**
   * Creates multiple organizers.
   * @param input - Array of organizer details.
   * @returns An array of created organizers.
   */
  createMany(input: CreateOrganizerInput[]): Promise<Organizer[]> {
    return this.organizerRepository.save(input);
  }
 /**
   * Updates an existing organizer by its ID.
   * @param id - ID of the organizer to be updated.
   * @param input - Updated organizer details.
   * @returns The updated organizer.
   */
  async update(id: number, input: UpdateOrganizerInput): Promise<Organizer> {
    const organizer = await this.organizerRepository.findOne({ where: { id } });
    return this.organizerRepository.save({ ...organizer, ...input });
  }
/**
   * Deletes an organizer by its ID.
   * @param id - ID of the organizer to be deleted.
   * @returns The deleted organizer.
   */
  async delete(id: number) {
    const organizer = this.organizerRepository.findOne({ where: { id } });
    await this.organizerRepository.delete({ id });
    return organizer;
  }
}
