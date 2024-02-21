import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { TokenResolver } from './token.resolver';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from '@/user/user.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        privateKey: configService.get('JWT_ACCESS_PRIVATE_KEY'),
        publicKey: configService.get('JWT_ACCESS_PUBLIC_KEY'),
        signOptions: {
          expiresIn: '1d',
        },
        refreshPrivateKey: configService.get('JWT_REFRESH_PRIVATE_KEY'),
        refreshPublicKey: configService.get('JWT_REFRESH_PUBLIC_KEY'),
        refreshSignOptions: {
          expiresIn: '7d',
        },
      }),
    }),
    UserModule,
  ],
  providers: [TokenService, TokenResolver],
  exports: [TokenService],
})
export class TokenModule {}
