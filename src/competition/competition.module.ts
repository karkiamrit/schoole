import { Module } from '@nestjs/common';
import { TypeOrmExModule } from '../modules/decorators/typeorm.module';
import { CompetitionService } from './competition.service';
import { CompetitionRepository } from './competition.repository';
import { CompetitionResolver } from './competition.resolver';
import { ParticipantRepository } from '@/participant/participant.repository';
import { EventService } from '@/event/event.service';
import { EventRepository } from '@/event/event.repository';
import { InstitutionService } from '@/institution/institution.service';
import { InstitutionRepository } from '@/institution/institution.repository';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      CompetitionRepository,
      ParticipantRepository,
      EventRepository,
      InstitutionRepository,
    ]),
  ],
  providers: [
    CompetitionService,
    CompetitionResolver,
    EventService,
    InstitutionService,
  ],
  exports: [CompetitionService],
})
export class CompetitionModule {}
