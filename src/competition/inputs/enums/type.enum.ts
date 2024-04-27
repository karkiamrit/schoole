import { registerEnumType } from '@nestjs/graphql';
export enum SubEventType {
  competition = 'Competition',
  exhibition = 'Exhibition',
  other = 'Other',
}

registerEnumType(SubEventType, {
  name: 'SubEventType', // this one is mandatory
  description: 'The type of the subevent', // this one is optional
});
