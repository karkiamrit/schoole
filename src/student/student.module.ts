import { Module } from '@nestjs/common';
import { TypeOrmExModule } from '../modules/decorators/typeorm.module';
import { StudentService } from './student.service';
import { StudentRepository } from './student.repository';
import { StudentResolver } from './student.resolver';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([StudentRepository])],
  providers: [StudentService, StudentResolver],
  exports: [StudentService],
})
export class StudentModule {}
