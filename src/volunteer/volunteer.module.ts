import { Module } from '@nestjs/common';
import { TypeOrmExModule } from '../modules/decorators/typeorm.module';
import { VolunteerService } from './volunteer.service';
import { VolunteerRepository } from './volunteer.repository';
import { VolunteerResolver } from './volunteer.resolver';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([VolunteerRepository])],
  providers: [VolunteerService, VolunteerResolver],
  exports: [VolunteerService],
})
export class VolunteerModule {}
