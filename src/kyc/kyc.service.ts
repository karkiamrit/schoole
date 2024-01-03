import { Injectable } from '@nestjs/common';
import { OneRepoQuery, RepoQuery } from 'src/declare/types';
import { KycRepository } from './kyc.repository';
import { Kyc } from './entities/kyc.entity';
import { CreateKycInput, UpdateKycInput } from './inputs/kyc.input';

import { FindOneOptions } from 'typeorm';
@Injectable()
export class KycService {
  constructor(private readonly kycRepository: KycRepository) {}

  getMany(qs?: RepoQuery<Kyc>, query?: string) {
    return this.kycRepository.getMany(qs || {}, query);
  }

  getOne(qs: OneRepoQuery<Kyc>, query?: string) {
    if (query) {
      return this.kycRepository.getOne(qs, query);
    } else {
      return this.kycRepository.findOne(qs as FindOneOptions<Kyc>);
    }
  }

  create(input: CreateKycInput): Promise<Kyc> {
    const kyc = new Kyc();
    Object.assign(kyc, input);
    return this.kycRepository.save(kyc);
  }

  createMany(input: CreateKycInput[]): Promise<Kyc[]> {
    return this.kycRepository.save(input);
  }

  async update(id: number, input: UpdateKycInput): Promise<Kyc> {
    const kyc = await this.kycRepository.findOne({ where: { id } });
    return this.kycRepository.save({ ...kyc, ...input });
  }

  async delete(id: number) {
    const kyc = this.kycRepository.findOne({ where: { id } });
    await this.kycRepository.delete({ id });
    return kyc;
  }
}
