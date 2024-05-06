import { Injectable } from '@nestjs/common';
import { OneRepoQuery, RepoQuery } from 'src/declare/types';
import { EventRepository } from './event.repository';
import { Event } from './entities/event.entity';
import { CreateEventInput, UpdateEventInput } from './inputs/event.input';

import { FindOneOptions } from 'typeorm';
import { User } from '@/user/entities/user.entity';
import { InstitutionService } from '@/institution/institution.service';
// import { SubEventService } from '@/subevent/subEvent.service';
import { CreateSubEventInput } from '@/subevent/inputs/subEvent.input';
import { SubEventRepository } from '@/subevent/subEvent.repository';
import { AddressService } from '@/address/address.service';
import { CreateAddressInput } from '@/address/inputs/address.input';
import { FileUploadService } from '@/modules/upload/file-upload.service';
@Injectable()
export class EventService {
  constructor(
    private readonly eventRepository: EventRepository,
    private readonly institutionService: InstitutionService,
    private readonly subEventRepository: SubEventRepository,
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

  async createEventWithSubEvents(
    input: CreateEventInput,
    subEvents: CreateSubEventInput[],
  ): Promise<Event> {
    const entityManager = this.eventRepository.manager;
    const queryRunner = entityManager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // const address = await this.addressService.create(addressInput);
      // Create Event
      const event = await this.eventRepository.save(
        this.eventRepository.create(input),
      );

      // Create SubEvents
      const createdSubEvents = [];
      for (const subEventInput of subEvents) {
        const subEvent = await this.subEventRepository.save({
          // Add await here
          ...subEventInput,
          event,
        });
        createdSubEvents.push(subEvent);
      }

      await queryRunner.commitTransaction();
      return event;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
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
