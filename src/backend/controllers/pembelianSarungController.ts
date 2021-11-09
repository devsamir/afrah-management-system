import { remote } from "electron";
const { getManager } = remote.require("typeorm");
import validator from "validator";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export const getAllPembelianSarung = async (
  pabrik,
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
  if (pabrik !== "semua") {
    query += ` and p.id = ${pabrik}`;
    queryCount += ` and p.id = ${pabrik}`;
  }
  if (status !== "semua") {
    if (status === "lunas") {
      query += ` and s.sisaTagihan = 0`;
      queryCount += ` and s.sisaTagihan = 0`;
    }
    if (status === "belum") {
      query += ` and s.sisaTagihan != 0`;
      queryCount += ` and s.sisaTagihan != 0`;
    }
  }
  if (search) {
    const fields = ["s.tanggal", "s.warnaSarung"];
    const searchQuery = fields
      .map((item) => `${item} like '%${search}%'`)
      .join(" or ");
    query += ` and (${searchQuery})`;
    queryCount += ` and (${searchQuery})`;
  }

  if (tanggalAwal && tanggalAkhir && rentang) {
    query += ` and s.tanggal between '${tanggalAwal}' and '${tanggalAkhir}'`;
    queryCount += ` and s.tanggal between '${tanggalAwal}' and '${tanggalAkhir}'`;
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
    `select s.*,p.namaPabrik from pabrik_sarung p,pembelian_sarung s where p.id = s.idPabrik ${query}`
  );
  const [{ result }] = await manager.query(
    `select count(s.id) as result from pabrik_sarung p,pembelian_sarung s where p.id = s.idPabrik ${queryCount}`
  );
  const data = res.map((item) => ({
    ...item,
    tanggal: format(item.tanggal, "yyyy-MM-dd"),
    keterangan: item.keterangan.split(" ").splice(0, 15).join(" "),
  }));
  return { data, result };
};
export const createPembelianSarung = async (
  tanggal,
  warnaSarung,
  jumlah,
  harga,
  keterangan,
  idPabrik
) => {
  const manager = getManager();
  const cekPabrik = await manager.query(
    "select * from pabrik_sarung where id=? and active=true",
    [idPabrik]
  );
  if (cekPabrik.length === 0) throw new Error("Pabrik Yang Dipilih Salah");
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

  const total = Number(jumlah) * Number(harga);
  await manager.query(
    "insert into pembelian_sarung(tanggal,warnaSarung,jumlah,harga,total,sisaTagihan,keterangan,idPabrik) values(?,?,?,?,?,?,?,?)",
    [
      tanggal,
      warnaSarung,
      Number(jumlah),
      Number(harga),
      total,
      total,
      keterangan,
      idPabrik,
    ]
  );
  return true;
};
export const getAllPabrik = async (pembelian: boolean) => {
  const manager = getManager();
  if (pembelian) {
    const data = await manager.query(
      "select id,namaPabrik from pabrik_sarung where active=true and id in (select distinct(idPabrik) from pembelian_sarung)"
    );
    return data;
  } else {
    const data = await manager.query(
      "select id,namaPabrik from pabrik_sarung where active=true"
    );
    return data;
  }
};
export const getRekapPembelian = async (
  pabrik,
  rentang,
  tanggalAwal,
  tanggalAkhir,
  status
) => {
  const manager = getManager();
  let query = "";
  if (pabrik !== "semua") {
    query += ` and idPabrik = ${pabrik}`;
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
    `select count(*) as transaksi from pembelian_sarung where 1 ${query}`
  );
  const [{ total }] = await manager.query(
    `select sum(total) as total from pembelian_sarung where 1 ${query}`
  );
  const [{ piutang }] = await manager.query(
    `select sum(sisaTagihan) as piutang from pembelian_sarung where 1 ${query}`
  );
  const [{ terbayar }] = await manager.query(
    `select sum(total) - sum(sisaTagihan) as terbayar from pembelian_sarung where 1 ${query}`
  );
  return { transaksi, total, piutang, terbayar };
};
export const getOnePembelian = async (id) => {
  const manager = getManager();
  const [pembelian] = await manager.query(
    "select s.*,p.namaPabrik,p.noTelp from pembelian_sarung s,pabrik_sarung p where s.idPabrik = p.id and s.id= ?",
    [id]
  );
  if (!pembelian) throw new Error("Pembelian Tidak Ditemukan");
  pembelian.tanggal = format(pembelian.tanggal, "yyyy-MM-dd");
  return pembelian;
};
export const updatePembelianSarung = async (
  id,
  tanggal,
  warnaSarung,
  jumlah,
  harga,
  keterangan,
  idPabrik
) => {
  const manager = getManager();
  const cekPabrik = await manager.query(
    "select * from pabrik_sarung where id=? and active=true",
    [idPabrik]
  );
  if (cekPabrik.length === 0) throw new Error("Pabrik Yang Dipilih Salah");
  if (
    validator.isEmpty(tanggal, { ignore_whitespace: true }) &&
    !validator.isDate(tanggal)
  )
    throw new Error("Tanggal Harus Diisi");
  console.log(jumlah);
  console.log(harga);

  if (validator.isEmpty(warnaSarung, { ignore_whitespace: true }))
    throw new Error("Warna Sarung Harus Diisi");
  if (validator.isEmpty(jumlah, { ignore_whitespace: true }))
    throw new Error("Jumlah Sarung Harus Diisi");
  if (validator.isEmpty(harga, { ignore_whitespace: true }))
    throw new Error("Harga Sarung Harus Diisi");

  const total = Number(jumlah) * Number(harga);
  await manager.query(
    "update pembelian_sarung set tanggal=?,warnaSarung=?,jumlah=?,harga=?,total=?,sisaTagihan=?,keterangan=?,idPabrik=? where id=?",
    [
      tanggal,
      warnaSarung,
      Number(jumlah),
      Number(harga),
      total,
      total,
      keterangan,
      idPabrik,
      id,
    ]
  );
  await manager.query("delete from piutang_pembelian where idPembelian = ?", [
    id,
  ]);
  return true;
};
export const deletePembelianSarung = async (id) => {
  const manager = getManager();
  await manager.query("delete from pembelian_sarung where id = ?", [id]);
  await manager.query("delete from piutang_pembelian where idPembelian = ?", [
    id,
  ]);
  return true;
};

