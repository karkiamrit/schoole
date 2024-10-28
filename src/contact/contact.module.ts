import { Module } from '@nestjs/common';
import { TypeOrmExModule } from '@/modules/decorators/typeorm.module';
import { ContactRepository } from '@/contact/contact.repository';
import { ContactService } from '@/contact/contact.service';
import { ContactResolver } from '@/contact/contact.resolver';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([ContactRepository])],
  providers: [ContactService, ContactResolver],
  exports: [ContactService],
})
export class ContactModule {}
