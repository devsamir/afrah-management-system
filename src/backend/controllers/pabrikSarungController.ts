import { remote } from "electron";
const { getManager } = remote.require("typeorm");
import validator from "validator";
export const createPabrikSarung = async (namaPabrik, noTelp, keterangan) => {
  const manager = getManager();
  if (validator.isEmpty(namaPabrik))
    throw new Error("Nama Pabrik Tidak Boleh Kosong");
  await manager.query(
    "insert into pabrik_sarung(namaPabrik,noTelp,keterangan) values(?,?,?)",
    [namaPabrik, noTelp, keterangan]
  );
  return true;
};
export const getAllPabrik = async (page, limit, sort, search) => {
  const manager = getManager();
  let query = "";
  let queryCount = "";
  if (search) {
    const fields = ["namaPabrik", "noTelp"];
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
    `select * from pabrik_sarung where active=true ${query}`
  );
  const [{ result }] = await manager.query(
    `select count(*) as result from pabrik_sarung where active=true ${queryCount}`
  );
  const data = res.map((item) => ({
    ...item,
    keterangan: item.keterangan.split(" ").splice(0, 15).join(" "),
  }));
  return { data, result };
};
export const getOnePabrik = async (id) => {
  const manager = getManager();
  const data = await manager.query(
    "select * from pabrik_sarung where id=? and active=true",
    [id]
  );
  if (data.length === 0)
    throw new Error("Pabrik dengan ID yang diberikan tidak ditemukan");
  return data[0];
};
export const updatePabrikSarung = async (
  id,
  namaPabrik,
  noTelp,
  keterangan
) => {
  const manager = getManager();
  if (validator.isEmpty(namaPabrik))
    throw new Error("Nama Pabrik Tidak Boleh Kosong");
  await manager.query(
    "update pabrik_sarung set namaPabrik=?,noTelp=?,keterangan=? where id = ?",
    [namaPabrik, noTelp, keterangan, id]
  );
  return true;
};
export const deletePabrikSarung = async (id) => {
  const manager = getManager();
  await manager.query("update pabrik_sarung set active=false where id=?", [id]);
  return true;
};
