import { useState, useEffect } from "react";
import {
  getRekapData,
  getTransaksiLine,
  getPembayaranLine,
} from "../../../backend/controllers/dashboardSarungController";
import errorHandler from "../../../backend/utils/errorHandler";

export const useDashboardSarung = () => {
  const [loading, setLoading] = useState<any>({});
  const [rekap, setRekap] = useState<any>({});
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [transaksiLine, setTransaksiLine] = useState<any>({});
  const [pembayaranLine, setPembayaranLine] = useState<any>({});

  const getRekapDashboard = async (tanggalAwal, tanggalAkhir) => {
    try {
      setLoading({ ...loading, rekap: true });
      const res = await getRekapData(tanggalAwal, tanggalAkhir);
      setRekap(res);
    } catch (err) {
      setError(errorHandler(err));
    } finally {
      setLoading({ ...loading, rekap: false });
    }
  };
  const handleTransaksiLine = async (tanggalAwal, tanggalAkhir) => {
    try {
      setLoading({ ...loading, transaksiLine: true });
      const res = await getTransaksiLine(tanggalAwal, tanggalAkhir);
      setTransaksiLine(res);
    } catch (err) {
      setError(errorHandler(err));
    } finally {
      setLoading({ ...loading, transaksiLine: false });
    }
  };
  const handlePembayaranLine = async (tanggalAwal, tanggalAkhir) => {
    try {
      setLoading({ ...loading, pembayaranLine: true });
      const res = await getPembayaranLine(tanggalAwal, tanggalAkhir);
      setPembayaranLine(res);
    } catch (err) {
      setError(errorHandler(err));
    } finally {
      setLoading({ ...loading, pembayaranLine: false });
    }
  };
  return {
    loading,
    rekap,
    message,
    error,
    transaksiLine,
    pembayaranLine,
    getRekapDashboard,
    setError,
    handleTransaksiLine,
    handlePembayaranLine,
  };
};
