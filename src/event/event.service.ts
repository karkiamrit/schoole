import { Injectable } from '@nestjs/common';
import { OneRepoQuery, RepoQuery } from 'src/declare/types';
import { EventRepository } from './event.repository';
import { Event } from './entities/event.entity';
import {
  CreateEventInput,
  CreateEventWithSubEventsInput,
  UpdateEventInput,
} from './inputs/event.input';

import { FindOneOptions } from 'typeorm';
import { User } from '@/user/entities/user.entity';
import { InstitutionService } from '@/institution/institution.service';
import { SubEventRepository } from '@/subevent/subEvent.repository';
import { AddressService } from '@/address/address.service';

@Injectable()
export class EventService {
  constructor(
    private readonly eventRepository: EventRepository,
    private readonly institutionService: InstitutionService,
    private readonly subEventRepository: SubEventRepository,
    private readonly addressService: AddressService,
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
    input: CreateEventWithSubEventsInput,
    user: User,
  ): Promise<Event> {
    const entityManager = this.eventRepository.manager;
    const queryRunner = entityManager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Separate sub_events from the events
      const { sub_events, ...event_data } = input;

      // Create Event
      const event = await this.eventRepository.save(
        this.eventRepository.create({ ...event_data, user: user }),
      );

      event.user = user;

      // Get event's address and save it to database
      if (event_data?.address) {
        event.address = await this.addressService.create(event_data.address);
      }
      await this.eventRepository.save(event);
      // Create SubEvents
      if (sub_events && sub_events.length > 0) {
        for (const subEventInput of sub_events) {
          const subEvent = await this.subEventRepository.save({
            // Add await here
            ...subEventInput,
            event,
          });

          // extract address of sub_event and create it on database
          if (subEventInput?.address) {
            subEvent.address = await this.addressService.create(
              subEventInput.address,
            );
            await this.subEventRepository.save(subEvent);
          }
        }
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
