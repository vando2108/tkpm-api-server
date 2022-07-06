import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class BaseValue {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  attributeId: string;
}

@Entity()
export class StringValue extends BaseValue {
  @Column()
  value: string;

  constructor(attributeId: string, value: string) {
    super();
    this.attributeId = attributeId;
    this.value = value;
  }
}

@Entity()
export class NumberValue extends BaseValue {
  @Column()
  value: number;

  constructor(attributeId: string, value: number) {
    super();
    this.attributeId = attributeId;
    this.value = value;
  }
}
