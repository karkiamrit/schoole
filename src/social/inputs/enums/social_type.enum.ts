import { registerEnumType } from '@nestjs/graphql';
export enum SocialType {
  facebook = 'Facebook',
  instagram = 'Instagram',
  twitter = 'Twitter',
  github = 'Github',
  linked_in = 'LinkedIn',
  website = 'Website',
}
registerEnumType(SocialType, {
  name: 'SocialType',
  description: 'Different type of social platform',
});
