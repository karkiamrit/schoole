import { Module } from '@nestjs/common';
import { SocialService } from './social.service';
import { SocialResolver } from './social.resolver';
import { TypeOrmExModule } from '@/modules/decorators/typeorm.module';
import { SocialRepository } from '@/social/social.repository';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([SocialRepository])],
  providers: [SocialResolver, SocialService],
  exports: [SocialService],
})
export class SocialModule {}
