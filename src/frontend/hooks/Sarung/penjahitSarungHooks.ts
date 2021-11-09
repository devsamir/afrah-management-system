import { useState } from "react";
import errorHandler from "../../../backend/utils/errorHandler";
import {
  createPenjahitSarung,
  deletePenjahitSarung,
  getAllPenjahit,
  getOnePenjahit,
  updatePenjahitSarung,
} from "../../../backend/controllers/penjahitSarungController";

export const usePenjahitSarung = () => {
  const [loading, setLoading] = useState<any>({});
  const [data, setData] = useState([]);
  const [result, setResult] = useState(0);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleCreate = async (
    { namaPenjahit, noTelp, noKtp, keterangan },
    cb
  ) => {
    try {
      setLoading({ ...loading, submit: true });
      await createPenjahitSarung(namaPenjahit, noTelp, noKtp, keterangan);
      setMessage("Berhasil Tambah Penjahit Sarung");
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
      const res = await getAllPenjahit(page, limit, sort, search);
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
    { namaPenjahit, noTelp, noKtp, keterangan },
    cb
  ) => {
    try {
      setLoading({ ...loading, submit: true });
      await updatePenjahitSarung(id, namaPenjahit, noTelp, noKtp, keterangan);
      setMessage("Berhasil Update Penjahit Sarung");
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
      const data = await getOnePenjahit(id);
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
      const req = await deletePenjahitSarung(id);
      if (req) setMessage("Berhasil Hapus Data Penjahit Sarung");
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
