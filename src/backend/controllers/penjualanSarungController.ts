import { remote } from "electron";
const { getManager } = remote.require("typeorm");
import validator from "validator";
import { format } from "date-fns";
import { id } from "date-fns/locale";
export const getAllPenjualanSarung = async (
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
  if (status !== "semua") {
    if (status === "lunas") {
      query += ` and sisaTagihan = 0`;
      queryCount += ` and sisaTagihan = 0`;
    }
    if (status === "belum") {
      query += ` and sisaTagihan != 0`;
      queryCount += ` and sisaTagihan != 0`;
    }
  }
  if (search) {
    const fields = ["tanggal", "warnaSarung", "namaPembeli", "noTelp"];
    const searchQuery = fields
      .map((item) => `${item} like '%${search}%'`)
      .join(" or ");
    query += ` and (${searchQuery})`;
    queryCount += ` and (${searchQuery})`;
  }

  if (tanggalAwal && tanggalAkhir && rentang) {
    query += ` and tanggal between '${tanggalAwal}' and '${tanggalAkhir}'`;
    queryCount += ` and tanggal between '${tanggalAwal}' and '${tanggalAkhir}'`;
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
    `select * from penjualan_sarung where 1 ${query}`
  );
  const [{ result }] = await manager.query(
    `select count(id) as result from penjualan_sarung where 1 ${queryCount}`
  );
  const data = res.map((item) => ({
    ...item,
    tanggal: format(item.tanggal, "yyyy-MM-dd"),
    keterangan: item.keterangan.split(" ").splice(0, 15).join(" "),
  }));
  return { data, result };
};
export const createPenjualanSarung = async (
  tanggal,
  warnaSarung,
  jumlah,
  harga,
  keterangan,
  namaPembeli,
  noTelp
) => {
  const manager = getManager();
  if (
    validator.isEmpty(tanggal, { ignore_whitespace: true }) &&
    !validator.isDate(tanggal)
  )
    throw new Error("Tanggal Harus Diisi");
  if (validator.isEmpty(warnaSarung, { ignore_whitespace: true }))
    throw new Error("Warna Sarung Harus Diisi");
  if (validator.isEmpty(jumlah, { ignore_whitespace: true }))
    throw new Error("Jumlah Sarung Harus Diisi");
  if (validator.isEmpty(harga, { ignore_whitespace: true }))
    throw new Error("Harga Sarung Harus Diisi");
  if (validator.isEmpty(namaPembeli, { ignore_whitespace: true }))
    throw new Error("Nama Pembeli Harus Diisi");

  const total = Number(jumlah) * Number(harga);
  await manager.query(
    "insert into penjualan_sarung(tanggal,warnaSarung,jumlah,harga,total,sisaTagihan,keterangan,namaPembeli,noTelp) values(?,?,?,?,?,?,?,?,?)",
    [
      tanggal,
      warnaSarung,
      Number(jumlah),
      Number(harga),
      total,
      total,
      keterangan,
      namaPembeli,
      noTelp,
    ]
  );
  return true;
};
export const getRekapPenjualan = async (
  rentang,
  tanggalAwal,
  tanggalAkhir,
  status
) => {
  const manager = getManager();
  let query = "";
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
    `select count(*) as transaksi from penjualan_sarung where 1 ${query}`
  );
  const [{ total }] = await manager.query(
    `select sum(total) as total from penjualan_sarung where 1 ${query}`
  );
  const [{ piutang }] = await manager.query(
    `select sum(sisaTagihan) as piutang from penjualan_sarung where 1 ${query}`
  );
  const [{ terbayar }] = await manager.query(
    `select sum(total) - sum(sisaTagihan) as terbayar from penjualan_sarung where 1 ${query}`
  );
  const maxProfit = total * 0.1;
  const profit = terbayar * 0.1;
  return { transaksi, total, piutang, terbayar, maxProfit, profit };
};
export const getOnePenjualan = async (id) => {
  const manager = getManager();
  const [penjualan] = await manager.query(
    "select * from penjualan_sarung where id= ?",
    [id]
  );
  if (!penjualan) throw new Error("Penjualan Tidak Ditemukan");
  penjualan.tanggal = format(penjualan.tanggal, "yyyy-MM-dd");
  return penjualan;
};
export const updatePenjualanSarung = async (
  id,
  tanggal,
  warnaSarung,
  jumlah,
  harga,
  keterangan,
  namaPembeli,
  noTelp
) => {
  const manager = getManager();
  if (
    validator.isEmpty(tanggal, { ignore_whitespace: true }) &&
    !validator.isDate(tanggal)
  )
    throw new Error("Tanggal Harus Diisi");

  if (validator.isEmpty(warnaSarung, { ignore_whitespace: true }))
    throw new Error("Warna Sarung Harus Diisi");
  if (validator.isEmpty(jumlah, { ignore_whitespace: true }))
    throw new Error("Jumlah Sarung Harus Diisi");
  if (validator.isEmpty(harga, { ignore_whitespace: true }))
    throw new Error("Harga Sarung Harus Diisi");
  if (validator.isEmpty(namaPembeli, { ignore_whitespace: true }))
    throw new Error("Nama Pembeli Harus Diisi");

  const total = Number(jumlah) * Number(harga);
  await manager.query(
    "update penjualan_sarung set tanggal=?,warnaSarung=?,jumlah=?,harga=?,total=?,sisaTagihan=?,keterangan=?,namaPembeli=?,noTelp=? where id=?",
    [
      tanggal,
      warnaSarung,
      Number(jumlah),
      Number(harga),
      total,
      total,
      keterangan,
      namaPembeli,
      noTelp,
      id,
    ]
  );
  await manager.query("delete from piutang_penjualan where idPenjualan = ?", [
    id,
  ]);
  return true;
};
export const deletePenjualanSarung = async (id) => {
  const manager = getManager();
  await manager.query("delete from penjualan_sarung where id = ?", [id]);
  await manager.query("delete from piutang_penjualan where idPenjualan = ?", [
    id,
  ]);
  return true;
};

