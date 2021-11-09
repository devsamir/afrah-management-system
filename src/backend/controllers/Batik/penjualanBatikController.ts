import { remote } from "electron";
const { getManager } = remote.require("typeorm");
import validator from "validator";
import { format } from "date-fns";
import { v4 } from "uuid";
import { id } from "date-fns/locale";

export const getAllPenjualanBatik = async (
  pembeli,
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
  if (pembeli !== "semua") {
    query += ` and p.id = ${pembeli}`;
    queryCount += ` and p.id = ${pembeli}`;
  }
  if (status !== "semua") {
    if (status === "lunas") {
      query += ` and m.sisaTagihan = 0`;
      queryCount += ` and m.sisaTagihan = 0`;
    }
    if (status === "belum") {
      query += ` and m.sisaTagihan != 0`;
      queryCount += ` and m.sisaTagihan != 0`;
    }
  }
  if (search) {
    const fields = ["m.tanggal", "p.namaPembeli"];
    const searchQuery = fields
      .map((item) => `${item} like '%${search}%'`)
      .join(" or ");
    query += ` and (${searchQuery})`;
    queryCount += ` and (${searchQuery})`;
  }

  if (tanggalAwal && tanggalAkhir && rentang) {
    query += ` and m.tanggal between '${tanggalAwal}' and '${tanggalAkhir}'`;
    queryCount += ` and m.tanggal between '${tanggalAwal}' and '${tanggalAkhir}'`;
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
    `select m.*,p.namaPembeli from pembeli_batik p,master_penjualan_batik m where p.id = m.idPembeli ${query}`
  );
  const [{ result }] = await manager.query(
    `select count(m.id) as result from pembeli_batik p,master_penjualan_batik m where p.id = m.idPembeli ${queryCount}`
  );
  const data = res.map((item) => ({
    ...item,
    tanggal: format(item.tanggal, "yyyy-MM-dd"),
    keterangan: item.keterangan.split(" ").splice(0, 15).join(" "),
  }));
  return { data, result };
};
export const getRekapPenjualan = async (
  pembeli,
  rentang,
  tanggalAwal,
  tanggalAkhir,
  status
) => {
  const manager = getManager();
  let query = "";
  if (pembeli !== "semua") {
    query += ` and p.id = ${pembeli}`;
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
    `select count(m.id) as transaksi from master_penjualan_batik m,pembeli_batik p where m.idPembeli = p.id ${query}`
  );
  const [{ total }] = await manager.query(
    `select sum(m.total) as total from master_penjualan_batik m,pembeli_batik p where m.idPembeli = p.id ${query}`
  );
  const [{ piutang }] = await manager.query(
    `select sum(m.sisaTagihan) as piutang from master_penjualan_batik m,pembeli_batik p where m.idPembeli = p.id ${query}`
  );
  const [{ terbayar }] = await manager.query(
    `select sum(m.total) - sum(m.sisaTagihan) as terbayar from master_penjualan_batik m,pembeli_batik p where m.idPembeli = p.id ${query}`
  );
  const maxProfit = total * 0.1;
  const profit = terbayar * 0.1;
  return { transaksi, total, piutang, terbayar, maxProfit, profit };
};
export const createPenjualanBatik = async (
  tanggal,
  idPembeli,
  detail,
  keterangan
) => {
  const manager = getManager();
  const cekPembeli = await manager.query(
    "select * from pembeli_batik where id=? and active=true",
    [idPembeli]
  );
  if (!cekPembeli) throw new Error("Pembeli Yang Dipilih Salah");
  if (
    validator.isEmpty(tanggal, { ignore_whitespace: true }) &&
    !validator.isDate(tanggal)
  )
    throw new Error("Tanggal Harus Diisi");
  if (detail.length < 1) throw new Error("Isi Transaksi Penjualan Batik");
  const total = detail.reduce((acc, curr) => {
    acc += Number(curr.total);
    return acc;
  }, 0);
  const id = v4();
  await manager.query(
    "insert into master_penjualan_batik(id,idPembeli,tanggal,total,sisaTagihan,keterangan) values(?,?,?,?,?,?)",
    [id, idPembeli, tanggal, total, total, keterangan]
  );
  await Promise.all(
    detail.map(async (item) => {
      await manager.query(
        "insert into detail_penjualan_batik(idPenjualan,namaBatik,jumlah,harga,total) values(?,?,?,?,?)",
        [id, item.namaBatik, item.jumlah, item.harga, item.total]
      );
      return true;
    })
  );
  return true;
};
export const getOnePenjualanBatik = async (id) => {
  const manager = getManager();
  const [master] = await manager.query(
    "select m.*,p.namaPembeli,p.noTelp,p.noKtp from master_penjualan_batik m,pembeli_batik p where p.id = m.idPembeli and m.id=?",
    [id]
  );
  if (!master) throw new Error("Penjualan Batik Tidak Ditemukan");
  const detail = await manager.query(
    "select * from detail_penjualan_batik where idPenjualan=?",
    [id]
  );
  master.tanggal = format(master.tanggal, "yyyy-MM-dd");
  return { ...master, detail };
};
export const updatePenjualanBatik = async (
  id,
  tanggal,
  idPembeli,
  detail,
  keterangan
) => {
  const manager = getManager();
  const [master] = await manager.query(
    "select m.*,p.namaPembeli,p.noTelp,p.noKtp from master_penjualan_batik m,pembeli_batik p where p.id = m.idPembeli and m.id=?",
    [id]
  );
  if (!master) throw new Error("Penjualan Batik Tidak Ditemukan");
  const cekPembeli = await manager.query(
    "select * from pembeli_batik where id=? and active=true",
    [idPembeli]
  );
  if (!cekPembeli) throw new Error("Pembeli Yang Dipilih Salah");
  if (
    validator.isEmpty(tanggal, { ignore_whitespace: true }) &&
    !validator.isDate(tanggal)
  )
    throw new Error("Tanggal Harus Diisi");
  if (detail.length < 1) throw new Error("Isi Transaksi Penjualan Batik");
  const total = detail.reduce((acc, curr) => {
    acc += Number(curr.total);
    return acc;
  }, 0);
  await manager.query(
    "update master_penjualan_batik set idPembeli=?,tanggal=?,total=?,sisaTagihan=?,keterangan=? where id = ?",
    [idPembeli, tanggal, total, total, keterangan, id]
  );
  //   CLEAN OLD DATA
  // Delete Detail Data
  await manager.query(
    "delete from detail_penjualan_batik where idPenjualan=?",
    [id]
  );
  await manager.query(
    "delete from piutang_penjualan_batik where idPenjualan=?",
    [id]
  );
  await Promise.all(
    detail.map(async (item) => {
      await manager.query(
        "insert into detail_penjualan_batik(idPenjualan,namaBatik,jumlah,harga,total) values(?,?,?,?,?)",
        [id, item.namaBatik, item.jumlah, item.harga, item.total]
      );
      return true;
    })
  );
  return true;
};

