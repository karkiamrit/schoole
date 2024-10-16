import { Payment } from './entities/payment.entity';
import { CustomRepository } from '../modules/decorators/typeorm.decorator';
import { Repository } from 'typeorm/repository/Repository';

@CustomRepository(Payment)
export class PaymentRepository extends Repository<Payment> {}
