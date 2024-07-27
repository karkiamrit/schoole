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
import { StudentRepository } from '@/student/student.repository';
@Injectable()
export class SubEventService {
  constructor(
    private readonly subEventRepository: SubEventRepository,
    private readonly participantRepository: ParticipantRepository,
    private readonly eventService: EventService,
    private readonly addressService: AddressService,
    private readonly studentRepository: StudentRepository,
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
  async participateMany(id: number, studentIds: number[]) {
    // Find the SubEvent by id
    const SubEvent = await this.subEventRepository.findOne({
      where: { id: id },
    });
    // console.log(SubEvent.participants, 'participants');
    if (!SubEvent) {
      throw new Error(`SubEvent  not found`);
    }

    // Create an array to hold participant promises
    const participantPromises = studentIds.map(async (studentId: number) => {
      // Find the student by id
      const student = await this.studentRepository.findOne({
        where: { id: studentId },
      });

      if (!student) {
        throw new Error(`Student with id ${studentId} not found`);
      }

      const participants = await this.participantRepository.find({
        where: { student: { id: studentId } },
      });
      if (participants.length> 0) {
        throw new Error(`${student.first_name} has already Registered`);
      }
      // Create a new participant
      const participant = new Participant();
      participant.student = student;
      participant.SubEvents = [SubEvent];

      // Save the participant and return it
      return await this.participantRepository.save(participant);
    });

    // Wait for all participant promises to resolve
    return await Promise.all(participantPromises);
  }
}
