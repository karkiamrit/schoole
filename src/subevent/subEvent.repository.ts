import { SubEvent } from './entities/subEvent.entity';
import { CustomRepository } from '@/modules/decorators/typeorm.decorator';
import { Repository } from 'typeorm/repository/Repository';

@CustomRepository(SubEvent)
export class SubEventRepository extends Repository<SubEvent> {}
