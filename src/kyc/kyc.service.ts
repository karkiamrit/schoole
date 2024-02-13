import { Injectable } from '@nestjs/common';
import { OneRepoQuery, RepoQuery } from 'src/declare/types';
import { KycRepository } from './kyc.repository';
import { Kyc } from './entities/kyc.entity';
import { CreateKycInput, UpdateKycInput } from './inputs/kyc.input';

import { FindOneOptions } from 'typeorm';
@Injectable()
export class KycService {
  constructor(private readonly kycRepository: KycRepository) {}

  
  /**
   * Retrieves multiple KYC (Know Your Customer) records based on provided query parameters.
   * @param qs - Query parameters for the KYC repository.
   * @param query - General query parameter.
   * @returns A list of KYC records.
   */

  getMany(qs?: RepoQuery<Kyc>, query?: string) {
    return this.kycRepository.getMany(qs || {}, query);
  }
  /**
   * Retrieves a single KYC (Know Your Customer) record based on provided query parameters.
   * @param qs - Query parameters for the KYC repository.
   * @param query - General query parameter.
   * @returns A single KYC record.
   */
  getOne(qs: OneRepoQuery<Kyc>, query?: string) {
    if (query) {
      return this.kycRepository.getOne(qs, query);
    } else {
      return this.kycRepository.findOne(qs as FindOneOptions<Kyc>);
    }
  }
  /**
   * Creates a new KYC (Know Your Customer) record.
   * @param input - KYC details.
   * @returns The created KYC record.
   */
  create(input: CreateKycInput): Promise<Kyc> {
    const kyc = new Kyc();
    Object.assign(kyc, input);
    return this.kycRepository.save(kyc);
  }
  /**
   * Creates multiple KYC (Know Your Customer) records.
   * @param input - Array of KYC details.
   * @returns An array of created KYC records.
   */
  createMany(input: CreateKycInput[]): Promise<Kyc[]> {
    return this.kycRepository.save(input);
  }
  /**
   * Updates an existing KYC (Know Your Customer) record by its ID.
   * @param id - ID of the KYC record to be updated.
   * @param input - Updated KYC details.
   * @returns The updated KYC record.
   */
  async update(id: number, input: UpdateKycInput): Promise<Kyc> {
    const kyc = await this.kycRepository.findOne({ where: { id } });
    return this.kycRepository.save({ ...kyc, ...input });
  }
 /**
   * Deletes a KYC (Know Your Customer) record by its ID.
   * @param id - ID of the KYC record to be deleted.
   * @returns The deleted KYC record.
   */
  async delete(id: number) {
    const kyc = this.kycRepository.findOne({ where: { id } });
    await this.kycRepository.delete({ id });
    return kyc;
  }
}
