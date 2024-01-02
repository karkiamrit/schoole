import { registerEnumType } from '@nestjs/graphql';
export enum Gender {
  male = 'Male',
  female = 'Female',
  other = 'Other',
  not_specified = 'NotSpecified',
}

export enum Level {
  pre_primary = 'Pre Primary',
  primary = 'Primary',
  secondary = 'Secondary',
  higher_secondary = 'Higher Secondary',
  high_school = 'High School',
  under_graduate = 'Under Graduate',
}

registerEnumType(Level, {
  name: 'Level',
  description: 'The level of education of students',
});

registerEnumType(Gender, {
  name: 'Gender', // this one is mandatory
  description: 'The gender of the students or users', // this one is optional
});
