import { remote } from "electron";
const { getManager } = remote.require("typeorm");
import validator from "validator";
import { format } from "date-fns";

export const getRekapData = async (tanggalAwal, tanggalAkhir) => {
  const manager = getManager();
  const [{ maxPenjualan }] = await manager.query(
    "select sum(total) as maxPenjualan from penjualan_sarung where tanggal between ? and ?",
    [tanggalAwal, tanggalAkhir]
  );
  const [{ penjualan }] = await manager.query(
    "select sum(pembayaran) as penjualan from piutang_penjualan where tanggal between ? and ?",
    [tanggalAwal, tanggalAkhir]
  );
  const [{ maxPembelian }] = await manager.query(
    "select sum(total) as maxPembelian from pembelian_sarung where tanggal between ? and ?",
    [tanggalAwal, tanggalAkhir]
  );
  const [{ pembelian }] = await manager.query(
    "select sum(pembayaran) as pembelian from piutang_pembelian where tanggal between ? and ?",
    [tanggalAwal, tanggalAkhir]
  );
  const [{ maxPenjahitan }] = await manager.query(
    "select sum(total) as maxPenjahitan from biaya_penjahitan where tanggal between ? and ?",
    [tanggalAwal, tanggalAkhir]
  );
  const [{ penjahitan }] = await manager.query(
    "select sum(pembayaran) as penjahitan from piutang_penjahitan where tanggal between ? and ?",
    [tanggalAwal, tanggalAkhir]
  );
  const [{ maxPranggok }] = await manager.query(
    "select sum(total) as maxPranggok from biaya_pranggok where tanggal between ? and ?",
    [tanggalAwal, tanggalAkhir]
  );
  const [{ pranggok }] = await manager.query(
    "select sum(pembayaran) as pranggok from piutang_pranggok where tanggal between ? and ?",
    [tanggalAwal, tanggalAkhir]
  );
  const maxPengeluaran = maxPembelian + maxPranggok + maxPenjahitan;
  const pengeluaran = pembelian + pranggok + penjahitan;
  const maxProfit = maxPenjualan * 0.1;
  const profit = penjualan * 0.1;
  const selisihTransaksi = maxPenjualan - maxPengeluaran;
  const selisihPembayaran = penjualan - pengeluaran;
  return {
    maxPenjualan,
    penjualan,
    maxPembelian,
    pembelian,
    maxPenjahitan,
    penjahitan,
    maxPranggok,
    pranggok,
    maxPengeluaran,
    pengeluaran,
    maxProfit,
    profit,
    selisihTransaksi,
    selisihPembayaran,
  };
};

export const getTransaksiLine = async (tanggalAwal, tanggalAkhir) => {
  const manager = getManager();
  let tsAwal = new Date(tanggalAwal).getTime();
  let tsAkhir = new Date(tanggalAkhir).getTime();
  const weeks = [];
  while (tsAkhir >= tsAwal) {
    const week1 = format(tsAwal, "yyyy-MM-dd");
    weeks.push(week1);
    tsAwal += 7 * 24 * 60 * 60 * 1000;
    if (tsAwal > tsAkhir) weeks.push(format(tsAkhir, "yyyy-MM-dd"));
  }
  const data = {
    category: [],
    pemasukan: [],
    pengeluaran: [],
  };
  await Promise.all(
    weeks.map(async (curr, index) => {
      if (index < weeks.length - 1) {
        const [{ maxPenjualan }] = await manager.query(
          "select sum(total) as maxPenjualan from penjualan_sarung where tanggal between ? and ?",
          [curr, weeks[index + 1]]
        );
        const [{ maxPenjahitan }] = await manager.query(
          "select sum(total) as maxPenjahitan from biaya_penjahitan where tanggal between ? and ?",
          [curr, weeks[index + 1]]
        );
        const [{ maxPranggok }] = await manager.query(
          "select sum(total) as maxPranggok from biaya_pranggok where tanggal between ? and ?",
          [curr, weeks[index + 1]]
        );
        const [{ maxPembelian }] = await manager.query(
          "select sum(total) as maxPembelian from pembelian_sarung where tanggal between ? and ?",
          [curr, weeks[index + 1]]
        );
        const maxPengeluaran = maxPembelian + maxPranggok + maxPenjahitan;
        data.category.push({
          label: `${format(new Date(curr), "dd/MM/yy")} - ${format(
            new Date(weeks[index + 1]),
            "dd/MM/yy"
          )}`,
        });
        data.pemasukan.push({ value: maxPenjualan || 0 });
        data.pengeluaran.push({ value: maxPengeluaran || 0 });
      }
    })
  );

  return data;
};

export const getPembayaranLine = async (tanggalAwal, tanggalAkhir) => {
  const manager = getManager();
  let tsAwal = new Date(tanggalAwal).getTime();
  let tsAkhir = new Date(tanggalAkhir).getTime();
  const weeks = [];
  while (tsAkhir >= tsAwal) {
    const week1 = format(tsAwal, "yyyy-MM-dd");
    weeks.push(week1);
    tsAwal += 7 * 24 * 60 * 60 * 1000;
    if (tsAwal > tsAkhir) weeks.push(format(tsAkhir, "yyyy-MM-dd"));
  }
  const data = {
    category: [],
    pemasukan: [],
    pengeluaran: [],
  };
  await Promise.all(
    weeks.map(async (curr, index) => {
      if (index < weeks.length - 1) {
        const [{ penjualan }] = await manager.query(
          "select sum(pembayaran) as penjualan from piutang_penjualan where tanggal between ? and ?",
          [curr, weeks[index + 1]]
        );
        const [{ penjahitan }] = await manager.query(
          "select sum(pembayaran) as penjahitan from piutang_penjahitan where tanggal between ? and ?",
          [curr, weeks[index + 1]]
        );
        const [{ pranggok }] = await manager.query(
          "select sum(pembayaran) as pranggok from piutang_pranggok where tanggal between ? and ?",
          [curr, weeks[index + 1]]
        );
        const [{ pembelian }] = await manager.query(
          "select sum(pembayaran) as pembelian from piutang_pembelian where tanggal between ? and ?",
          [curr, weeks[index + 1]]
        );
        const pengeluaran = pembelian + pranggok + penjahitan;
        data.category.push({
          label: `${format(new Date(curr), "dd/MM/yy")} - ${format(
            new Date(weeks[index + 1]),
            "dd/MM/yy"
          )}`,
        });
        data.pemasukan.push({ value: penjualan || 0 });
        data.pengeluaran.push({ value: pengeluaran || 0 });
      }
    })
  );

  return data;
};
