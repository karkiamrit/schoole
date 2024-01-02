import { Institution } from './entities/institution.entity';
import { CustomRepository } from '../modules/decorators/typeorm.decorator';
import { Repository } from 'typeorm/repository/Repository';

@CustomRepository(Institution)
export class InstitutionRepository extends Repository<Institution> {}
