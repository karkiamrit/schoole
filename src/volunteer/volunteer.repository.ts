import { Volunteer } from './entities/volunteer.entity';
import { CustomRepository } from '../modules/decorators/typeorm.decorator';
import { Repository } from 'typeorm/repository/Repository';

@CustomRepository(Volunteer)
export class VolunteerRepository extends Repository<Volunteer> {}
