import { registerEnumType } from '@nestjs/graphql';
export enum Gender {
  male = 'Male',
  female = 'Female',
  other = 'Other',
  not_specified = 'NotSpecified',
}
registerEnumType(Gender, {
  name: 'Gender', // this one is mandatory
  description: 'The gender of the students or users', // this one is optional
});
