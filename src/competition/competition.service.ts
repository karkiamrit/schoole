import { Injectable } from '@nestjs/common';
import { OneRepoQuery, RepoQuery } from 'src/declare/types';
import { CompetitionRepository } from './competition.repository';
import { Competition } from './entities/competition.entity';
import {
  CreateCompetitionInput,
  UpdateCompetitionInput,
} from './inputs/competition.input';

import { FindOneOptions } from 'typeorm';
@Injectable()
export class CompetitionService {
  constructor(private readonly competitionRepository: CompetitionRepository) {}

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

  create(input: CreateCompetitionInput): Promise<Competition> {
    const competition = new Competition();
    Object.assign(competition, input);
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
}
