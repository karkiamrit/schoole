import { Participant } from './entities/participant.entity';
import { CustomRepository } from '../modules/decorators/typeorm.decorator';
import { Repository } from 'typeorm/repository/Repository';

@CustomRepository(Participant)
export class ParticipantRepository extends Repository<Participant> {}
