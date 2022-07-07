import "reflect-metadata";
import { DataSource } from "typeorm";
import { Attribute } from "./entity/attribute";
import { Product } from "./entity/product";
import { NumberValue, StringValue } from "./entity/value";

export const dataSource = new DataSource({
  type: "mysql",
  host: "52.221.157.124",
  port: 3306,
  username: "root",
  password: "secret",
  database: "tkpm",
  synchronize: true,
  logging: false,
  entities: [Attribute, StringValue, NumberValue, Product],
  migrations: [],
  subscribers: [],
});

const attributeRep = dataSource.getRepository(Attribute);
const productRep = dataSource.getRepository(Product);
const stringRep = dataSource.getRepository(StringValue);
const numberRep = dataSource.getRepository(NumberValue);
