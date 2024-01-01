import { Address } from './entities/address.entity';
import { CustomRepository } from '../modules/decorators/typeorm.decorator';
import { Repository } from 'typeorm/repository/Repository';

@CustomRepository(Address)
export class AddressRepository extends Repository<Address> {}
