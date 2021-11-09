import { useState, useEffect } from "react";
import {
  createBiayaPranggok,
  createBayarPiutang,
  deleteBiayaPranggok,
  deletePiutang,
  getAllBiayaPranggok,
  getAllPranggok,
  getDetailBiayaPranggok,
  getOneBiayaPranggok,
  getRekapBiayaPranggok,
  updateBayarPiutang,
  updateBiayaPranggok,
} from "../../../backend/controllers/biayaPranggokController";
import errorHandler from "../../../backend/utils/errorHandler";

export const useBiayaPranggok = () => {
  const [loading, setLoading] = useState<any>({});
  const [data, setData] = useState([]);
  const [result, setResult] = useState(0);
  const [pranggokAdd, setPranggokAdd] = useState([]);
  const [pranggokFilter, setPranggokFilter] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [rekap, setRekap] = useState<any>({});

  const getPranggokAdd = async () => {
    try {
      setLoading({ ...loading, pranggokAdd: true });
      const res = await getAllPranggok(false);
      setPranggokAdd(res);
    } catch (err) {
      setError(errorHandler(err));
    } finally {
      setLoading({ ...loading, pranggokAdd: false });
    }
  };

  const handleGetAll = async (
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
    try {
      setLoading({ ...loading, get: true });

      const res = await getAllBiayaPranggok(
        pranggok,
        page,
        limit,
        sort,
        search,
        rentang,
        tanggalAwal,
        tanggalAkhir,
        status
      );
      const pranggokData = await getAllPranggok(true);
      setData(res.data);
      setResult(res.result);
      setPranggokFilter(pranggokData);
    } catch (err) {
      setError(errorHandler(err));
    } finally {
      setLoading({ ...loading, get: false });
    }
  };
  const handleCreate = async (
    { tanggal, jumlahSarung, harga, keterangan, idPranggok },
    cb
  ) => {
    try {
      setLoading({ ...loading, submit: true });
      await createBiayaPranggok(
        tanggal,
        jumlahSarung,
        harga,
        keterangan,
        idPranggok
      );
      setMessage("Berhasil Menambah Biaya Pranggok Sarung");
      cb();
    } catch (err) {
      setError(errorHandler(err));
    } finally {
      setLoading({ ...loading, submit: false });
    }
  };
  const handleGetRekap = async (
    pranggok,
    rentang,
    tanggalAwal,
    tanggalAkhir,
    status
  ) => {
    try {
      setLoading({ ...loading, getRekap: true });
      const res = await getRekapBiayaPranggok(
        pranggok,
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
      const data = await getOneBiayaPranggok(id);
      return data;
    } catch (err) {
      setError(errorHandler(err));
    } finally {
      setLoading({ ...loading, getOne: false });
    }
  };
  const handleUpdate = async (
    id,
    { tanggal, jumlahSarung, harga, keterangan, idPranggok },
    cb
  ) => {
    try {
      setLoading({ ...loading, submit: true });
      await updateBiayaPranggok(
        id,
        tanggal,
        jumlahSarung,
        harga,
        keterangan,
        idPranggok
      );
      setMessage("Berhasil Update Biaya Pranggok Sarung");
      cb();
    } catch (err) {
      setError(errorHandler(err));
    } finally {
      setLoading({ ...loading, submit: false });
    }
  };
  const handleDelete = async (id, cb) => {
    try {
      setLoading({ ...loading, delete: true });
      await deleteBiayaPranggok(id);
      setMessage("Berhasil Delete Biaya Pranggok Sarung");
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
      const res = await getDetailBiayaPranggok(id);
      return res;
    } catch (err) {
      setError(errorHandler(err));
    } finally {
      setLoading({ ...loading, getDetail: false });
    }
  };
  const handleCreatePiutang = async (
    { tanggal, pembayaran, keterangan, idPranggok },
    cb
  ) => {
    try {
      setLoading({ ...loading, submitPiutang: true });
      await createBayarPiutang(tanggal, pembayaran, keterangan, idPranggok);
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
    { tanggal, pembayaran, keterangan, idPranggok },
    cb
  ) => {
    try {
      setLoading({ ...loading, submitPiutang: true });
      await updateBayarPiutang(id, tanggal, pembayaran, keterangan, idPranggok);
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
    getPranggokAdd();
  }, []);

  return {
    loading,
    data,
    result,
    pranggokAdd,
    pranggokFilter,
    message,
    rekap,
    error,
    handleGetAll,
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
