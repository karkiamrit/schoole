import { Organizer } from './entities/organizer.entity';
import { CustomRepository } from '../modules/decorators/typeorm.decorator';
import { Repository } from 'typeorm/repository/Repository';

@CustomRepository(Organizer)
export class OrganizerRepository extends Repository<Organizer> {}
