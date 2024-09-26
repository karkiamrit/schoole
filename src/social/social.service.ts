import { Injectable } from '@nestjs/common';
import { SocialRepository } from '@/social/social.repository';
import { Social } from '@/social/entity/social.entity';
import { UpdateSocialInput } from '@/social/inputs/social.input';
import { UpdateResult } from 'typeorm';
import { User } from "@/user/entities/user.entity";

@Injectable()
export class SocialService {
  constructor(private readonly socialRepository: SocialRepository) {}

  async updateSpecificSocialInformation(
    user: User,
    input: UpdateSocialInput,
  ): Promise<UpdateResult | Social> {
    const social = await this.socialRepository.findOne({
      where: {
        user: {
          id: user.id,
        },
        social_type: input.social_type,
      },
    });
    if (social) {
      return await this.socialRepository.update(social.id, input);
    }
    return await this.socialRepository.save({ user: user, ...input });
  }

  async bulkDeleteSocialInformationByTypes(social_types: string[]) {
    try {
      const socials = await this.socialRepository.getMany(
        {
          where: {
            social_type: { $nIn: social_types },
          },
        },
        '{ id social_type }',
      );
      if (socials.count > 0) {
        for (const social of socials.data) {
          await this.socialRepository.delete({ id: social.id });
        }
        return true;
      }
    } catch (error) {
      throw new Error('Failed to delete social information');
    }
  }
}
