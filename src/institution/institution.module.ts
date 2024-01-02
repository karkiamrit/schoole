import { Module } from '@nestjs/common';
import { TypeOrmExModule } from '../modules/decorators/typeorm.module';
import { InstitutionService } from './institution.service';
import { InstitutionRepository } from './institution.repository';
import { InstitutionResolver } from './institution.resolver';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([InstitutionRepository])],
  providers: [InstitutionService, InstitutionResolver],
  exports: [InstitutionService],
})
export class InstitutionModule {}
