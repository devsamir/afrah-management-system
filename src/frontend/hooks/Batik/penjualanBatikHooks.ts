import { useState, useEffect } from "react";
import errorHandler from "../../../backend/utils/errorHandler";
import {
  createPenjualanBatik,
  deletePenjualanBatik,
  getAllPenjualanBatik,
  getOnePenjualanBatik,
  updatePenjualanBatik,
  createBayarPiutang,
  deletePiutang,
  getAllPembeli,
  getRekapPenjualan,
  getDetailPenjualan,
  updateBayarPiutang,
  exportPdf,
} from "../../../backend/controllers/Batik/penjualanBatikController";

export const usePenjualanBatik = () => {
  const [loading, setLoading] = useState<any>({});
  const [data, setData] = useState([]);
  const [dataPrint, setDataPrint] = useState([]);
  const [result, setResult] = useState(0);
  const [pembeliAdd, setPembeliAdd] = useState([]);
  const [pembeliFilter, setPembeliFilter] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [rekap, setRekap] = useState<any>({});

  const getPembeliAdd = async () => {
    try {
      setLoading({ ...loading, pembeliAdd: true });
      const res = await getAllPembeli(false);
      setPembeliAdd(res);
    } catch (err) {
      setError(errorHandler(err));
    } finally {
      setLoading({ ...loading, pembeliAdd: false });
    }
  };

  const handleGetAll = async (
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
    try {
      setLoading({ ...loading, get: true });

      const res = await getAllPenjualanBatik(
        pembeli,
        page,
        limit,
        sort,
        search,
        rentang,
        tanggalAwal,
        tanggalAkhir,
        status
      );
      const pembeliData = await getAllPembeli(true);
      setData(res.data);
      setResult(res.result);
      setPembeliFilter(pembeliData);
    } catch (err) {
      setError(errorHandler(err));
    } finally {
      setLoading({ ...loading, get: false });
    }
  };
  const handlePrint = async (
    pembeli,
    search,
    rentang,
    tanggalAwal,
    tanggalAkhir,
    status
  ) => {
    try {
      setLoading({ ...loading, print: true });

      const res = await exportPdf(
        pembeli,
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
    { tanggal, detail, keterangan, idPembeli },
    cb
  ) => {
    try {
      setLoading({ ...loading, create: true });
      await createPenjualanBatik(tanggal, idPembeli, detail, keterangan);
      setMessage("Berhasil Menambah Penjualan Batik");
      cb();
    } catch (err) {
      setError(errorHandler(err));
    } finally {
      setLoading({ ...loading, create: false });
    }
  };
  const handleGetRekap = async (
    pembeli,
    rentang,
    tanggalAwal,
    tanggalAkhir,
    status
  ) => {
    try {
      setLoading({ ...loading, getRekap: true });
      const res = await getRekapPenjualan(
        pembeli,
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
      const data = await getOnePenjualanBatik(id);
      return data;
    } catch (err) {
      setError(errorHandler(err));
    } finally {
      setLoading({ ...loading, getOne: false });
    }
  };
  const handleUpdate = async (
    id,
    { tanggal, detail, keterangan, idPembeli },
    cb
  ) => {
    try {
      setLoading({ ...loading, update: true });
      await updatePenjualanBatik(id, tanggal, idPembeli, detail, keterangan);
      setMessage("Berhasil Update Penjualan Batik");
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
      await deletePenjualanBatik(id);
      setMessage("Berhasil Delete Penjualan Batik");
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
  useEffect(() => {
    getPembeliAdd();
  }, []);

  return {
    loading,
    data,
    dataPrint,
    result,
    pembeliAdd,
    pembeliFilter,
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
