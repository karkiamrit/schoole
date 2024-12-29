import { Module } from '@nestjs/common';
import { TypeOrmExModule } from '@/modules/decorators/typeorm.module';
import { SubEventService } from './subEvent.service';
import { SubEventRepository } from './subEvent.repository';
import { SubEventResolver } from './subEvent.resolver';
import { EventService } from '@/event/event.service';
import { EventRepository } from '@/event/event.repository';
import { InstitutionService } from '@/institution/institution.service';
import { InstitutionRepository } from '@/institution/institution.repository';
import { AddressRepository } from '@/address/address.repository';
import { AddressService } from '@/address/address.service';
import { UserRepository } from '@/user/user.repository';
import { SubEventsController } from './subEvent.controller';
import { StudentService } from '@/student/student.service';
import { StudentRepository } from '@/student/student.repository';
import { ParticipantRepository } from '@/participant/participant.repository';
import { MailService } from '@/mail/mail.service';
import { MailRepository } from '@/mail/mail.repository';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      SubEventRepository,
      EventRepository,
      InstitutionRepository,
      AddressRepository,
      UserRepository,
      StudentRepository,
      ParticipantRepository,
      MailRepository,
    ]),
  ],
  controllers: [SubEventsController],
  providers: [
    SubEventService,
    SubEventResolver,
    EventService,
    InstitutionService,
    AddressService,
    StudentService,
    MailService,
  ],
  exports: [SubEventService],
})
export class SubEventModule {}
