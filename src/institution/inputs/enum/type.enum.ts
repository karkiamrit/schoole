import { registerEnumType } from '@nestjs/graphql';

export enum Type {
  school = 'school',
  college = 'college',
  university = 'university',
}

registerEnumType(Type, { name: 'type' });
