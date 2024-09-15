import { TypeOrmExModule } from '@/modules/decorators/typeorm.module';
import { Module } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { StudentService } from '@/student/student.service';
import { StudentRepository } from '@/student/student.repository';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([UserRepository, StudentRepository]),
  ],
  providers: [UserResolver, UserService, StudentService],
  exports: [UserService],
})
export class UserModule {}
