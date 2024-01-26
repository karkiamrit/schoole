import { registerEnumType } from '@nestjs/graphql';
export enum UserType {
  student = 'Student',
  institution = 'Institution',
}
registerEnumType(UserType, {
  name: 'UserType', // this one is mandatory
  description: 'Types of user currently we have ', // this one is optional
});
