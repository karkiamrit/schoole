import { Module } from '@nestjs/common';
import { TypeOrmExModule } from '../modules/decorators/typeorm.module';
import { MenuService } from './menu.service';
import { MenuRepository } from './menu.repository';
import { MenuResolver } from './menu.resolver';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([MenuRepository])],
  providers: [MenuService, MenuResolver],
  exports: [MenuService],
})
export class MenuModule {}
