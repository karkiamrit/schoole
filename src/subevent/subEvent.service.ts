import { Injectable } from '@nestjs/common';
import { OneRepoQuery, RepoQuery } from 'src/declare/types';
import { SubEventRepository } from './subEvent.repository';
import { SubEvent } from './entities/subEvent.entity';
import {
  CreateSubEventInput,
  UpdateSubEventInput,
} from './inputs/subEvent.input';
import { ConfigService } from '@nestjs/config';
import { FindOneOptions, In } from 'typeorm';
import { User } from '@/user/entities/user.entity';
import { EventService } from '@/event/event.service';
import { AddressService } from '@/address/address.service';
import { StudentRepository } from '@/student/student.repository';
import { ParticipantRepository } from '@/participant/participant.repository';
import { MailService } from '@/mail/mail.service';
import { format } from 'date-fns';
import { generateRegistrationId } from '@/subevent/subEvent.utils';

@Injectable()
export class SubEventService {
  constructor(
    private readonly subEventRepository: SubEventRepository,
    private readonly eventService: EventService,
    private readonly addressService: AddressService,
    private readonly studentRepository: StudentRepository,
    private readonly participantRepository: ParticipantRepository,
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
  ) {}

  getMany(qs?: RepoQuery<SubEvent>, query?: string) {
    return this.subEventRepository.getMany(qs || {}, query);
  }

  async getAllEvents(
    whereFilter: any,
    categories?: string[],
    types?: string[],
    startDate?: Date,
    endDate?: Date,
    registrationFeeLower?: number,
    registrationFeeUpper?: number,
    page?: number,
    size?: number,
    orderBy?: string,
    orderDirection?: 'ASC' | 'DESC',
  ) {
    const params: {
      whereFilter: any;
      categories?: string[];
      types?: string[];
      startDate?: Date;
      endDate?: Date;
      registrationFeeLower?: number;
      registrationFeeUpper?: number;
      page?: number;
      size?: number;
      orderBy?: string;
      orderDirection?: 'ASC' | 'DESC';
    } = {
      whereFilter,
      categories,
      types,
      startDate,
      endDate,
      registrationFeeLower,
      registrationFeeUpper,
      page,
      size,
      orderBy,
      orderDirection,
    };

    // Filter out null or undefined values
    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(([, v]) => v != null),
    );

    return this.subEventRepository.allEvent(
      filteredParams.whereFilter,
      filteredParams.categories,
      filteredParams.types,
      filteredParams.startDate,
      filteredParams.endDate,
      filteredParams.registrationFeeLower,
      filteredParams.registrationFeeUpper,
      filteredParams.page,
      filteredParams.size,
      filteredParams.orderBy,
      filteredParams.orderDirection,
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
    // subEvent.participants.push(user.student);

    const registrationId = generateRegistrationId({
      length: 12,
      includeNumbers: true,
      includeUppercase: true,
      includeLowercase: false,
      prefix: 'EVENT',
      includeYear: true,
    });
    const participationData = {
      student_id: user.student.id,
      sub_event_id: subEvent.id,
      registrationId: registrationId,
      transaction_code: options?.transaction_code,
      transaction_uuid: options?.transaction_uuid,
      status: options?.status,
      total_amount: options?.total_amount,
      payment_method: options?.payment_method,
    };

    subEvent.participant_count += 1;
    // Save the updated SubEvent
    await this.subEventRepository.save(subEvent);
    const participateInstance = await this.participantRepository.save({
      ...participationData,
    });

    // if (options) {
    //   const participation = await this.participantRepository.findOne({
    //     where: {
    //       student_id: user.student.id,
    //       sub_event_id: subEvent.id,
    //     },
    //   });
    //   const optionData = {
    //     transaction_code: options.transaction_code,
    //     transaction_uuid: options.transaction_uuid,
    //     status: options.status,
    //     total_amount: options.total_amount,
    //     payment_method: options.payment_method,
    //   };
    //   participateInstance  = await this.participantRepository.save({
    //     ...participation,
    //     ...optionData,
    //   });
    // }
    const eventDetailUrl = `${this.configService.get<string>('ACHIVEE_ROOT_URL')}/events/${subEvent.id}`;
    const mailData = {
      participantName: user?.student.first_name ?? 'User',
      eventName: subEvent.name,
      eventDate: format(subEvent.start_date, 'do MMMM, yyyy'),
      eventTime: format(subEvent.start_date, 'hh:mm aa'),
      eventLocation: subEvent?.address?.display_name ?? 'Online',
      registrationId: participateInstance?.registrationId,
      eventDetailsUrl: eventDetailUrl,
      supportEmail: 'support@achivee.com',
      organizationName: 'Achivee',
      participantEmail: user.email,
      organizationAddress: 'Kathmandu',
      unsubscribeUrl: 'https://achivee.com',
    };
    console.log(mailData);
    await this.mailService.sendParticipationCofirmationEmail(
      user.email,
      mailData,
    );
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
