import { registerEnumType } from '@nestjs/graphql';

export enum Level {
  pre_primary = 'PrePrimary',
  primary = 'Primary',
  secondary = 'Secondary',
  high_school = 'HighSchool',
  higher_secondary = 'HigherSecondary',
  under_graduate = 'UnderGraduate',
}

registerEnumType(Level, {
  name: 'Level',
  description: 'The level of education of students',
});
