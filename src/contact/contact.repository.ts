import { CustomRepository } from '@/modules/decorators/typeorm.decorator';
import { Repository } from 'typeorm/repository/Repository';
import { Contact } from '@/contact/contact.entity';

@CustomRepository(Contact)
export class ContactRepository extends Repository<Contact> {}
