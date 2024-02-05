import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { TokenResolver } from './token.resolver';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports:[JwtModule],
  providers: [TokenService, TokenResolver],
  exports: [TokenService],
})
export class TokenModule {}
