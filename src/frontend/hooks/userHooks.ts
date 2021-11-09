import { useState } from "react";
import errorHandler from "../../backend/utils/errorHandler";
import {
  createUser,
  deleteUser,
  getOneUser,
  getAllUser,
  updateUser,
} from "../../backend/controllers/userController";

export const useUser = () => {
  const [loading, setLoading] = useState<any>({});
  const [data, setData] = useState([]);
  const [result, setResult] = useState(0);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleCreate = async ({ username, password, repassword }, cb) => {
    try {
      setLoading({ ...loading, submit: true });
      await createUser(username, password, repassword);
      setMessage("Berhasil Tambah User");
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
      const res = await getAllUser(page, limit, sort, search);
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
    { username, oldPassword, password, repassword },
    cb
  ) => {
    try {
      setLoading({ ...loading, submit: true });
      await updateUser(id, username, oldPassword, password, repassword);
      setMessage("Berhasil Update User");
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
      const data = await getOneUser(id);
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
      const req = await deleteUser(id);
      if (req) setMessage("Berhasil Hapus User");
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
