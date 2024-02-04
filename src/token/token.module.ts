import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { TokenRepository } from './token.repository';
import { TypeOrmExModule } from '@/modules/decorators/typeorm.module';
import { UserRepository } from '@/user/user.repository';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([TokenRepository, UserRepository]),
  ],
  providers: [TokenService, TokenRepository],
  exports: [TokenService],
})
export class TokenModule {}
