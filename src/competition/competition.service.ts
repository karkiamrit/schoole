import { Injectable } from '@nestjs/common';
import { OneRepoQuery, RepoQuery } from 'src/declare/types';
import { CompetitionRepository } from './competition.repository';
import { Competition } from './entities/competition.entity';
import {
  CreateCompetitionInput,
  UpdateCompetitionInput,
} from './inputs/competition.input';

import { FindOneOptions } from 'typeorm';
import { User } from '@/user/entities/user.entity';
import { Participant } from '../participant/entities/participant.entity';
import { ParticipantRepository } from '@/participant/participant.repository';
import { EventService } from '@/event/event.service';
@Injectable()
export class CompetitionService {
  constructor(
    private readonly competitionRepository: CompetitionRepository,
    private readonly participantRepository: ParticipantRepository,
    private readonly eventService: EventService,
  ) {}

  getMany(qs?: RepoQuery<Competition>, query?: string) {
    return this.competitionRepository.getMany(qs || {}, query);
  }

  getOne(qs: OneRepoQuery<Competition>, query?: string) {
    if (query) {
      return this.competitionRepository.getOne(qs, query);
    } else {
      return this.competitionRepository.findOne(
        qs as FindOneOptions<Competition>,
      );
    }
  }

  async create(
    input: CreateCompetitionInput,
    eventId: number,
  ): Promise<Competition> {
    const competition = new Competition();
    const event = await this.eventService.getOne({ where: { id: eventId } });
    Object.assign(competition, input);
    competition.event = event;
    return this.competitionRepository.save(competition);
  }

  createMany(input: CreateCompetitionInput[]): Promise<Competition[]> {
    return this.competitionRepository.save(input);
  }

  async update(
    id: number,
    input: UpdateCompetitionInput,
  ): Promise<Competition> {
    const competition = await this.competitionRepository.findOne({
      where: { id },
    });
    return this.competitionRepository.save({ ...competition, ...input });
  }

  async delete(id: number) {
    const competition = this.competitionRepository.findOne({ where: { id } });
    await this.competitionRepository.delete({ id });
    return competition;
  }

  //student clicks competition to participate
  async participate(id: number, user: User) {
    if (!user.student) {
      throw new Error('You must be a student to participate');
    }
    const competition = await this.competitionRepository.findOne({
      where: { id: id },
    });
    const participant = new Participant();
    console.log(user.student.participations);
    if (user.student.participations.length >= 1) {
      participant.competitions.push(competition);
    }
    participant.competitions = [];
    participant.competitions.push(competition);
    participant.student = user.student;
    await this.participantRepository.save(participant);
    competition.participants.push(participant);
    return { status: 'success' };
  }
}
