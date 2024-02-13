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
   /**
   * Retrieves multiple events based on provided query parameters.
   * @param qs - Query parameters for the event repository.
   * @param query - General query parameter.
   * @returns A list of events.
   */

  getMany(qs?: RepoQuery<Event>, query?: string) {
    return this.eventRepository.getMany(qs || {}, query);
  }
  /**
   * Retrieves a single event based on provided query parameters.
   * @param qs - Query parameters for the event repository.
   * @param query - General query parameter.
   * @returns A single event.
   */
  getOne(qs: OneRepoQuery<Event>, query?: string) {
    if (query) {
      return this.eventRepository.getOne(qs, query);
    } else {
      return this.eventRepository.findOne(qs as FindOneOptions<Event>);
    }
  }
  /**
   * Creates a new event.
   * @param input - Event details.
   * @param user - User associated with the event (optional).
   * @returns The created event.
   */
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
 /**
   * Creates multiple events.
   * @param input - Array of event details.
   * @returns An array of created events.
   */
  createMany(input: CreateEventInput[]): Promise<Event[]> {
    return this.eventRepository.save(input);
  }
    /**
   * Updates an existing event by its ID.
   * @param id - ID of the event to be updated.
   * @param input - Updated event details.
   * @returns The updated event.
   */

  async update(id: number, input: UpdateEventInput): Promise<Event> {
    const event = await this.eventRepository.findOne({ where: { id } });
    return this.eventRepository.save({ ...event, ...input });
  }
 /**
   * Deletes an event by its ID.
   * @param id - ID of the event to be deleted.
   * @returns The deleted event.
   */
  async delete(id: number) {
    const event = this.eventRepository.findOne({ where: { id } });
    await this.eventRepository.delete({ id });
    return event;
  }
}