export const deletePenjualanBatik = async (id) => {
  const manager = getManager();
  const [master] = await manager.query(
    "select * from master_penjualan_batik where id=?",
    [id]
  );
  if (!master) throw new Error("Penjualan Batik Tidak Ditemukan");
  // Delete Detail Data
  await manager.query(
    "delete from detail_penjualan_batik where idPenjualan=?",
    [id]
  );
  await manager.query(
    "delete from piutang_penjualan_batik where idPenjualan=?",
    [id]
  );
  await manager.query("delete from master_penjualan_batik where id=?", [id]);
  return true;
};

export const getAllPembeli = async (penjualan: boolean) => {
  const manager = getManager();
  if (penjualan) {
    const data = await manager.query(
      "select id,namaPembeli from pembeli_batik where active=true and id in (select distinct(idPembeli) from master_penjualan_batik)"
    );
    return data;
  } else {
    const data = await manager.query(
      "select id,namaPembeli from pembeli_batik where active=true"
    );
    return data;
  }
};

export const getDetailPenjualan = async (id) => {
  const manager = getManager();
  const [master] = await manager.query(
    "select m.*,p.namaPembeli,p.noTelp,p.noKtp from master_penjualan_batik m,pembeli_batik p where p.id = m.idPembeli and m.id=?",
    [id]
  );
  if (!master) throw new Error("Penjualan Batik Tidak Ditemukan");
  const detail = await manager.query(
    "select * from detail_penjualan_batik where idPenjualan=?",
    [id]
  );
  master.tanggal = format(master.tanggal, "yyyy-MM-dd");
  const piutang = await manager.query(
    "select * from piutang_penjualan_batik where idPenjualan = ?",
    [id]
  );
  const piutangFinal = piutang.map((item) => ({
    ...item,
    tanggal: format(item.tanggal, "yyyy-MM-dd"),
    keterangan: item.keterangan.split(" ").splice(0, 15).join(" "),
  }));
  return { penjualan: { ...master, detail }, piutang: piutangFinal };
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
    "select * from master_penjualan_batik where id=?",
    [idPenjualan]
  );
  if (!penjualan)
    throw new Error("Piutang Dengan ID yang diberikan Tidak Ditemukan");
  await manager.query(
    "insert into piutang_penjualan_batik(tanggal,pembayaran,keterangan,idPenjualan) values(?,?,?,?)",
    [tanggal, Number(pembayaran), keterangan, idPenjualan]
  );
  await manager.query(
    "update master_penjualan_batik set sisaTagihan = sisaTagihan - ? where id = ?",
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
    "select * from piutang_penjualan_batik where id = ?",
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
    "select * from master_penjualan_batik where id=?",
    [idPenjualan]
  );
  if (!penjualan)
    throw new Error("Piutang Dengan ID yang diberikan Tidak Ditemukan");
  await manager.query(
    "update piutang_penjualan_batik set tanggal = ?,pembayaran=?,keterangan=?,idPenjualan=? where id = ?",
    [tanggal, Number(pembayaran), keterangan, idPenjualan, id]
  );
  await manager.query(
    "update master_penjualan_batik set sisaTagihan = sisaTagihan - ? + ? where id = ?",
    [Number(pembayaran), piutang.pembayaran, idPenjualan]
  );
  return true;
};

