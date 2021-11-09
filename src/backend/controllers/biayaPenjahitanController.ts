import { remote } from "electron";
const { getManager } = remote.require("typeorm");
import validator from "validator";
import { format } from "date-fns";

export const getAllBiayaPenjahitan = async (
  penjahit,
  page,
  limit,
  sort,
  search,
  rentang,
  tanggalAwal,
  tanggalAkhir,
  status
) => {
  const manager = getManager();
  let query = "";
  let queryCount = "";
  if (penjahit !== "semua") {
    query += ` and p.id = ${penjahit}`;
    queryCount += ` and p.id = ${penjahit}`;
  }
  if (status !== "semua") {
    if (status === "lunas") {
      query += ` and b.sisaTagihan = 0`;
      queryCount += ` and b.sisaTagihan = 0`;
    }
    if (status === "belum") {
      query += ` and b.sisaTagihan != 0`;
      queryCount += ` and b.sisaTagihan != 0`;
    }
  }
  if (search) {
    const fields = ["b.tanggal"];
    const searchQuery = fields
      .map((item) => `${item} like '%${search}%'`)
      .join(" or ");
    query += ` and (${searchQuery})`;
    queryCount += ` and (${searchQuery})`;
  }

  if (tanggalAwal && tanggalAkhir && rentang) {
    query += ` and b.tanggal between '${tanggalAwal}' and '${tanggalAkhir}'`;
    queryCount += ` and b.tanggal between '${tanggalAwal}' and '${tanggalAkhir}'`;
  }
  if (sort?.field && sort?.direction) {
    query += ` order by ${sort.field} ${sort.direction}`;
  }
  if (page && limit) {
    const take = page * limit;
    const skip = (page - 1) * limit;
    query += ` limit ${take} offset ${skip}`;
  }
  const res = await manager.query(
    `select b.*,p.namaPenjahit from penjahit_sarung p,biaya_penjahitan b where p.id = b.idPenjahit ${query}`
  );
  const [{ result }] = await manager.query(
    `select count(b.id) as result from penjahit_sarung p,biaya_penjahitan b where p.id = b.idPenjahit ${queryCount}`
  );
  const data = res.map((item) => ({
    ...item,
    tanggal: format(item.tanggal, "yyyy-MM-dd"),
    keterangan: item.keterangan.split(" ").splice(0, 15).join(" "),
  }));
  return { data, result };
};
export const createBiayaPenjahitan = async (
  tanggal,
  jumlahSarung,
  harga,
  keterangan,
  idPenjahit
) => {
  const manager = getManager();
  const cekPenjahit = await manager.query(
    "select * from penjahit_sarung where id=? and active=true",
    [idPenjahit]
  );
  if (cekPenjahit.length === 0) throw new Error("Penjahit Yang Dipilih Salah");
  if (
    validator.isEmpty(tanggal, { ignore_whitespace: true }) &&
    !validator.isDate(tanggal)
  )
    throw new Error("Tanggal Harus Diisi");
  if (validator.isEmpty(jumlahSarung, { ignore_whitespace: true }))
    throw new Error("Jumlah Sarung Harus Diisi");
  if (validator.isEmpty(harga, { ignore_whitespace: true }))
    throw new Error("Harga Sarung Harus Diisi");

  const total = Number(jumlahSarung) * Number(harga);
  await manager.query(
    "insert into biaya_penjahitan(tanggal,jumlahSarung,harga,total,sisaTagihan,keterangan,idPenjahit) values(?,?,?,?,?,?,?)",
    [
      tanggal,
      Number(jumlahSarung),
      Number(harga),
      total,
      total,
      keterangan,
      idPenjahit,
    ]
  );
  return true;
};
export const getAllPenjahit = async (pembelian: boolean) => {
  const manager = getManager();
  if (pembelian) {
    const data = await manager.query(
      "select id,namaPenjahit from penjahit_sarung where active=true and id in (select distinct(idPenjahit) from biaya_penjahitan)"
    );
    return data;
  } else {
    const data = await manager.query(
      "select id,namaPenjahit from penjahit_sarung where active=true"
    );
    return data;
  }
};
export const getRekapBiayaPenjahitan = async (
  penjahit,
  rentang,
  tanggalAwal,
  tanggalAkhir,
  status
) => {
  const manager = getManager();
  let query = "";
  if (penjahit !== "semua") {
    query += ` and idPenjahit = ${penjahit}`;
  }
  if (status !== "semua") {
    if (status === "lunas") {
      query += ` and sisaTagihan = 0`;
    }
    if (status === "belum") {
      query += ` and sisaTagihan != 0`;
    }
  }
  if (tanggalAwal && tanggalAkhir && rentang) {
    query += ` and tanggal between '${tanggalAwal}' and '${tanggalAkhir}'`;
  }
  const [{ transaksi }] = await manager.query(
    `select count(*) as transaksi from biaya_penjahitan where 1 ${query}`
  );
  const [{ total }] = await manager.query(
    `select sum(total) as total from biaya_penjahitan where 1 ${query}`
  );
  const [{ piutang }] = await manager.query(
    `select sum(sisaTagihan) as piutang from biaya_penjahitan where 1 ${query}`
  );
  const [{ terbayar }] = await manager.query(
    `select sum(total) - sum(sisaTagihan) as terbayar from biaya_penjahitan where 1 ${query}`
  );
  return { transaksi, total, piutang, terbayar };
};
export const getOneBiayaPenjahitan = async (id) => {
  const manager = getManager();
  const [penjahitan] = await manager.query(
    "select b.*,p.namaPenjahit,p.noTelp,p.noKtp from biaya_penjahitan b,penjahit_sarung p where b.idPenjahit = p.id and b.id= ?",
    [id]
  );
  if (!penjahitan) throw new Error("Biaya Penjahitan Tidak Ditemukan");
  penjahitan.tanggal = format(penjahitan.tanggal, "yyyy-MM-dd");
  return penjahitan;
};
export const updateBiayaPenjahitan = async (
  id,
  tanggal,
  jumlahSarung,
  harga,
  keterangan,
  idPenjahit
) => {
  const manager = getManager();
  const cekPenjahit = await manager.query(
    "select * from penjahit_sarung where id=? and active=true",
    [idPenjahit]
  );
  if (cekPenjahit.length === 0) throw new Error("Penjahit Yang Dipilih Salah");
  if (
    validator.isEmpty(tanggal, { ignore_whitespace: true }) &&
    !validator.isDate(tanggal)
  )
    throw new Error("Tanggal Harus Diisi");
  if (validator.isEmpty(jumlahSarung, { ignore_whitespace: true }))
    throw new Error("Jumlah Sarung Harus Diisi");
  if (validator.isEmpty(harga, { ignore_whitespace: true }))
    throw new Error("Harga Sarung Harus Diisi");

  const total = Number(jumlahSarung) * Number(harga);
  await manager.query(
    "update biaya_penjahitan set tanggal=?,jumlahSarung=?,harga=?,total=?,sisaTagihan=?,keterangan=?,idPenjahit=? where id=?",
    [
      tanggal,
      Number(jumlahSarung),
      Number(harga),
      total,
      total,
      keterangan,
      idPenjahit,
      id,
    ]
  );
  await manager.query("delete from piutang_penjahitan where idPenjahitan = ?", [
    id,
  ]);
  return true;
};
export const deleteBiayaPenjahitan = async (id) => {
  const manager = getManager();
  await manager.query("delete from biaya_penjahitan where id = ?", [id]);
  await manager.query("delete from piutang_penjahitan where idPenjahitan = ?", [
    id,
  ]);
  return true;
};

