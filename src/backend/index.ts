import { remote } from "electron";
const { createConnection } = remote.require("typeorm");
import "reflect-metadata";

const main = async (): Promise<void> => {
  try {
    await createConnection({
      type: "mysql",
      host: "localhost",
      username: "root",
      password: "",
      database: "db_afrah",
      synchronize: true,
      logging: true,
      entities: [],
    });
    console.log("database connected");
  } catch (err) {
    console.log(err);
  }
};
main();
