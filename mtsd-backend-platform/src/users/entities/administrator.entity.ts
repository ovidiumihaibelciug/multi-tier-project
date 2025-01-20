import { ChildEntity, Entity } from 'typeorm';
import { User } from './user.entity';

@ChildEntity('ADMIN')
export class Administrator extends User {}
