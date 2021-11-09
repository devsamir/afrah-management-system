import { useState, useEffect } from "react";
import {
  createBayarPiutang,
  createBiayaPenjahitan,
  deleteBiayaPenjahitan,
  deletePiutang,
  getAllBiayaPenjahitan,
  getAllPenjahit,
  getDetailBiayaPenjahitan,
  getOneBiayaPenjahitan,
  getRekapBiayaPenjahitan,
  updateBayarPiutang,
  updateBiayaPenjahitan,
} from "../../../backend/controllers/biayaPenjahitanController";
import errorHandler from "../../../backend/utils/errorHandler";

export const useBiayaPenjahitan = () => {
  const [loading, setLoading] = useState<any>({});
  const [data, setData] = useState([]);
  const [result, setResult] = useState(0);
  const [penjahitAdd, setPenjahitAdd] = useState([]);
  const [penjahitFilter, setPenjahitFilter] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [rekap, setRekap] = useState<any>({});

  const getPenjahitAdd = async () => {
    try {
      setLoading({ ...loading, penjahitAdd: true });
      const res = await getAllPenjahit(false);
      setPenjahitAdd(res);
    } catch (err) {
      setError(errorHandler(err));
    } finally {
      setLoading({ ...loading, penjahitAdd: false });
    }
  };

  const handleGetAll = async (
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
    try {
      setLoading({ ...loading, get: true });

      const res = await getAllBiayaPenjahitan(
        penjahit,
        page,
        limit,
        sort,
        search,
        rentang,
        tanggalAwal,
        tanggalAkhir,
        status
      );
      const penjahitData = await getAllPenjahit(true);
      setData(res.data);
      setResult(res.result);
      setPenjahitFilter(penjahitData);
    } catch (err) {
      setError(errorHandler(err));
    } finally {
      setLoading({ ...loading, get: false });
    }
  };
  const handleCreate = async (
    { tanggal, jumlahSarung, harga, keterangan, idPenjahit },
    cb
  ) => {
    try {
      setLoading({ ...loading, submit: true });
      await createBiayaPenjahitan(
        tanggal,
        jumlahSarung,
        harga,
        keterangan,
        idPenjahit
      );
      setMessage("Berhasil Menambah Biaya Penjahitan Sarung");
      cb();
    } catch (err) {
      setError(errorHandler(err));
    } finally {
      setLoading({ ...loading, submit: false });
    }
  };
  const handleGetRekap = async (
    penjahit,
    rentang,
    tanggalAwal,
    tanggalAkhir,
    status
  ) => {
    try {
      setLoading({ ...loading, getRekap: true });
      const res = await getRekapBiayaPenjahitan(
        penjahit,
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
      const data = await getOneBiayaPenjahitan(id);
      return data;
    } catch (err) {
      setError(errorHandler(err));
    } finally {
      setLoading({ ...loading, getOne: false });
    }
  };
  const handleUpdate = async (
    id,
    { tanggal, jumlahSarung, harga, keterangan, idPenjahit },
    cb
  ) => {
    try {
      setLoading({ ...loading, submit: true });
      await updateBiayaPenjahitan(
        id,
        tanggal,
        jumlahSarung,
        harga,
        keterangan,
        idPenjahit
      );
      setMessage("Berhasil Update Biaya Penjahitan Sarung");
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
      await deleteBiayaPenjahitan(id);
      setMessage("Berhasil Delete Biaya Penjahitan Sarung");
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
      const res = await getDetailBiayaPenjahitan(id);
      return res;
    } catch (err) {
      setError(errorHandler(err));
    } finally {
      setLoading({ ...loading, getDetail: false });
    }
  };
  const handleCreatePiutang = async (
    { tanggal, pembayaran, keterangan, idPenjahitan },
    cb
  ) => {
    try {
      setLoading({ ...loading, submitPiutang: true });
      await createBayarPiutang(tanggal, pembayaran, keterangan, idPenjahitan);
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
    { tanggal, pembayaran, keterangan, idPenjahitan },
    cb
  ) => {
    try {
      setLoading({ ...loading, submitPiutang: true });
      await updateBayarPiutang(
        id,
        tanggal,
        pembayaran,
        keterangan,
        idPenjahitan
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
    getPenjahitAdd();
  }, []);

  return {
    loading,
    data,
    result,
    penjahitAdd,
    penjahitFilter,
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
