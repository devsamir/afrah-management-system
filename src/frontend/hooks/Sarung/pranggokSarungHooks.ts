import { useState } from "react";
import errorHandler from "../../../backend/utils/errorHandler";
import {
  createPranggokSarung,
  deletePranggokSarung,
  getAllPranggok,
  getOnePranggok,
  updatePranggokSarung,
} from "../../../backend/controllers/pranggokSarungController";

export const usePranggokSarung = () => {
  const [loading, setLoading] = useState<any>({});
  const [data, setData] = useState([]);
  const [result, setResult] = useState(0);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleCreate = async (
    { namaPranggok, noTelp, noKtp, keterangan },
    cb
  ) => {
    try {
      setLoading({ ...loading, submit: true });
      await createPranggokSarung(namaPranggok, noTelp, noKtp, keterangan);
      setMessage("Berhasil Tambah Pranggok Sarung");
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
      const res = await getAllPranggok(page, limit, sort, search);
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
    { namaPranggok, noTelp, noKtp, keterangan },
    cb
  ) => {
    try {
      setLoading({ ...loading, submit: true });
      await updatePranggokSarung(id, namaPranggok, noTelp, noKtp, keterangan);
      setMessage("Berhasil Update Pranggok Sarung");
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
      const data = await getOnePranggok(id);
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
      const req = await deletePranggokSarung(id);
      if (req) setMessage("Berhasil Hapus Data Pranggok Sarung");
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
