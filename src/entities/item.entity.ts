import { Column, Entity, ObjectID, ObjectIdColumn } from "typeorm";

@Entity('item')
export class Item {
  @ObjectIdColumn()
  _id: ObjectID;

  id: string

  @Column()
  name: string;

  @ObjectIdColumn()
  owner: ObjectID;
}