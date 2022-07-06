import Yargs from "yargs";
import { Server } from ".";

export const main = async () => {
  Yargs.command(
    "run <mode>",
    "run",
    () => {},
    async (argv) => {
      const server = new Server(argv.mode as number);

      await server.start();
    }
  ).parse();
};

main();
