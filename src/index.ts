import { dataSource } from "./data-source";
import express, { Express } from "express";
import dotenv from "dotenv";
import { Product } from "./entity/product";
import { Attribute } from "./entity/attribute";
import { NumberValue, StringValue } from "./entity/value";
import * as model from "./model";
import mongoose from "mongoose";

dotenv.config();

function create_UUID() {
  var dt = new Date().getTime();
  var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
    /[xy]/g,
    function (c) {
      var r = (dt + Math.random() * 16) % 16 | 0;
      dt = Math.floor(dt / 16);
      return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
    }
  );
  return uuid;
}

export class Server {
  app: Express;
  product: mongoose.Model<model.Product>;
  attribute: mongoose.Model<model.Attribute>;
  attributeSet: mongoose.Model<model.AttributeSet>;
  stringValue: mongoose.Model<model.StringValue>;
  numberValue: mongoose.Model<model.NumberValue>;
  mode: number;

  constructor(mode: number) {
    this.app = express();
    this.app.use(express.json());
    this.mode = mode;

    const uri =
      "mongodb://root:secret@52.221.157.124:27017/?readPreference=primary&directConnection=true&ssl=false&authMechanism=DEFAULT";

    const second_uri =
      "mongodb+srv://admin:admin@cluster0.8kbpqdv.mongodb.net/?retryWrites=true&w=majority";
    mongoose
      .connect(this.mode ? uri : second_uri)
      .then(() => console.log("Connect to mongo successfully"));

    this.product = mongoose.model("product", model.ProductSchema);
    this.attribute = mongoose.model("prod_att", model.AttributeSchema);
    this.attributeSet = mongoose.model(
      "attribute_set",
      model.AttributeSetSchema
    );
    this.stringValue = mongoose.model("string_value", model.StringValueSchema);
    this.numberValue = mongoose.model("number_value", model.NumberValueSchema);
  }

  async start() {
    await dataSource.initialize();

    const attributeRep = dataSource.getRepository(Attribute);
    const productRep = dataSource.getRepository(Product);
    const stringRep = dataSource.getRepository(StringValue);
    const numberRep = dataSource.getRepository(NumberValue);

    this.app.post("/mongo-create", async (req, res) => {
      const { name, desc, price, attributes } = req.body;

      try {
        const product = await this.product.create({
          id: create_UUID(),
          name,
          desc,
          price,
        });

        if (attributes) {
          attributes.forEach(
            async (item: {
              name: string;
              type: string;
              value: number | string;
            }) => {
              const attribute = await this.attributeSet.create({
                id: create_UUID(),
                productId: product.id,
                name: item.name,
              });

              switch (item.type) {
                case "string": {
                  await this.stringValue.create({
                    attributeId: attribute.id,
                    value: item.value,
                  });
                  break;
                }

                case "number": {
                  await this.numberValue.create({
                    attributeId: attribute.id,
                    value: item.value,
                  });
                  break;
                }
              }
            }
          );
        }
        res.send(product.id);
      } catch (error) {
        console.log(error);
        res.send();
      }
    });

    this.app.post("/create", async (req, res) => {
      const { name, desc, price, attributes } = req.body;

      const product = new Product(name, desc, price);
      try {
        await productRep.save(product);

        if (attributes) {
          attributes.forEach(
            async (item: { name: string; type: string; value: any }) => {
              const attribute = new Attribute(product.id, item.name);
              await attributeRep.save(attribute);

              switch (item.type) {
                case "string": {
                  const value = new StringValue(attribute.id, item.value);
                  await stringRep.save(value);
                  break;
                }

                case "number": {
                  const value = new NumberValue(attribute.id, item.value);
                  await numberRep.save(value);
                  break;
                }
              }
            }
          );
        }

        res.send(product.id);
      } catch (error) {
        console.log(error);
        res.status(400);
        res.send();
        return;
      }
    });

    this.app.get("/read", async (req, res) => {
      try {
        let product: any;
        if (req.query.productId != "undefined")
          product = await this.product.findOne({ id: req.query.productId });
        else product = await this.product.findOne();
        if (!product) {
          return res.send("Can't find product");
        }

        const productAttrbutes = await this.attribute.find({
          productId: product.id,
        });

        res.send();
      } catch (error) {
        console.log(error);
        res.status(400);
        res.send();
      }
    });

    this.app.listen(process.env.PORT || 8080, () => {
      console.log(`Server is running in port ${process.env.PORT || 4000}`);
    });
  }
}
