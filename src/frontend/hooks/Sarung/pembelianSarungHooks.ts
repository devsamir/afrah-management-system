import { useState, useEffect } from "react";
import {
  getAllPabrik,
  createPembelianSarung,
  getAllPembelianSarung,
  getRekapPembelian,
  getOnePembelian,
  deletePembelianSarung,
  updatePembelianSarung,
  createBayarPiutang,
  deletePiutang,
  getDetailPembelian,
  updateBayarPiutang,
  exportPdf,
} from "../../../backend/controllers/pembelianSarungController";
import errorHandler from "../../../backend/utils/errorHandler";

export const usePembelianSarung = () => {
  const [loading, setLoading] = useState<any>({});
  const [data, setData] = useState([]);
  const [dataPrint, setDataPrint] = useState([]);
  const [result, setResult] = useState(0);
  const [pabrikAdd, setPabrikAdd] = useState([]);
  const [pabrikFilter, setPabrikFilter] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [rekap, setRekap] = useState<any>({});

  const getPabrikAdd = async () => {
    try {
      setLoading({ ...loading, pabrikAdd: true });
      const res = await getAllPabrik(false);
      setPabrikAdd(res);
    } catch (err) {
      setError(errorHandler(err));
    } finally {
      setLoading({ ...loading, pabrikAdd: false });
    }
  };

  const handleGetAll = async (
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
    try {
      setLoading({ ...loading, get: true });

      const res = await getAllPembelianSarung(
        pabrik,
        page,
        limit,
        sort,
        search,
        rentang,
        tanggalAwal,
        tanggalAkhir,
        status
      );
      const pabrikData = await getAllPabrik(true);
      setData(res.data);
      setResult(res.result);
      setPabrikFilter(pabrikData);
    } catch (err) {
      setError(errorHandler(err));
    } finally {
      setLoading({ ...loading, get: false });
    }
  };
  const handlePrint = async (
    pabrik,
    search,
    rentang,
    tanggalAwal,
    tanggalAkhir,
    status
  ) => {
    try {
      setLoading({ ...loading, print: true });

      const res = await exportPdf(
        pabrik,
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
    { tanggal, warnaSarung, jumlah, harga, keterangan, idPabrik },
    cb
  ) => {
    try {
      setLoading({ ...loading, create: true });
      await createPembelianSarung(
        tanggal,
        warnaSarung,
        jumlah,
        harga,
        keterangan,
        idPabrik
      );
      setMessage("Berhasil Menambah Pembelian Sarung");
      cb();
    } catch (err) {
      setError(errorHandler(err));
    } finally {
      setLoading({ ...loading, create: false });
    }
  };
  const handleGetRekap = async (
    pabrik,
    rentang,
    tanggalAwal,
    tanggalAkhir,
    status
  ) => {
    try {
      setLoading({ ...loading, getRekap: true });
      const res = await getRekapPembelian(
        pabrik,
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
      const data = await getOnePembelian(id);
      return data;
    } catch (err) {
      setError(errorHandler(err));
    } finally {
      setLoading({ ...loading, getOne: false });
    }
  };
  const handleUpdate = async (
    id,
    { tanggal, warnaSarung, jumlah, harga, keterangan, idPabrik },
    cb
  ) => {
    try {
      setLoading({ ...loading, update: true });
      await updatePembelianSarung(
        id,
        tanggal,
        warnaSarung,
        jumlah,
        harga,
        keterangan,
        idPabrik
      );
      setMessage("Berhasil Update Pembelian Sarung");
      cb();
    } catch (err) {
      setError(errorHandler(err));
      console.log(err);
    } finally {
      setLoading({ ...loading, update: false });
    }
  };
  const handleDelete = async (id, cb) => {
    try {
      setLoading({ ...loading, delete: true });
      await deletePembelianSarung(id);
      setMessage("Berhasil Delete Pembelian Sarung");
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
      const res = await getDetailPembelian(id);
      return res;
    } catch (err) {
      setError(errorHandler(err));
    } finally {
      setLoading({ ...loading, getDetail: false });
    }
  };
  const handleCreatePiutang = async (
    { tanggal, pembayaran, keterangan, idPembelian },
    cb
  ) => {
    try {
      setLoading({ ...loading, submitPiutang: true });
      await createBayarPiutang(tanggal, pembayaran, keterangan, idPembelian);
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
    { tanggal, pembayaran, keterangan, idPembelian },
    cb
  ) => {
    try {
      setLoading({ ...loading, submitPiutang: true });
      await updateBayarPiutang(
        id,
        tanggal,
        pembayaran,
        keterangan,
        idPembelian
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
  useEffect(() => {
    getPabrikAdd();
  }, []);

  return {
    loading,
    data,
    dataPrint,
    result,
    pabrikAdd,
    pabrikFilter,
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
