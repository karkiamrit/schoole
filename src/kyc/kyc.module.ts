import { Module } from '@nestjs/common';
import { TypeOrmExModule } from '../modules/decorators/typeorm.module';
import { KycService } from './kyc.service';
import { KycRepository } from './kyc.repository';
import { KycResolver } from './kyc.resolver';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([KycRepository])],
  providers: [KycService, KycResolver],
  exports: [KycService],
})
export class KycModule {}
