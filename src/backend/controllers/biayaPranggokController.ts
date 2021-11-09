import { remote } from "electron";
const { getManager } = remote.require("typeorm");
import validator from "validator";
import { format } from "date-fns";

export const getAllBiayaPranggok = async (
  pranggok,
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
  if (pranggok !== "semua") {
    query += ` and p.id = ${pranggok}`;
    queryCount += ` and p.id = ${pranggok}`;
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
    `select b.*,p.namaPranggok from pranggok_sarung p,biaya_pranggok b where p.id = b.idPranggok ${query}`
  );
  const [{ result }] = await manager.query(
    `select count(b.id) as result from pranggok_sarung p,biaya_pranggok b where p.id = b.idPranggok ${queryCount}`
  );
  const data = res.map((item) => ({
    ...item,
    tanggal: format(item.tanggal, "yyyy-MM-dd"),
    keterangan: item.keterangan.split(" ").splice(0, 15).join(" "),
  }));
  return { data, result };
};
export const createBiayaPranggok = async (
  tanggal,
  jumlahSarung,
  harga,
  keterangan,
  idPranggok
) => {
  const manager = getManager();
  const cekPranggok = await manager.query(
    "select * from pranggok_sarung where id=? and active=true",
    [idPranggok]
  );
  if (cekPranggok.length === 0) throw new Error("Pranggok Yang Dipilih Salah");
  if (
    validator.isEmpty(tanggal, { ignore_whitespace: true }) &&
    !validator.isDate(tanggal)
  )
    throw new Error("Tanggal Harus Diisi");
  if (validator.isEmpty(jumlahSarung, { ignore_whitespace: true }))
    throw new Error("Jumlah Sarung Harus Diisi");
  if (validator.isEmpty(harga, { ignore_whitespace: true }))
    throw new Error("Harga Harus Diisi");

  const total = Number(jumlahSarung) * Number(harga);
  await manager.query(
    "insert into biaya_pranggok(tanggal,jumlahSarung,harga,total,sisaTagihan,keterangan,idPranggok) values(?,?,?,?,?,?,?)",
    [
      tanggal,
      Number(jumlahSarung),
      Number(harga),
      total,
      total,
      keterangan,
      idPranggok,
    ]
  );
  return true;
};
export const getAllPranggok = async (pranggok: boolean) => {
  const manager = getManager();
  if (pranggok) {
    const data = await manager.query(
      "select id,namaPranggok from pranggok_sarung where active=true and id in (select distinct(idPranggok) from biaya_pranggok)"
    );
    return data;
  } else {
    const data = await manager.query(
      "select id,namaPranggok from pranggok_sarung where active=true"
    );
    return data;
  }
};
export const getRekapBiayaPranggok = async (
  pranggok,
  rentang,
  tanggalAwal,
  tanggalAkhir,
  status
) => {
  const manager = getManager();
  let query = "";
  if (pranggok !== "semua") {
    query += ` and idPranggok = ${pranggok}`;
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
    `select count(*) as transaksi from biaya_pranggok where 1 ${query}`
  );
  const [{ total }] = await manager.query(
    `select sum(total) as total from biaya_pranggok where 1 ${query}`
  );
  const [{ piutang }] = await manager.query(
    `select sum(sisaTagihan) as piutang from biaya_pranggok where 1 ${query}`
  );
  const [{ terbayar }] = await manager.query(
    `select sum(total) - sum(sisaTagihan) as terbayar from biaya_pranggok where 1 ${query}`
  );
  return { transaksi, total, piutang, terbayar };
};
export const getOneBiayaPranggok = async (id) => {
  const manager = getManager();
  const [pranggok] = await manager.query(
    "select b.*,p.namaPranggok,p.noTelp,p.noKtp from biaya_pranggok b,pranggok_sarung p where b.idPranggok = p.id and b.id= ?",
    [id]
  );
  if (!pranggok) throw new Error("Biaya Pranggok Tidak Ditemukan");
  pranggok.tanggal = format(pranggok.tanggal, "yyyy-MM-dd");
  return pranggok;
};
export const updateBiayaPranggok = async (
  id,
  tanggal,
  jumlahSarung,
  harga,
  keterangan,
  idPranggok
) => {
  const manager = getManager();
  const cekPranggok = await manager.query(
    "select * from pranggok_sarung where id=? and active=true",
    [idPranggok]
  );
  if (cekPranggok.length === 0) throw new Error("Pranggok Yang Dipilih Salah");
  if (
    validator.isEmpty(tanggal, { ignore_whitespace: true }) &&
    !validator.isDate(tanggal)
  )
    throw new Error("Tanggal Harus Diisi");
  if (validator.isEmpty(jumlahSarung, { ignore_whitespace: true }))
    throw new Error("Jumlah Sarung Harus Diisi");
  if (validator.isEmpty(harga, { ignore_whitespace: true }))
    throw new Error("Harga Harus Diisi");

  const total = Number(jumlahSarung) * Number(harga);
  await manager.query(
    "update biaya_pranggok set tanggal=?,jumlahSarung=?,harga=?,total=?,sisaTagihan=?,keterangan=?,idPranggok=? where id=?",
    [
      tanggal,
      Number(jumlahSarung),
      Number(harga),
      total,
      total,
      keterangan,
      idPranggok,
      id,
    ]
  );
  await manager.query("delete from piutang_pranggok where idPranggok = ?", [
    id,
  ]);
  return true;
};
export const deleteBiayaPranggok = async (id) => {
  const manager = getManager();
  await manager.query("delete from biaya_pranggok where id = ?", [id]);
  await manager.query("delete from piutang_pranggok where idPranggok = ?", [
    id,
  ]);
  return true;
};

