import { Module } from '@nestjs/common';
import { TypeOrmExModule } from '../modules/decorators/typeorm.module';
import { SubEventService } from './subEvent.service';
import { SubEventRepository } from './subEvent.repository';
import { SubEventResolver } from './subEvent.resolver';
import { ParticipantRepository } from '@/participant/participant.repository';
import { EventService } from '@/event/event.service';
import { EventRepository } from '@/event/event.repository';
import { InstitutionService } from '@/institution/institution.service';
import { InstitutionRepository } from '@/institution/institution.repository';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      SubEventRepository,
      ParticipantRepository,
      EventRepository,
      InstitutionRepository,
    ]),
  ],
  providers: [
    SubEventService,
    SubEventResolver,
    EventService,
    InstitutionService,
  ],
  exports: [SubEventService],
})
export class SubEventModule {}
