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

  getMany(qs?: RepoQuery<Organizer>, query?: string) {
    return this.organizerRepository.getMany(qs || {}, query);
  }

  getOne(qs: OneRepoQuery<Organizer>, query?: string) {
    if (query) {
      return this.organizerRepository.getOne(qs, query);
    } else {
      return this.organizerRepository.findOne(qs as FindOneOptions<Organizer>);
    }
  }

  create(input: CreateOrganizerInput): Promise<Organizer> {
    const organizer = new Organizer();
    Object.assign(organizer, input);
    return this.organizerRepository.save(organizer);
  }

  createMany(input: CreateOrganizerInput[]): Promise<Organizer[]> {
    return this.organizerRepository.save(input);
  }

  async update(id: number, input: UpdateOrganizerInput): Promise<Organizer> {
    const organizer = await this.organizerRepository.findOne({ where: { id } });
    return this.organizerRepository.save({ ...organizer, ...input });
  }

  async delete(id: number) {
    const organizer = this.organizerRepository.findOne({ where: { id } });
    await this.organizerRepository.delete({ id });
    return organizer;
  }
}
