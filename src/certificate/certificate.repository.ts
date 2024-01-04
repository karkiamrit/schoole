import { Certificate } from './entities/certificate.entity';
import { CustomRepository } from '../modules/decorators/typeorm.decorator';
import { Repository } from 'typeorm/repository/Repository';

@CustomRepository(Certificate)
export class CertificateRepository extends Repository<Certificate> {}
