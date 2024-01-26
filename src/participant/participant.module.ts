import { Module } from '@nestjs/common';
import { TypeOrmExModule } from '../modules/decorators/typeorm.module';
import { ParticipantRepository } from './participant.repository';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([ParticipantRepository])],
})
export class ParticipantModule {}
