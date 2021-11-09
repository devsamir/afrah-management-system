import { useState } from "react";
import errorHandler from "../../../backend/utils/errorHandler";
import {
  getAllPabrik,
  createPabrikSarung,
  updatePabrikSarung,
  deletePabrikSarung,
  getOnePabrik,
} from "../../../backend/controllers/pabrikSarungController";
export const usePabrikSarung = () => {
  const [loading, setLoading] = useState<any>({});
  const [data, setData] = useState([]);
  const [result, setResult] = useState(0);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleCreate = async ({ namaPabrik, noTelp, keterangan }, cb) => {
    try {
      setLoading({ ...loading, submit: true });
      await createPabrikSarung(namaPabrik, noTelp, keterangan);
      setMessage("Berhasil Tambah Pabrik Sarung !");
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
      const res = await getAllPabrik(page, limit, sort, search);
      setData(res.data);
      setResult(res.result);
    } catch (err) {
      setError(errorHandler(err));
    } finally {
      setLoading({ ...loading, get: false });
    }
  };

  const handleUpdate = async (id, { namaPabrik, noTelp, keterangan }, cb) => {
    try {
      setLoading({ ...loading, submit: true });
      await updatePabrikSarung(id, namaPabrik, noTelp, keterangan);
      setMessage("Berhasil Update Pabrik Sarung !");
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
      const data = await getOnePabrik(id);
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
      const req = await deletePabrikSarung(id);
      if (req) setMessage("Berhasil Hapus Data Pabrik Sarung");
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
