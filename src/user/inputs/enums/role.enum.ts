import { registerEnumType } from '@nestjs/graphql';
export enum Role {
  admin = 'admin',
  user = 'user',
}
registerEnumType(Role, {
  name: 'Role', // this one is mandatory
  description: 'The basic roles of users', // this one is optional
});
