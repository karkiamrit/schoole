import { Competition } from './entities/competition.entity';
import { CustomRepository } from '../modules/decorators/typeorm.decorator';
import { Repository } from 'typeorm/repository/Repository';

@CustomRepository(Competition)
export class CompetitionRepository extends Repository<Competition> {}
