import { Injectable } from '@nestjs/common';
import { OneRepoQuery, RepoQuery } from 'src/declare/types';
import { InstitutionRepository } from './institution.repository';
import { Institution } from './entities/institution.entity';
import {
  CreateInstitutionInput,
  UpdateInstitutionInput,
} from './inputs/institution.input';

import { FindOneOptions } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
@Injectable()
export class InstitutionService {
  constructor(private readonly institutionRepository: InstitutionRepository) {}

  getMany(qs?: RepoQuery<Institution>, query?: string) {
    return this.institutionRepository.getMany(
      {
        ...qs,
        relations: ['user'],
      } || {},
      query,
    );
  }

  getOne(qs: OneRepoQuery<Institution>, query?: string) {
    if (query) {
      return this.institutionRepository.getOne(
        { ...qs, relations: ['user'] },
        query,
      );
    } else {
      return this.institutionRepository.findOne({
        ...qs,
        relations: ['user'],
      } as FindOneOptions<Institution>);
    }
  }

  create(input: CreateInstitutionInput, user: User): Promise<Institution> {
    const institution = new Institution();
    Object.assign(institution, input);
    institution.user = user;
    return this.institutionRepository.save(institution);
  }

  createMany(input: CreateInstitutionInput[]): Promise<Institution[]> {
    return this.institutionRepository.save(input);
  }

  async update(
    id: number,
    input: UpdateInstitutionInput,
  ): Promise<Institution> {
    const institution = await this.institutionRepository.findOne({
      where: { id },
    });
    return this.institutionRepository.save({ ...institution, ...input });
  }

  async delete(id: number) {
    const institution = this.institutionRepository.findOne({ where: { id } });
    await this.institutionRepository.delete({ id });
    return institution;
  }
}
