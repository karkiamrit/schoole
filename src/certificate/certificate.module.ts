import { Module } from '@nestjs/common';
import { TypeOrmExModule } from '../modules/decorators/typeorm.module';
import { CertificateService } from './certificate.service';
import { CertificateRepository } from './certificate.repository';
import { CertificateResolver } from './certificate.resolver';
import { CertificateController } from './certificate.controller';
import { FileUploadService } from '@/modules/upload/file-upload.service';
import { TempStorageService } from '@/modules/temp-storage/temp-storage.service';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([CertificateRepository])],
  providers: [
    CertificateService,
    CertificateResolver,
    FileUploadService,
    TempStorageService,
  ],
  controllers: [CertificateController],
  exports: [CertificateService],
})
export class CertificateModule {}