export const getDetailBiayaPenjahitan = async (id) => {
  const manager = getManager();
  const [penjahitan] = await manager.query(
    "select b.*,p.namaPenjahit,p.noTelp,p.noKtp from biaya_penjahitan b,penjahit_sarung p where b.idPenjahit = p.id and b.id= ?",
    [id]
  );

  if (!penjahitan) throw new Error("Biaya Penjahitan Tidak Ditemukan");
  penjahitan.tanggal = format(penjahitan.tanggal, "yyyy-MM-dd");
  const piutang = await manager.query(
    "select * from piutang_penjahitan where idPenjahitan = ?",
    [id]
  );
  const piutangFinal = piutang.map((item) => ({
    ...item,
    tanggal: format(item.tanggal, "yyyy-MM-dd"),
    keterangan: item.keterangan.split(" ").splice(0, 15).join(" "),
  }));
  return { penjahitan, piutang: piutangFinal };
};

export const createBayarPiutang = async (
  tanggal,
  pembayaran,
  keterangan,
  idPenjahitan
) => {
  const manager = getManager();
  if (
    validator.isEmpty(tanggal, { ignore_whitespace: true }) &&
    !validator.isDate(tanggal)
  )
    throw new Error("Tanggal Harus Diisi");
  if (validator.isEmpty(pembayaran, { ignore_whitespace: true }))
    throw new Error("Nominal Pembayaran Harus Diisi");
  const [penjahitan] = await manager.query(
    "select * from biaya_penjahitan where id=?",
    [idPenjahitan]
  );
  if (!penjahitan)
    throw new Error("Piutang Dengan ID yang diberikan Tidak Ditemukan");
  await manager.query(
    "insert into piutang_penjahitan(tanggal,pembayaran,keterangan,idPenjahitan) values(?,?,?,?)",
    [tanggal, Number(pembayaran), keterangan, idPenjahitan]
  );
  await manager.query(
    "update biaya_penjahitan set sisaTagihan = sisaTagihan - ? where id = ?",
    [Number(pembayaran), idPenjahitan]
  );
  return true;
};
export const updateBayarPiutang = async (
  id,
  tanggal,
  pembayaran,
  keterangan,
  idPenjahitan
) => {
  const manager = getManager();
  const [piutang] = await manager.query(
    "select * from piutang_penjahitan where id = ?",
    [id]
  );
  if (!piutang)
    throw new Error("Piutang Dengan ID Yang Diberikan Tidak Ditemukan");
  if (
    validator.isEmpty(tanggal, { ignore_whitespace: true }) &&
    !validator.isDate(tanggal)
  )
    throw new Error("Tanggal Harus Diisi");
  if (validator.isEmpty(pembayaran, { ignore_whitespace: true }))
    throw new Error("Nominal Pembayaran Harus Diisi");
  const [penjahitan] = await manager.query(
    "select * from biaya_penjahitan where id=?",
    [idPenjahitan]
  );
  if (!penjahitan)
    throw new Error("Piutang Dengan ID yang diberikan Tidak Ditemukan");
  await manager.query(
    "update piutang_penjahitan set tanggal = ?,pembayaran=?,keterangan=?,idPenjahitan=? where id = ?",
    [tanggal, Number(pembayaran), keterangan, idPenjahitan, id]
  );
  await manager.query(
    "update biaya_penjahitan set sisaTagihan = sisaTagihan - ? + ? where id = ?",
    [Number(pembayaran), piutang.pembayaran, idPenjahitan]
  );
  return true;
};
export const deletePiutang = async (id) => {
  const manager = getManager();
  const [piutang] = await manager.query(
    "select * from piutang_penjahitan where id = ?",
    [id]
  );
  if (!piutang)
    throw new Error("Piutang Dengan ID Yang Diberikan Tidak Ditemukan");
  await manager.query("delete from piutang_penjahitan where id = ?", [id]);
  await manager.query(
    "update biaya_penjahitan set sisaTagihan = sisaTagihan + ? where id = ?",
    [piutang.pembayaran, piutang.idPenjahitan]
  );
  return true;
};
