import { Module } from '@nestjs/common';
import { TypeOrmExModule } from '../modules/decorators/typeorm.module';
import { OrganizerService } from './organizer.service';
import { OrganizerRepository } from './organizer.repository';
import { OrganizerResolver } from './organizer.resolver';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([OrganizerRepository])],
  providers: [OrganizerService, OrganizerResolver],
  exports: [OrganizerService],
})
export class OrganizerModule {}
