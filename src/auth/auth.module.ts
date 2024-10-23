import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { OtpModule } from 'src/otp/otp.module';
import { UserRepository } from 'src/user/user.repository';
import { MailModule } from 'src/mail/mail.module';
import { Http } from 'src/util/http';
import { MailRepository } from 'src/mail/mail.repository';
import { OtpRepository } from 'src/otp/otp.repository';
import { TokenService } from '@/token/token.service';
import { AuthController } from './auth.controller';
import { GoogleStrategy } from './strategies/google.strategy';

@Module({
  imports: [
    ConfigModule,
    UserModule,
    OtpModule,
    MailModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
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
  ],
  providers: [
    AuthResolver,
    AuthService,
    UserRepository,
    JwtStrategy,
    GoogleStrategy,
    LocalStrategy,
    TokenService,
    Http,
    MailRepository,
    OtpRepository,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
