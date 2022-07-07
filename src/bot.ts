import * as axios from "axios";
import randomWord from "random-words";

function createRandomString(numberWords: number) {
  const words = randomWord(Math.random() * numberWords);
  var ret = "";
  words.forEach((word) => (ret = ret + `${word} `));
  ret = ret.slice(0, ret.length - 1);
  return ret;
}

class Bot {
  productId: string[];
  axiosInstace: axios.Axios;
  totalCreateTime: number;
  numberCreateErr: number;
  numberCreateSuccess: number;
  totalReadTime: number;
  numberReadErr: number;
  numberReadSuccess: number;
  numberReadPerSecond: number;
  numberCreatePerSecond: number;

  constructor(
    timeout: number,
    numberReadPerSecond: number,
    numberCreatePerSecond: number
  ) {
    this.productId = [];
    this.totalCreateTime = 0;
    this.numberCreateErr = 0;
    this.numberCreateSuccess = 0;
    this.totalReadTime = 0;
    this.numberReadErr = 0;
    this.numberReadSuccess = 0;
    this.numberReadPerSecond = numberReadPerSecond;
    this.numberCreatePerSecond = numberCreatePerSecond;

    //this.axiosInstace = axios.default.create({
    //  baseURL: "http://52.221.157.124:8765",
    //  timeout,
    //});
    this.axiosInstace = axios.default.create({
      baseURL: "http://localhost:8765",
      timeout,
    });
  }

  log() {
    console.table({
      averageReadTime: this.numberReadSuccess
        ? this.totalReadTime / this.numberReadSuccess
        : 0,
      numberReadErr: this.numberReadErr,
      numberReadSuccess: this.numberReadSuccess,
      averageCreateTime: this.numberCreateSuccess
        ? this.totalCreateTime / this.numberCreateSuccess
        : 0,
      numberCreateErr: this.numberCreateErr,
      numberCreateSuccess: this.numberCreateSuccess,
    });
  }

  async createProduct() {
    const numberAttributes = Math.floor(Math.random() * 2 + 1);
    const attributes = [];

    for (let i = 0; i < numberAttributes; i++) {
      const type =
        Math.floor(Math.random() * 100) % 2 == 0 ? "string" : "number";

      const attribute = {
        name: createRandomString(10),
        type,
        value:
          type == "string" ? createRandomString(10) : Math.random() * 10000,
      };

      attributes.push(attribute);
    }

    const data = {
      name: createRandomString(10),
      desc: createRandomString(10),
      price: Math.random() * 10000000,
      attributes,
    };

    try {
      const start = Date.now();
      console.log(data);
      const res = await this.axiosInstace.post("/mongo-create", data);
      const duration = Date.now() - start;

      if (res.status == 200) {
        this.numberCreateSuccess++;
        this.totalCreateTime += duration;
        this.productId.push(res.data);
      }
    } catch (error) {
      console.log(error);
      this.numberCreateErr++;
    }
  }

  async readProduct() {
    const productId =
      this.productId[Math.floor(Math.random() * this.productId.length)];

    try {
      const start = Date.now();
      const res = await this.axiosInstace.get(`/read?productId=${productId}`);
      const duration = Date.now() - start;

      if (res.status == 200) {
        this.numberReadSuccess++;
        this.totalReadTime += duration;
      }
    } catch (error) {
      console.log(error);
      this.numberReadErr++;
    }
  }

  async start() {
    const listPromise = [];
    for (let i = 0; i < this.numberReadPerSecond; i++) {
      listPromise.push(this.readProduct());
    }
    for (let i = 0; i < this.numberCreatePerSecond; i++) {
      listPromise.push(this.createProduct());
    }
    await Promise.all(listPromise);

    this.log();
  }
}

const bot = new Bot(100000, 10000, 5000);
bot.start();
