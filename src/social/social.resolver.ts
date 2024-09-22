import { Resolver } from '@nestjs/graphql';
import { SocialService } from './social.service';

@Resolver()
export class SocialResolver {
  constructor(private readonly socialService: SocialService) {}
}
