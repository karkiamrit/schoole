import { Module } from '@nestjs/common';
import { TypeOrmExModule } from '@/modules/decorators/typeorm.module';
import { PaymentService } from './payment.service';
import { PaymentRepository } from './payment.repository';
import { PaymentResolver } from './payment.resolver';
import { PaymentController } from '@/payment/payment.controller';
import { SubEventService } from '@/subevent/subEvent.service';
import { SubEventRepository } from '@/subevent/subEvent.repository';
import { EventService } from '@/event/event.service';
import { AddressService } from '@/address/address.service';
import { StudentRepository } from '@/student/student.repository';
import { EventRepository } from '@/event/event.repository';
import { InstitutionService } from '@/institution/institution.service';
import { AddressRepository } from '@/address/address.repository';
import { InstitutionRepository } from '@/institution/institution.repository';
import { ParticipantRepository } from '@/participant/participant.repository';
import { MailService } from '@/mail/mail.service';
import { MailRepository } from '@/mail/mail.repository';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      PaymentRepository,
      SubEventRepository,
      StudentRepository,
      EventRepository,
      AddressRepository,
      InstitutionRepository,
      ParticipantRepository,
      MailRepository,
    ]),
  ],
  providers: [
    PaymentService,
    PaymentResolver,
    SubEventService,
    EventService,
    AddressService,
    InstitutionService,
    MailService,
  ],
  controllers: [PaymentController],
  exports: [PaymentService],
})
export class PaymentModule {}
