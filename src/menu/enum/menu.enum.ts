import { registerEnumType } from '@nestjs/graphql';
export enum MenuFor {
  student = 'Student',
  institution = 'Institution',
  all = 'All',
}
registerEnumType(MenuFor, {
  name: 'MenuFor', // this one is mandatory
  description: 'Determine for whom the menu is primarily for. ', // this one is optional
});
