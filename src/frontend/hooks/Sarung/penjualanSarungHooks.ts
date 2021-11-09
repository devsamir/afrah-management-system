import { useState, useEffect } from "react";
import {
  createBayarPiutang,
  deletePiutang,
  updateBayarPiutang,
  createPenjualanSarung,
  deletePenjualanSarung,
  getAllPenjualanSarung,
  getDetailPenjualan,
  getOnePenjualan,
  getRekapPenjualan,
  updatePenjualanSarung,
  exportPdf,
} from "../../../backend/controllers/penjualanSarungController";
import errorHandler from "../../../backend/utils/errorHandler";

export const usePenjualanSarung = () => {
  const [loading, setLoading] = useState<any>({});
  const [data, setData] = useState([]);
  const [dataPrint, setDataPrint] = useState([]);
  const [result, setResult] = useState(0);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [rekap, setRekap] = useState<any>({});

  const handleGetAll = async (
    page,
    limit,
    sort,
    search,
    rentang,
    tanggalAwal,
    tanggalAkhir,
    status
  ) => {
    try {
      setLoading({ ...loading, get: true });

      const res = await getAllPenjualanSarung(
        page,
        limit,
        sort,
        search,
        rentang,
        tanggalAwal,
        tanggalAkhir,
        status
      );
      setData(res.data);
      setResult(res.result);
    } catch (err) {
      setError(errorHandler(err));
    } finally {
      setLoading({ ...loading, get: false });
    }
  };
  const handlePrint = async (
    search,
    rentang,
    tanggalAwal,
    tanggalAkhir,
    status
  ) => {
    try {
      setLoading({ ...loading, print: true });

      const res = await exportPdf(
        search,
        rentang,
        tanggalAwal,
        tanggalAkhir,
        status
      );
      setDataPrint(res);
    } catch (err) {
      setError(errorHandler(err));
    } finally {
      setLoading({ ...loading, print: false });
    }
  };
  const handleCreate = async (
    { tanggal, warnaSarung, jumlah, harga, keterangan, namaPembeli, noTelp },
    cb
  ) => {
    try {
      setLoading({ ...loading, create: true });
      await createPenjualanSarung(
        tanggal,
        warnaSarung,
        jumlah,
        harga,
        keterangan,
        namaPembeli,
        noTelp
      );
      setMessage("Berhasil Menambah Penjualan Sarung");
      cb();
    } catch (err) {
      setError(errorHandler(err));
    } finally {
      setLoading({ ...loading, create: false });
    }
  };
  const handleGetRekap = async (rentang, tanggalAwal, tanggalAkhir, status) => {
    try {
      setLoading({ ...loading, getRekap: true });
      const res = await getRekapPenjualan(
        rentang,
        tanggalAwal,
        tanggalAkhir,
        status
      );
      setRekap(res);
    } catch (err) {
      setError(errorHandler(err));
    } finally {
      setLoading({ ...loading, getRekap: false });
    }
  };
  const handleGetOne = async (id) => {
    try {
      setLoading({ ...loading, getOne: true });
      const data = await getOnePenjualan(id);
      return data;
    } catch (err) {
      setError(errorHandler(err));
    } finally {
      setLoading({ ...loading, getOne: false });
    }
  };
  const handleUpdate = async (
    id,
    { tanggal, warnaSarung, jumlah, harga, keterangan, namaPembeli, noTelp },
    cb
  ) => {
    try {
      setLoading({ ...loading, update: true });
      await updatePenjualanSarung(
        id,
        tanggal,
        warnaSarung,
        jumlah,
        harga,
        keterangan,
        namaPembeli,
        noTelp
      );
      setMessage("Berhasil Update Penjualan Sarung");
      cb();
    } catch (err) {
      setError(errorHandler(err));
    } finally {
      setLoading({ ...loading, update: false });
    }
  };
  const handleDelete = async (id, cb) => {
    try {
      setLoading({ ...loading, delete: true });
      await deletePenjualanSarung(id);
      setMessage("Berhasil Delete Penjualan Sarung");
      cb();
    } catch (err) {
      setError(errorHandler(err));
    } finally {
      setLoading({ ...loading, delete: false });
    }
  };
  const handleGetDetail = async (id) => {
    try {
      setLoading({ ...loading, getDetail: true });
      const res = await getDetailPenjualan(id);
      return res;
    } catch (err) {
      setError(errorHandler(err));
    } finally {
      setLoading({ ...loading, getDetail: false });
    }
  };
  const handleCreatePiutang = async (
    { tanggal, pembayaran, keterangan, idPenjualan },
    cb
  ) => {
    try {
      setLoading({ ...loading, submitPiutang: true });
      await createBayarPiutang(tanggal, pembayaran, keterangan, idPenjualan);
      setMessage("Berhasil Menambah Pembayaran Piutang");
      cb();
    } catch (err) {
      setError(errorHandler(err));
    } finally {
      setLoading({ ...loading, submitPiutang: false });
    }
  };
  const handleUpdatePiutang = async (
    id,
    { tanggal, pembayaran, keterangan, idPenjualan },
    cb
  ) => {
    try {
      setLoading({ ...loading, submitPiutang: true });
      await updateBayarPiutang(
        id,
        tanggal,
        pembayaran,
        keterangan,
        idPenjualan
      );
      setMessage("Berhasil Mengupdate Pembayaran Piutang");
      cb();
    } catch (err) {
      setError(errorHandler(err));
    } finally {
      setLoading({ ...loading, submitPiutang: false });
    }
  };
  const handleDeletePiutang = async (id, cb) => {
    try {
      setLoading({ ...loading, deletePiutang: true });
      await deletePiutang(id);
      setMessage("Berhasil Menghapus Pembayaran Piutang");
      cb();
    } catch (err) {
      setError(errorHandler(err));
    } finally {
      setLoading({ ...loading, deletePiutang: false });
    }
  };

  return {
    loading,
    data,
    dataPrint,
    result,
    message,
    rekap,
    error,
    handleGetAll,
    handlePrint,
    handleCreate,
    handleGetRekap,
    handleGetOne,
    handleUpdate,
    handleDelete,
    handleCreatePiutang,
    handleDeletePiutang,
    handleUpdatePiutang,
    handleGetDetail,
    setMessage,
    setError,
  };
};
