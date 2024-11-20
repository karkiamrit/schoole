import { registerEnumType } from '@nestjs/graphql';

export enum ContactType {
  BUSINESS_QUERY = 'BUSINESS_QUERY',
  GENERAL_CONTACT = 'GENERAL_CONTACT',
}
registerEnumType(ContactType, {
  name: 'ContactType',
  description: 'Different type of contact classification',
});
