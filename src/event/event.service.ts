import { Injectable } from '@nestjs/common';
import { OneRepoQuery, RepoQuery } from 'src/declare/types';
import { EventRepository } from './event.repository';
import { Event } from './entities/event.entity';
import { CreateEventInput, UpdateEventInput } from './inputs/event.input';

import { FindOneOptions } from 'typeorm';
import { User } from '@/user/entities/user.entity';
import { InstitutionService } from '@/institution/institution.service';
@Injectable()
export class EventService {
  constructor(
    private readonly eventRepository: EventRepository,
    private readonly institutionService: InstitutionService,
  ) {}

  getMany(qs?: RepoQuery<Event>, query?: string) {
    return this.eventRepository.getMany(qs || {}, query);
  }

  getOne(qs: OneRepoQuery<Event>, query?: string) {
    if (query) {
      return this.eventRepository.getOne(qs, query);
    } else {
      return this.eventRepository.findOne(qs as FindOneOptions<Event>);
    }
  }

  async create(input: CreateEventInput, user: User | null): Promise<Event> {
    const event = new Event();
    Object.assign(event, input);
    if (user) {
      const institution = await this.institutionService.getOne({
        where: { user: { id: user.id } },
      });
      if (institution) {
        event.institutions.push(institution);
      }
    }
    return this.eventRepository.save(event);
  }

  createMany(input: CreateEventInput[]): Promise<Event[]> {
    return this.eventRepository.save(input);
  }

  async update(id: number, input: UpdateEventInput): Promise<Event> {
    const event = await this.eventRepository.findOne({ where: { id } });
    return this.eventRepository.save({ ...event, ...input });
  }

  async delete(id: number) {
    const event = this.eventRepository.findOne({ where: { id } });
    await this.eventRepository.delete({ id });
    return event;
  }
}
