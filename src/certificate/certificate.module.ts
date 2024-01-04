import { Module } from '@nestjs/common';
import { TypeOrmExModule } from '../modules/decorators/typeorm.module';
import { CertificateService } from './certificate.service';
import { CertificateRepository } from './certificate.repository';
import { CertificateResolver } from './certificate.resolver';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([CertificateRepository])],
  providers: [CertificateService, CertificateResolver],
  exports: [CertificateService],
})
export class CertificateModule {}
