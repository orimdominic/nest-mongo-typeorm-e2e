import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';

@Entity('user')
export class User {
  @Column()
  id: string;

  @ObjectIdColumn()
  _id?: string;

  @Column()
  name: string;

  @Column()
  email: string;
}
