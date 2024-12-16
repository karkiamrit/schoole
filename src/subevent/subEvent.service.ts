import { Injectable } from '@nestjs/common';
import { OneRepoQuery, RepoQuery } from 'src/declare/types';
import { SubEventRepository } from './subEvent.repository';
import { SubEvent } from './entities/subEvent.entity';
import {
  CreateSubEventInput,
  UpdateSubEventInput,
} from './inputs/subEvent.input';

import { FindOneOptions, In } from 'typeorm';
import { User } from '@/user/entities/user.entity';
import { EventService } from '@/event/event.service';
import { AddressService } from '@/address/address.service';
import { StudentRepository } from '@/student/student.repository';
import { ParticipantRepository } from '@/participant/participant.repository';

@Injectable()
export class SubEventService {
  constructor(
    private readonly subEventRepository: SubEventRepository,
    private readonly eventService: EventService,
    private readonly addressService: AddressService,
    private readonly studentRepository: StudentRepository,
    private readonly participantRepository: ParticipantRepository,
  ) {}

  getMany(qs?: RepoQuery<SubEvent>, query?: string) {
    return this.subEventRepository.getMany(qs || {}, query);
  }

  async getAllEvents(
    categories?: string[],
    types?: string[],
    startDate?: Date,
    endDate?: Date,
    registerationFeeLower?: number,
    registerationFeeUpper?: number,
    page?: number,
    size?: number,
    orderBy?: string,
    orderDirection?: 'ASC' | 'DESC',
  ) {
    return this.subEventRepository.allEvent(
      categories,
      types,
      startDate,
      endDate,
      registerationFeeLower,
      registerationFeeUpper,
      page,
      size,
      orderBy,
      orderDirection,
    );
  }

  getOne(qs: OneRepoQuery<SubEvent>, query?: string) {
    if (query) {
      return this.subEventRepository.getOne(qs, query);
    } else {
      return this.subEventRepository.findOne(qs as FindOneOptions<SubEvent>);
    }
  }

  async create(input: CreateSubEventInput, eventId: number): Promise<SubEvent> {
    // const subEvent = new SubEvent();
    const event = await this.eventService.getOne({ where: { id: eventId } });
    const { address, ...SubEventInput } = input;
    const subEvent = await this.subEventRepository.save(
      this.subEventRepository.create({ ...SubEventInput, event }),
    );
    // Get sub event's address and save it to database
    if (address) {
      subEvent.address = await this.addressService.create(address);
    }
    return this.subEventRepository.save(subEvent);
  }

  async createMany(input: CreateSubEventInput[]): Promise<SubEvent[]> {
    return this.subEventRepository.save(input);
  }

  async update(id: number, input: UpdateSubEventInput): Promise<SubEvent> {
    const subEvent = await this.subEventRepository.findOne({ where: { id } });
    // check address in the input and if the address is available update its address as well
    if (input.address) {
      if (subEvent.address && subEvent.address.id) {
        await this.addressService.update(subEvent.address.id, {
          ...input.address,
        });
      } else {
        subEvent.address = await this.addressService.create(input.address);
        await this.subEventRepository.update(subEvent.id, subEvent);
      }
    }
    return this.subEventRepository.save({ ...subEvent, ...input });
  }

  async delete(id: number) {
    const SubEvent = this.subEventRepository.findOne({ where: { id } });
    await this.subEventRepository.delete({ id });
    return SubEvent;
  }

  //student clicks SubEvent to participate
  async participate(id: number, user: User, options?: Record<string, any>) {
    if (!user.student) {
      throw new Error('You must be a student to participate');
    }

    const subEvent = await this.subEventRepository.findOne({
      where: { id: id },
      relations: ['participants'],
    });

    if (!subEvent) {
      throw new Error('Event not found!!');
    }

    const isAlreadyParticipating = subEvent.participants.some(
      (participant) => participant.id === user.student.id,
    );

    if (isAlreadyParticipating) {
      throw new Error('You have already registered for this SubEvent');
    }

    // Add the student to the SubEvent's participants
    subEvent.participants.push(user.student);

    subEvent.participant_count += 1;
    // Save the updated SubEvent
    await this.subEventRepository.save(subEvent);

    if (options) {
      const participation = await this.participantRepository.findOne({
        where: {
          student_id: user.student.id,
          sub_event_id: subEvent.id,
        },
      });
      const optionData = {
        transaction_code: options.transaction_code,
        transaction_uuid: options.transaction_uuid,
        status: options.status,
        total_amount: options.total_amount,
        payment_method: options.payment_method,
      };
      await this.participantRepository.save({
        ...participation,
        ...optionData,
      });
    }

    return { message: 'Successfully registered for the SubEvent' };
  }

  async participateMany(id: number, studentIds: number[]) {
    const subEvent = await this.subEventRepository.findOne({
      where: { id },
      relations: ['participants'],
    });

    if (!subEvent) {
      throw new Error('SubEvent not found');
    }

    const students = await this.studentRepository.find({
      where: { id: In(studentIds) },
    });

    if (students.length !== studentIds.length) {
      throw new Error('One or more students not found');
    }

    const newParticipants = students.filter(
      (student) =>
        !subEvent.participants.some(
          (participant) => participant.id === student.id,
        ),
    );

    if (newParticipants.length === 0) {
      throw new Error('All provided students are already participating');
    }

    subEvent.participants.push(...newParticipants);
    subEvent.participant_count += newParticipants.length;
    await this.subEventRepository.save(subEvent);

    return {
      message: `Successfully added ${newParticipants.length} new participants to the SubEvent`,
      newParticipants: newParticipants.map((student) => student.id),
    };
  }

  async getEventsForYou(interests?: string[]) {
    return this.subEventRepository.eventForYou(interests);
  }

  async getEventNearMe(latitude: number, longitude: number) {
    return this.subEventRepository.eventNearMe(latitude, longitude);
  }
}
