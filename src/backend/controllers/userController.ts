import { remote } from "electron";
const { getManager } = remote.require("typeorm");
import validator from "validator";
import bcrypt from "bcryptjs";

export const getAllUser = async (page, limit, sort, search) => {
  const manager = getManager();
  let query = "";
  let queryCount = "";
  if (search) {
    const fields = ["username"];
    const searchQuery = fields
      .map((item) => `${item} like '%${search}%'`)
      .join(" or ");
    query += ` and (${searchQuery})`;
    queryCount += ` and (${searchQuery})`;
  }
  if (sort?.field && sort?.direction) {
    query += ` order by ${sort.field} ${sort.direction} `;
  }
  if (page && limit) {
    const take = page * limit;
    const skip = (page - 1) * limit;
    query += ` limit ${take} offset ${skip}`;
  }
  const data = await manager.query(
    `select * from user where active=true ${query}`
  );
  const [{ result }] = await manager.query(
    `select count(*) as result from user where active=true ${queryCount}`
  );
  return { data, result };
};
export const getOneUser = async (id) => {
  const manager = getManager();
  const [user] = await manager.query(
    "select * from user where id = ? and active = true",
    [id]
  );
  if (!user) throw new Error("User Tidak Ditemukan");
  return user;
};

export const createUser = async (username, password, repassword) => {
  const manager = getManager();
  if (validator.isEmpty(username, { ignore_whitespace: true }))
    throw new Error("Username Tidak Boleh Kosong");
  if (validator.isEmpty(password, { ignore_whitespace: true }))
    throw new Error("Password Tidak Boleh Kosong");
  if (password !== repassword) throw new Error("Password Tidak Sesuai !");
  const newPassword = await bcrypt.hash(password, 10);
  await manager.query("insert into user(username,password) values(?,?)", [
    username,
    newPassword,
  ]);
  return true;
};

export const updateUser = async (
  id,
  username,
  oldPassword,
  password,
  repassword
) => {
  const manager = getManager();

  if (validator.isEmpty(username, { ignore_whitespace: true }))
    throw new Error("Username Tidak Boleh Kosong");
  const [cekUser] = await manager.query(
    "select * from user where id = ? and active = true",
    [id]
  );
  if (!cekUser) throw new Error("User Tidak Ditemukan");
  const cekPassword = await bcrypt.compare(oldPassword, cekUser.password);
  if (!cekPassword) throw new Error("Password Lama Tidak Sama");
  if (validator.isEmpty(password, { ignore_whitespace: true }))
    throw new Error("Password Tidak Boleh Kosong");
  if (password !== repassword) throw new Error("Password Tidak Sesuai !");
  const newPassword = await bcrypt.hash(password, 10);
  await manager.query("update user set username = ?, password = ? where id=?", [
    username,
    newPassword,
    id,
  ]);
  return true;
};

export const deleteUser = async (id) => {
  const manager = getManager();
  await manager.query("update user set active = false where id=?", [id]);
  return true;
};