export const getDetailBiayaPranggok = async (id) => {
  const manager = getManager();
  const [pranggok] = await manager.query(
    "select b.*,p.namaPranggok,p.noTelp,p.noKtp from biaya_pranggok b,pranggok_sarung p where b.idPranggok = p.id and b.id= ?",
    [id]
  );

  if (!pranggok) throw new Error("Biaya Pranggok Tidak Ditemukan");
  pranggok.tanggal = format(pranggok.tanggal, "yyyy-MM-dd");
  const piutang = await manager.query(
    "select * from piutang_pranggok where idPranggok = ?",
    [id]
  );
  const piutangFinal = piutang.map((item) => ({
    ...item,
    tanggal: format(item.tanggal, "yyyy-MM-dd"),
    keterangan: item.keterangan.split(" ").splice(0, 15).join(" "),
  }));
  return { pranggok, piutang: piutangFinal };
};

export const createBayarPiutang = async (
  tanggal,
  pembayaran,
  keterangan,
  idPranggok
) => {
  const manager = getManager();
  if (
    validator.isEmpty(tanggal, { ignore_whitespace: true }) &&
    !validator.isDate(tanggal)
  )
    throw new Error("Tanggal Harus Diisi");
  if (validator.isEmpty(pembayaran, { ignore_whitespace: true }))
    throw new Error("Nominal Pembayaran Harus Diisi");
  const [pranggok] = await manager.query(
    "select * from biaya_pranggok where id=?",
    [idPranggok]
  );
  if (!pranggok)
    throw new Error("Piutang Dengan ID yang diberikan Tidak Ditemukan");
  await manager.query(
    "insert into piutang_pranggok(tanggal,pembayaran,keterangan,idPranggok) values(?,?,?,?)",
    [tanggal, Number(pembayaran), keterangan, idPranggok]
  );
  await manager.query(
    "update biaya_pranggok set sisaTagihan = sisaTagihan - ? where id = ?",
    [Number(pembayaran), idPranggok]
  );
  return true;
};
export const updateBayarPiutang = async (
  id,
  tanggal,
  pembayaran,
  keterangan,
  idPranggok
) => {
  const manager = getManager();
  const [piutang] = await manager.query(
    "select * from piutang_pranggok where id = ?",
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
  const [pranggok] = await manager.query(
    "select * from biaya_pranggok where id=?",
    [idPranggok]
  );
  if (!pranggok)
    throw new Error("Biaya Dengan ID yang diberikan Tidak Ditemukan");
  await manager.query(
    "update piutang_pranggok set tanggal = ?,pembayaran=?,keterangan=?,idPranggok=? where id = ?",
    [tanggal, Number(pembayaran), keterangan, idPranggok, id]
  );
  await manager.query(
    "update biaya_pranggok set sisaTagihan = sisaTagihan - ? + ? where id = ?",
    [Number(pembayaran), piutang.pembayaran, idPranggok]
  );
  return true;
};
export const deletePiutang = async (id) => {
  const manager = getManager();
  const [piutang] = await manager.query(
    "select * from piutang_pranggok where id = ?",
    [id]
  );
  if (!piutang)
    throw new Error("Piutang Dengan ID Yang Diberikan Tidak Ditemukan");
  await manager.query("delete from piutang_pranggok where id = ?", [id]);
  await manager.query(
    "update biaya_pranggok set sisaTagihan = sisaTagihan + ? where id = ?",
    [piutang.pembayaran, piutang.idPranggok]
  );
  return true;
};
