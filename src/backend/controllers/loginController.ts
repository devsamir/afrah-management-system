import { remote } from "electron";
const { getManager } = remote.require("typeorm");
import validator from "validator";
import bcrypt from "bcryptjs";

export const login = async (username, password) => {
  const manager = getManager();
  if (validator.isEmpty(username, { ignore_whitespace: true }))
    throw new Error("Username atau Password Salah !");
  if (validator.isEmpty(password, { ignore_whitespace: true }))
    throw new Error("Username atau Password Salah !");
  const [user] = await manager.query(
    "select * from user where username = ? and active = true",
    [username]
  );
  if (!user) throw new Error("Username atau Password Salah !");
  const cekPass = await bcrypt.compare(password, user.password);
  if (!cekPass) throw new Error("Username atau Password Salah !");
  return true;
};
