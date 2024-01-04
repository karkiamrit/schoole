import { registerEnumType } from '@nestjs/graphql';

export enum Type {
  school = 'School',
  college = 'College',
  university = 'University',
}

registerEnumType(Type, { name: 'type' });
