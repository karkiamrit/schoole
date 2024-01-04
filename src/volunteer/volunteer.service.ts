import { Injectable } from '@nestjs/common';
import { OneRepoQuery, RepoQuery } from 'src/declare/types';
import { VolunteerRepository } from './volunteer.repository';
import { Volunteer } from './entities/volunteer.entity';
import {
  CreateVolunteerInput,
  UpdateVolunteerInput,
} from './inputs/volunteer.input';

import { FindOneOptions } from 'typeorm';
@Injectable()
export class VolunteerService {
  constructor(private readonly volunteerRepository: VolunteerRepository) {}

  getMany(qs?: RepoQuery<Volunteer>, query?: string) {
    return this.volunteerRepository.getMany(qs || {}, query);
  }

  getOne(qs: OneRepoQuery<Volunteer>, query?: string) {
    if (query) {
      return this.volunteerRepository.getOne(qs, query);
    } else {
      return this.volunteerRepository.findOne(qs as FindOneOptions<Volunteer>);
    }
  }

  create(input: CreateVolunteerInput): Promise<Volunteer> {
    const volunteer = new Volunteer();
    Object.assign(volunteer, input);
    return this.volunteerRepository.save(volunteer);
  }

  createMany(input: CreateVolunteerInput[]): Promise<Volunteer[]> {
    return this.volunteerRepository.save(input);
  }

  async update(id: number, input: UpdateVolunteerInput): Promise<Volunteer> {
    const volunteer = await this.volunteerRepository.findOne({ where: { id } });
    return this.volunteerRepository.save({ ...volunteer, ...input });
  }

  async delete(id: number) {
    const volunteer = this.volunteerRepository.findOne({ where: { id } });
    await this.volunteerRepository.delete({ id });
    return volunteer;
  }
}
