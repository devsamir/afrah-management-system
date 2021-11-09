import { remote } from "electron";
const { getManager } = remote.require("typeorm");
import validator from "validator";

export const createPenjahitSarung = async (
  namaPenjahit,
  noTelp,
  noKtp,
  keterangan
) => {
  const manager = getManager();
  if (validator.isEmpty(namaPenjahit))
    throw new Error("Nama Penjahit Tidak Boleh Kosong");
  await manager.query(
    "insert into penjahit_sarung(namaPenjahit,noTelp,noKtp,keterangan) values(?,?,?,?)",
    [namaPenjahit, noTelp, noKtp, keterangan]
  );
  return true;
};
export const getAllPenjahit = async (page, limit, sort, search) => {
  const manager = getManager();
  let query = "";
  let queryCount = "";
  if (search) {
    const fields = ["namaPenjahit", "noTelp", "noKtp"];
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
  const res = await manager.query(
    `select * from penjahit_sarung where active=true ${query}`
  );
  const [{ result }] = await manager.query(
    `select count(*) as result from penjahit_sarung where active=true ${queryCount}`
  );
  const data = res.map((item) => ({
    ...item,
    keterangan: item.keterangan.split(" ").splice(0, 15).join(" "),
  }));
  return { data, result };
};

export const getOnePenjahit = async (id) => {
  const manager = getManager();
  const data = await manager.query(
    "select * from penjahit_sarung where id=? and active=true",
    [id]
  );
  if (data.length === 0)
    throw new Error("Penjahit dengan ID yang diberikan tidak ditemukan");
  return data[0];
};

export const updatePenjahitSarung = async (
  id,
  namaPenjahit,
  noTelp,
  noKtp,
  keterangan
) => {
  const manager = getManager();
  if (validator.isEmpty(namaPenjahit))
    throw new Error("Nama Penjahit Tidak Boleh Kosong");
  await manager.query(
    "update penjahit_sarung set namaPenjahit = ?,noTelp=?,noKtp=?,keterangan=? where id = ?",
    [namaPenjahit, noTelp, noKtp, keterangan, id]
  );
  return true;
};

export const deletePenjahitSarung = async (id) => {
  const manager = getManager();
  await manager.query("update penjahit_sarung set active=false where id=?", [
    id,
  ]);
  return true;
};
