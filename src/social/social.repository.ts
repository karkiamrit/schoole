import { CustomRepository } from '@/modules/decorators/typeorm.decorator';
import { Repository } from 'typeorm/repository/Repository';
import { Social } from '@/social/entity/social.entity';

//Making Instance of User to perform functions
@CustomRepository(Social)
export class SocialRepository extends Repository<Social> {}
