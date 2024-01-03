import { registerEnumType } from '@nestjs/graphql';
export enum OrganizerType {
  club = 'Club',
}
registerEnumType(OrganizerType, {
  name: 'OrganizerType',
  description: 'The basic organizer type of organizer user',
});
