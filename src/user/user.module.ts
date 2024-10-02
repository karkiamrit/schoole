import { TypeOrmExModule } from '@/modules/decorators/typeorm.module';
import { Module } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { StudentService } from '@/student/student.service';
import { StudentRepository } from '@/student/student.repository';
import { SocialService } from '@/social/social.service';
import { SocialRepository } from '@/social/social.repository';
import { AddressRepository } from '@/address/address.repository';
import { AddressService } from '@/address/address.service';
import { UserController } from '@/user/user.controller';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      UserRepository,
      StudentRepository,
      SocialRepository,
      AddressRepository,
    ]),
  ],
  controllers: [UserController],
  providers: [
    UserResolver,
    UserService,
    StudentService,
    SocialService,
    AddressService,
  ],
  exports: [UserService],
})
export class UserModule {}
