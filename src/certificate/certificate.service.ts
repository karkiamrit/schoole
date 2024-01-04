import { Injectable } from '@nestjs/common';
import { OneRepoQuery, RepoQuery } from 'src/declare/types';
import { CertificateRepository } from './certificate.repository';
import { Certificate } from './entities/certificate.entity';
import {
  CreateCertificateInput,
  UpdateCertificateInput,
} from './inputs/certificate.input';

import { FindOneOptions } from 'typeorm';
@Injectable()
export class CertificateService {
  constructor(private readonly certificateRepository: CertificateRepository) {}

  getMany(qs?: RepoQuery<Certificate>, query?: string) {
    return this.certificateRepository.getMany(qs || {}, query);
  }

  getOne(qs: OneRepoQuery<Certificate>, query?: string) {
    if (query) {
      return this.certificateRepository.getOne(qs, query);
    } else {
      return this.certificateRepository.findOne(
        qs as FindOneOptions<Certificate>,
      );
    }
  }

  create(input: CreateCertificateInput): Promise<Certificate> {
    const certificate = new Certificate();
    Object.assign(certificate, input);
    return this.certificateRepository.save(certificate);
  }

  createMany(input: CreateCertificateInput[]): Promise<Certificate[]> {
    return this.certificateRepository.save(input);
  }

  async update(
    id: number,
    input: UpdateCertificateInput,
  ): Promise<Certificate> {
    const certificate = await this.certificateRepository.findOne({
      where: { id },
    });
    return this.certificateRepository.save({ ...certificate, ...input });
  }

  async delete(id: number) {
    const certificate = this.certificateRepository.findOne({ where: { id } });
    await this.certificateRepository.delete({ id });
    return certificate;
  }
}
