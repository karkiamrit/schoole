import { MenuModule } from './menu/menu.module';
import { TokenModule } from './token/token.module';
import { ParticipantModule } from './participant/participant.module';
import { EventModule } from './event/event.module';
import { AddressModule } from './address/address.module';
import { CertificateModule } from './certificate/certificate.module';
import { KycModule } from './kyc/kyc.module';
import { VolunteerModule } from './volunteer/volunteer.module';
import { OrganizerModule } from './organizer/organizer.module';
import { InstitutionModule } from './institution/institution.module';
import { StudentModule } from './student/student.module';
import { MailModule } from './mail/mail.module';
import { OtpModule } from './otp/otp.module';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { DeclareModule } from './declare/declare.module';
import { getEnvPath } from './modules/helper/env.helper';
import { CronModule } from './cron/cron.module';
import { ScheduleModule } from '@nestjs/schedule';
import { SharedModule } from './modules/shared/shared.module';
import { SettingService } from './modules/shared/services/setting.service';
import { HealthModule } from './health/health.module';
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { SubEventModule } from './subevent/subEvent.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: getEnvPath(`${__dirname}/..`),
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'), // Path to your uploads directory
      serveRoot: '/uploads', // The route to serve the files
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [SharedModule],
      inject: [SettingService],
      useFactory: (settingService: SettingService) => {
        const config = settingService.graphqlUseFactory;
        config.context = ({ req, res }) => ({ req, res }); // Pass the request and response objects to the context
        return config;
      },
    }),
    TypeOrmModule.forRootAsync({
      imports: [SharedModule],
      inject: [SettingService],
      useFactory: (settingService: SettingService) =>
        settingService.typeOrmUseFactory,
    }),
    ScheduleModule.forRoot(),
    UserModule,
    AuthModule,
    DeclareModule,
    CronModule,
    HealthModule,
    StudentModule,
    InstitutionModule,
    OrganizerModule,
    VolunteerModule,
    KycModule,
    CertificateModule,
    AddressModule,
    EventModule,
    SubEventModule,
    TokenModule,
    MenuModule,
    ParticipantModule,
    OtpModule,
    MailModule,
  ],
})
export class AppModule {}
