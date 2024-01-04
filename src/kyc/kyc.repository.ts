import { Kyc } from './entities/kyc.entity';
import { CustomRepository } from '../modules/decorators/typeorm.decorator';
import { Repository } from 'typeorm/repository/Repository';

@CustomRepository(Kyc)
export class KycRepository extends Repository<Kyc> {}
