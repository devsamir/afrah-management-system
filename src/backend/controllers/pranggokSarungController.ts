import { remote } from "electron";
const { getManager } = remote.require("typeorm");
import validator from "validator";

export const createPranggokSarung = async (
  namaPranggok,
  noTelp,
  noKtp,
  keterangan
) => {
  const manager = getManager();
  if (validator.isEmpty(namaPranggok))
    throw new Error("Nama Pranggok Tidak Boleh Kosong");
  await manager.query(
    "insert into pranggok_sarung(namaPranggok,noTelp,noKtp,keterangan) values(?,?,?,?)",
    [namaPranggok, noTelp, noKtp, keterangan]
  );
  return true;
};
export const getAllPranggok = async (page, limit, sort, search) => {
  const manager = getManager();
  let query = "";
  let queryCount = "";
  if (search) {
    const fields = ["namaPranggok", "noTelp", "noKtp"];
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
    `select * from pranggok_sarung where active=true ${query}`
  );
  const [{ result }] = await manager.query(
    `select count(*) as result from pranggok_sarung where active=true ${queryCount}`
  );
  const data = res.map((item) => ({
    ...item,
    keterangan: item.keterangan.split(" ").splice(0, 15).join(" "),
  }));
  return { data, result };
};

export const getOnePranggok = async (id) => {
  const manager = getManager();
  const data = await manager.query(
    "select * from pranggok_sarung where id=? and active=true",
    [id]
  );
  if (data.length === 0)
    throw new Error("Pranggok dengan ID yang diberikan tidak ditemukan");
  return data[0];
};

export const updatePranggokSarung = async (
  id,
  namaPranggok,
  noTelp,
  noKtp,
  keterangan
) => {
  const manager = getManager();
  if (validator.isEmpty(namaPranggok))
    throw new Error("Nama Pranggok Tidak Boleh Kosong");
  await manager.query(
    "update pranggok_sarung set namaPranggok = ?,noTelp=?,noKtp=?,keterangan=? where id = ?",
    [namaPranggok, noTelp, noKtp, keterangan, id]
  );
  return true;
};

export const deletePranggokSarung = async (id) => {
  const manager = getManager();
  await manager.query("update pranggok_sarung set active=false where id=?", [
    id,
  ]);
  return true;
};
