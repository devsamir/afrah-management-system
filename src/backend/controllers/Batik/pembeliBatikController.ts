import { remote } from "electron";
const { getManager } = remote.require("typeorm");
import validator from "validator";

export const createPembeliBatik = async (
  namaPembeli,
  noTelp,
  noKtp,
  keterangan
) => {
  const manager = getManager();
  if (validator.isEmpty(namaPembeli))
    throw new Error("Nama Pembeli Tidak Boleh Kosong");
  await manager.query(
    "insert into pembeli_batik(namaPembeli,noTelp,noKtp,keterangan) values(?,?,?,?)",
    [namaPembeli, noTelp, noKtp, keterangan]
  );
  return true;
};
export const getAllPembeli = async (page, limit, sort, search) => {
  const manager = getManager();
  let query = "";
  let queryCount = "";
  if (search) {
    const fields = ["namaPembeli", "noTelp", "noKtp"];
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
    `select * from pembeli_batik where active=true ${query}`
  );
  const [{ result }] = await manager.query(
    `select count(*) as result from pembeli_batik where active=true ${queryCount}`
  );
  const data = res.map((item) => ({
    ...item,
    keterangan: item.keterangan.split(" ").splice(0, 15).join(" "),
  }));
  return { data, result };
};

export const getOnePembeli = async (id) => {
  const manager = getManager();
  const data = await manager.query(
    "select * from pembeli_batik where id=? and active=true",
    [id]
  );
  if (data.length === 0)
    throw new Error("Pembeli Batik dengan ID yang diberikan tidak ditemukan");
  return data[0];
};

export const updatePembeliBatik = async (
  id,
  namaPembeli,
  noTelp,
  noKtp,
  keterangan
) => {
  const manager = getManager();
  if (validator.isEmpty(namaPembeli))
    throw new Error("Nama Pembeli Tidak Boleh Kosong");
  await manager.query(
    "update pembeli_batik set namaPembeli = ?,noTelp=?,noKtp=?,keterangan=? where id = ?",
    [namaPembeli, noTelp, noKtp, keterangan, id]
  );
  return true;
};

export const deletePembeliBatik = async (id) => {
  const manager = getManager();
  await manager.query("update pembeli_batik set active=false where id=?", [id]);
  return true;
};
