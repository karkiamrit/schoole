import { Injectable } from '@nestjs/common';
import { OneRepoQuery, RepoQuery } from 'src/declare/types';
import { CertificateRepository } from './certificate.repository';
import { Certificate } from './entities/certificate.entity';
import {
  CreateCertificateInput,
  UpdateCertificateInput,
} from './inputs/certificate.input';

import { FileUploadService } from '@/modules/upload/file-upload.service';
import { randomBytes } from 'crypto';
import { FindOneOptions } from 'typeorm';
import { TempStorageService } from '@/modules/temp-storage/temp-storage.service';

@Injectable()
export class CertificateService {
  constructor(
    private readonly certificateRepository: CertificateRepository,
    private readonly fileUploadService: FileUploadService,
    private readonly tempStorageService: TempStorageService,
  ) {}

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

  private generateUniqueTransactionId(): string {
    return randomBytes(16).toString('hex');
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const filePath = await this.fileUploadService.upload(file);
    const transactionId = this.generateUniqueTransactionId(); // Implement this function
    this.tempStorageService.store(transactionId, filePath); // Implement this service
    return transactionId;
  }

  async createCertificateWithTransaction(
    input: CreateCertificateInput,
    transactionId: string,
  ): Promise<Certificate> {
    const filePath = await this.tempStorageService.retrieve(transactionId); // Implement this service
    if (!filePath) {
      throw new Error('Invalid transaction ID');
    }
    const certificate = await this.create({ ...input, photo: filePath });
    this.tempStorageService.remove(transactionId); // Implement this service
    return certificate;
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