export const getDetailPenjualan = async (id) => {
  const manager = getManager();
  const [penjualan] = await manager.query(
    "select * from penjualan_sarung where id= ?",
    [id]
  );

  if (!penjualan) throw new Error("Penjualan Tidak Ditemukan");
  penjualan.tanggal = format(penjualan.tanggal, "yyyy-MM-dd");
  const piutang = await manager.query(
    "select * from piutang_penjualan where idPenjualan = ?",
    [id]
  );
  const piutangFinal = piutang.map((item) => ({
    ...item,
    tanggal: format(item.tanggal, "yyyy-MM-dd"),
    keterangan: item.keterangan.split(" ").splice(0, 15).join(" "),
  }));
  return { penjualan, piutang: piutangFinal };
};

export const createBayarPiutang = async (
  tanggal,
  pembayaran,
  keterangan,
  idPenjualan
) => {
  const manager = getManager();
  if (
    validator.isEmpty(tanggal, { ignore_whitespace: true }) &&
    !validator.isDate(tanggal)
  )
    throw new Error("Tanggal Harus Diisi");
  if (validator.isEmpty(pembayaran, { ignore_whitespace: true }))
    throw new Error("Nominal Pembayaran Harus Diisi");
  const [penjualan] = await manager.query(
    "select * from penjualan_sarung where id=?",
    [idPenjualan]
  );
  if (!penjualan)
    throw new Error("Piutang Dengan ID yang diberikan Tidak Ditemukan");
  await manager.query(
    "insert into piutang_penjualan(tanggal,pembayaran,keterangan,idPenjualan) values(?,?,?,?)",
    [tanggal, Number(pembayaran), keterangan, idPenjualan]
  );
  await manager.query(
    "update penjualan_sarung set sisaTagihan = sisaTagihan - ? where id = ?",
    [Number(pembayaran), idPenjualan]
  );
  return true;
};
export const updateBayarPiutang = async (
  id,
  tanggal,
  pembayaran,
  keterangan,
  idPenjualan
) => {
  const manager = getManager();
  const [piutang] = await manager.query(
    "select * from piutang_penjualan where id = ?",
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
  const [penjualan] = await manager.query(
    "select * from penjualan_sarung where id=?",
    [idPenjualan]
  );
  if (!penjualan)
    throw new Error("Piutang Dengan ID yang diberikan Tidak Ditemukan");
  await manager.query(
    "update piutang_penjualan set tanggal = ?,pembayaran=?,keterangan=?,idPenjualan=? where id = ?",
    [tanggal, Number(pembayaran), keterangan, idPenjualan, id]
  );
  await manager.query(
    "update penjualan_sarung set sisaTagihan = sisaTagihan - ? + ? where id = ?",
    [Number(pembayaran), piutang.pembayaran, idPenjualan]
  );
  return true;
};
export const deletePiutang = async (id) => {
  const manager = getManager();
  const [piutang] = await manager.query(
    "select * from piutang_penjualan where id = ?",
    [id]
  );
  if (!piutang)
    throw new Error("Piutang Dengan ID Yang Diberikan Tidak Ditemukan");
  await manager.query("delete from piutang_penjualan where id = ?", [id]);
  await manager.query(
    "update penjualan_sarung set sisaTagihan = sisaTagihan + ? where id = ?",
    [piutang.pembayaran, piutang.idPenjualan]
  );
  return true;
};

export const exportPdf = async (
  search,
  rentang,
  tanggalAwal,
  tanggalAkhir,
  status
) => {
  const manager = getManager();
  let query = "";
  if (status !== "semua") {
    if (status === "lunas") {
      query += ` and sisaTagihan = 0`;
    }
    if (status === "belum") {
      query += ` and sisaTagihan != 0`;
    }
  }
  if (search) {
    const fields = ["tanggal", "warnaSarung", "namaPembeli", "noTelp"];
    const searchQuery = fields
      .map((item) => `${item} like '%${search}%'`)
      .join(" or ");
    query += ` and (${searchQuery})`;
  }

  if (tanggalAwal && tanggalAkhir && rentang) {
    query += ` and tanggal between '${tanggalAwal}' and '${tanggalAkhir}'`;
  }
  const res = await manager.query(
    `select * from penjualan_sarung where 1 ${query}`
  );
  const data = res.map((item) => ({
    ...item,
    tanggal: format(item.tanggal, "dd MMMM yyyy", { locale: id }),
    keterangan: item.keterangan.split(" ").splice(0, 15).join(" "),
  }));
  return data;
};
