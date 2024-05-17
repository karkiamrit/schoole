import { Injectable } from '@nestjs/common';
import { OneRepoQuery, RepoQuery } from 'src/declare/types';
import { SubEventRepository } from './subEvent.repository';
import { SubEvent } from './entities/subEvent.entity';
import {
  CreateSubEventInput,
  UpdateSubEventInput,
} from './inputs/subEvent.input';

import { FindOneOptions } from 'typeorm';
import { User } from '@/user/entities/user.entity';
import { Participant } from '@/participant/entities/participant.entity';
import { ParticipantRepository } from '@/participant/participant.repository';
import { EventService } from '@/event/event.service';
import { AddressService } from '@/address/address.service';
@Injectable()
export class SubEventService {
  constructor(
    private readonly subEventRepository: SubEventRepository,
    private readonly participantRepository: ParticipantRepository,
    private readonly eventService: EventService,
    private readonly addressService: AddressService,
  ) {}

  getMany(qs?: RepoQuery<SubEvent>, query?: string) {
    return this.subEventRepository.getMany(qs || {}, query);
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
    const SubEvent = await this.subEventRepository.findOne({ where: { id } });
    // check address in the input and if the address is available update its address as well
    // check address in the input and if the address is available update its address as well
    if (input.address) {
      await this.addressService.update(SubEvent.address.id, {
        ...input.address,
      });
    }

    return this.subEventRepository.save({ ...SubEvent, ...input });
  }

  async delete(id: number) {
    const SubEvent = this.subEventRepository.findOne({ where: { id } });
    await this.subEventRepository.delete({ id });
    return SubEvent;
  }

  //student clicks SubEvent to participate
  async participate(id: number, user: User) {
    if (!user.student) {
      throw new Error('You must be a student to participate');
    }
    const SubEvent = await this.subEventRepository.findOne({
      where: { id: id },
    });
    const participant = new Participant();
    console.log(user.student.participations);
    if (user.student.participations.length >= 1) {
      participant.SubEvents.push(SubEvent);
    }
    participant.SubEvents = [];
    participant.SubEvents.push(SubEvent);
    participant.student = user.student;
    await this.participantRepository.save(participant);
    SubEvent.participants.push(participant);
    return { status: 'success' };
  }
}
