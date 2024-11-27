import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { ContactService } from './contact.service';
import { CreateContactInput } from '@/contact/inputs/contact.input';
import { Contact } from '@/contact/contact.entity';

@Resolver()
export class ContactResolver {
  constructor(private readonly contactService: ContactService) {}

  @Mutation(() => Contact)
  // @UseGuards(new GraphqlPassportAuthGuard())
  async createBusinessQueryContact(
    @Args('input') input: CreateContactInput,
  ): Promise<Contact> {
    return this.contactService.createBusinessQueryContactService(input);
  }

  // @Mutation(() => Event)
  // @UseGuards(new GraphqlPassportAuthGuard('User'))
  // async createEventWithSubEvents(
  //   @Args('input') input: CreateEventWithSubEventsInput,
  //   @CurrentUser() user: User,
  // ): Promise<Event> {
  //   return this.eventService.createEventWithSubEvents(input, user);
  // }
}
