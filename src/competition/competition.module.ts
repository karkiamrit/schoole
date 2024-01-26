import { Module } from '@nestjs/common';
import { TypeOrmExModule } from '../modules/decorators/typeorm.module';
import { CompetitionService } from './competition.service';
import { CompetitionRepository } from './competition.repository';
import { CompetitionResolver } from './competition.resolver';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([CompetitionRepository])],
  providers: [CompetitionService, CompetitionResolver],
  exports: [CompetitionService],
})
export class CompetitionModule {}
