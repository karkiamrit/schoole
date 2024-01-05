import { Module } from '@nestjs/common';
import { TypeOrmExModule } from '../modules/decorators/typeorm.module';
import { AddressService } from './address.service';
import { AddressRepository } from './address.repository';
import { AddressResolver } from './address.resolver';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([AddressRepository])],
  providers: [AddressService, AddressResolver],
  exports: [AddressService],
})
export class AddressModule {}