export const deletePiutang = async (id) => {
  const manager = getManager();
  const [piutang] = await manager.query(
    "select * from piutang_penjualan_batik where id = ?",
    [id]
  );
  if (!piutang)
    throw new Error("Piutang Dengan ID Yang Diberikan Tidak Ditemukan");
  await manager.query("delete from piutang_penjualan_batik where id = ?", [id]);
  await manager.query(
    "update master_penjualan_batik set sisaTagihan = sisaTagihan + ? where id = ?",
    [piutang.pembayaran, piutang.idPenjualan]
  );
  return true;
};

export const exportPdf = async (
  pembeli,
  search,
  rentang,
  tanggalAwal,
  tanggalAkhir,
  status
) => {
  const manager = getManager();
  let query = "";
  if (pembeli !== "semua") {
    query += ` and p.id = ${pembeli}`;
  }
  if (status !== "semua") {
    if (status === "lunas") {
      query += ` and m.sisaTagihan = 0`;
    }
    if (status === "belum") {
      query += ` and m.sisaTagihan != 0`;
    }
  }
  if (search) {
    const fields = ["m.tanggal", "p.namaPembeli"];
    const searchQuery = fields
      .map((item) => `${item} like '%${search}%'`)
      .join(" or ");
    query += ` and (${searchQuery})`;
  }

  if (tanggalAwal && tanggalAkhir && rentang) {
    query += ` and m.tanggal between '${tanggalAwal}' and '${tanggalAkhir}'`;
  }
  const res = await manager.query(
    `select m.*,p.namaPembeli from pembeli_batik p,master_penjualan_batik m where p.id = m.idPembeli ${query}`
  );
  const data = res.map((item) => ({
    ...item,
    tanggal: format(item.tanggal, "dd MMMM yyyy", { locale: id }),
    keterangan: item.keterangan.split(" ").splice(0, 15).join(" "),
  }));
  return data;
};
