import { useState } from "react";
import errorHandler from "../../../backend/utils/errorHandler";
import {
  createPembeliBatik,
  deletePembeliBatik,
  getAllPembeli,
  getOnePembeli,
  updatePembeliBatik,
} from "../../../backend/controllers/Batik/pembeliBatikController";

export const usePembeliBatik = () => {
  const [loading, setLoading] = useState<any>({});
  const [data, setData] = useState([]);
  const [result, setResult] = useState(0);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleCreate = async (
    { namaPembeli, noTelp, noKtp, keterangan },
    cb
  ) => {
    try {
      setLoading({ ...loading, submit: true });
      await createPembeliBatik(namaPembeli, noTelp, noKtp, keterangan);
      setMessage("Berhasil Tambah Pembeli Batik");
      cb();
    } catch (err) {
      setError(errorHandler(err));
    } finally {
      setLoading({ ...loading, submit: false });
    }
  };
  const handleGetAll = async (page, limit, sort, search) => {
    try {
      setLoading({ ...loading, get: true });
      const res = await getAllPembeli(page, limit, sort, search);
      setData(res.data);
      setResult(res.result);
    } catch (err) {
      setError(errorHandler(err));
    } finally {
      setLoading({ ...loading, get: false });
    }
  };
  const handleUpdate = async (
    id,
    { namaPembeli, noTelp, noKtp, keterangan },
    cb
  ) => {
    try {
      setLoading({ ...loading, submit: true });
      await updatePembeliBatik(id, namaPembeli, noTelp, noKtp, keterangan);
      setMessage("Berhasil Update Pembeli Batik");
      cb();
    } catch (err) {
      setError(errorHandler(err));
    } finally {
      setLoading({ ...loading, submit: false });
    }
  };
  const handleGetOne = async (id) => {
    try {
      setLoading({ ...loading, getOne: true });
      const data = await getOnePembeli(id);
      return data;
    } catch (err) {
      setError(errorHandler(err));
    } finally {
      setLoading({ ...loading, getOne: false });
    }
  };

  const handleDelete = async (id, cb) => {
    try {
      setLoading({ ...loading, delete: true });
      const req = await deletePembeliBatik(id);
      if (req) setMessage("Berhasil Hapus Data Pembeli Batik");
      cb();
    } catch (err) {
      setError(errorHandler(err));
    } finally {
      setLoading({ ...loading, delete: false });
    }
  };

  return {
    loading,
    data,
    result,
    message,
    error,
    setError,
    setMessage,
    handleCreate,
    handleGetAll,
    handleUpdate,
    handleDelete,
    handleGetOne,
  };
};
