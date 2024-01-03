import { registerEnumType } from '@nestjs/graphql';

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
