import { Module } from '@nestjs/common';
import { TypeOrmExModule } from '../modules/decorators/typeorm.module';
import { EventService } from './event.service';
import { EventRepository } from './event.repository';
import { EventResolver } from './event.resolver';
import { InstitutionService } from '@/institution/institution.service';
import { InstitutionRepository } from '@/institution/institution.repository';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      EventRepository,
      InstitutionRepository,
    ]),
  ],
  providers: [EventService, EventResolver, InstitutionService],
  exports: [EventService],
})
export class EventModule {}
