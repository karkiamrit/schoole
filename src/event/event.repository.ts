import { Event } from './entities/event.entity';
import { CustomRepository } from '../modules/decorators/typeorm.decorator';
import { Repository } from 'typeorm/repository/Repository';

@CustomRepository(Event)
export class EventRepository extends Repository<Event> {}
