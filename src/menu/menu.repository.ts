import { Menu } from './entities/menu.entity';
import { CustomRepository } from '@/modules/decorators/typeorm.decorator';
import { Repository } from 'typeorm/repository/Repository';

@CustomRepository(Menu)
export class MenuRepository extends Repository<Menu> {}
