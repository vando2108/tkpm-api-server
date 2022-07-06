import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Attribute {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  productId: string;

  @Column()
  name: string;

  constructor(productId: string, name: string) {
    this.productId = productId;
    this.name = name;
  }
}
