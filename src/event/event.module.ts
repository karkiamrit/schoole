import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmExModule } from '../modules/decorators/typeorm.module';
import { EventService } from './event.service';
import { EventRepository } from './event.repository';
import { EventResolver } from './event.resolver';
import { InstitutionService } from '@/institution/institution.service';
import { InstitutionRepository } from '@/institution/institution.repository';
import { SubEventRepository } from '@/subevent/subEvent.repository';
import { AddressService } from '@/address/address.service';
import { AddressRepository } from '@/address/address.repository';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      EventRepository,
      InstitutionRepository,
      SubEventRepository,
      AddressRepository,
    ]),
  ],
  providers: [EventService, EventResolver, InstitutionService, AddressService],
  exports: [EventService],
})
export class EventModule {}
