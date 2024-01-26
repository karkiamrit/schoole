import { registerEnumType } from '@nestjs/graphql';
export enum Role {
  Admin = 'Admin',
  user = 'User',
}
registerEnumType(Role, {
  name: 'Role', // this one is mandatory
  description: 'The basic roles of users', // this one is optional
});