export const getDetailPembelian = async (id) => {
  const manager = getManager();
  const [pembelian] = await manager.query(
    "select s.*,p.namaPabrik,p.noTelp from pembelian_sarung s,pabrik_sarung p where s.idPabrik = p.id and s.id= ?",
    [id]
  );

  if (!pembelian) throw new Error("Pembelian Tidak Ditemukan");
  pembelian.tanggal = format(pembelian.tanggal, "yyyy-MM-dd");
  const piutang = await manager.query(
    "select * from piutang_pembelian where idPembelian = ?",
    [id]
  );
  const piutangFinal = piutang.map((item) => ({
    ...item,
    tanggal: format(item.tanggal, "yyyy-MM-dd"),
    keterangan: item.keterangan.split(" ").splice(0, 15).join(" "),
  }));
  return { pembelian, piutang: piutangFinal };
};

export const createBayarPiutang = async (
  tanggal,
  pembayaran,
  keterangan,
  idPembelian
) => {
  const manager = getManager();
  if (
    validator.isEmpty(tanggal, { ignore_whitespace: true }) &&
    !validator.isDate(tanggal)
  )
    throw new Error("Tanggal Harus Diisi");
  if (validator.isEmpty(pembayaran, { ignore_whitespace: true }))
    throw new Error("Nominal Pembayaran Harus Diisi");
  const [pembelian] = await manager.query(
    "select * from pembelian_sarung where id=?",
    [idPembelian]
  );
  if (!pembelian)
    throw new Error("Piutang Dengan ID yang diberikan Tidak Ditemukan");
  await manager.query(
    "insert into piutang_pembelian(tanggal,pembayaran,keterangan,idPembelian) values(?,?,?,?)",
    [tanggal, Number(pembayaran), keterangan, idPembelian]
  );
  await manager.query(
    "update pembelian_sarung set sisaTagihan = sisaTagihan - ? where id = ?",
    [Number(pembayaran), idPembelian]
  );
  return true;
};
export const updateBayarPiutang = async (
  id,
  tanggal,
  pembayaran,
  keterangan,
  idPembelian
) => {
  const manager = getManager();
  const [piutang] = await manager.query(
    "select * from piutang_pembelian where id = ?",
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
  const [pembelian] = await manager.query(
    "select * from pembelian_sarung where id=?",
    [idPembelian]
  );
  if (!pembelian)
    throw new Error("Piutang Dengan ID yang diberikan Tidak Ditemukan");
  await manager.query(
    "update piutang_pembelian set tanggal = ?,pembayaran=?,keterangan=?,idPembelian=? where id = ?",
    [tanggal, Number(pembayaran), keterangan, idPembelian, id]
  );
  await manager.query(
    "update pembelian_sarung set sisaTagihan = sisaTagihan - ? + ? where id = ?",
    [Number(pembayaran), piutang.pembayaran, idPembelian]
  );
  return true;
};
export const deletePiutang = async (id) => {
  const manager = getManager();
  const [piutang] = await manager.query(
    "select * from piutang_pembelian where id = ?",
    [id]
  );
  if (!piutang)
    throw new Error("Piutang Dengan ID Yang Diberikan Tidak Ditemukan");
  await manager.query("delete from piutang_pembelian where id = ?", [id]);
  await manager.query(
    "update pembelian_sarung set sisaTagihan = sisaTagihan + ? where id = ?",
    [piutang.pembayaran, piutang.idPembelian]
  );
  return true;
};

export const exportPdf = async (
  pabrik,
  search,
  rentang,
  tanggalAwal,
  tanggalAkhir,
  status
) => {
  const manager = getManager();
  let query = "";
  if (pabrik !== "semua") {
    query += ` and p.id = ${pabrik}`;
  }
  if (status !== "semua") {
    if (status === "lunas") {
      query += ` and s.sisaTagihan = 0`;
    }
    if (status === "belum") {
      query += ` and s.sisaTagihan != 0`;
    }
  }
  if (search) {
    const fields = ["s.tanggal", "s.warnaSarung"];
    const searchQuery = fields
      .map((item) => `${item} like '%${search}%'`)
      .join(" or ");
    query += ` and (${searchQuery})`;
  }

  if (tanggalAwal && tanggalAkhir && rentang) {
    query += ` and s.tanggal between '${tanggalAwal}' and '${tanggalAkhir}'`;
  }

  const res = await manager.query(
    `select s.*,p.namaPabrik from pabrik_sarung p,pembelian_sarung s where p.id = s.idPabrik ${query}`
  );
  const data = res.map((item) => ({
    ...item,
    tanggal: format(item.tanggal, "dd MMMM yyyy", { locale: id }),
    keterangan: item.keterangan.split(" ").splice(0, 15).join(" "),
  }));
  return data;
};
