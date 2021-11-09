import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDashboardSarung } from "../../hooks/Sarung/dashboardSarungHooks";
import { format } from "date-fns";
import Button from "../../components/Button";
import { formatCurrency } from "../../utils/helper";
import TransaksiSarungLine from "../../components/Charts/TransaksiSarungLine";
import PembayaranSarungLine from "../../components/Charts/PembayaranSarungLine";

const DashboardSarung = () => {
  const State = useDashboardSarung();

  const [tanggalAwal, setTanggalAwal] = useState("");
  const [tanggalAkhir, setTanggalAkhir] = useState("");

  const handleTampil = () => {
    State.getRekapDashboard(tanggalAwal, tanggalAkhir);
    State.handleTransaksiLine(tanggalAwal, tanggalAkhir);
    State.handlePembayaranLine(tanggalAwal, tanggalAkhir);
  };

  useEffect(() => {
    const today = format(new Date(), "yyyy-MM-dd");
    const lastWeek = format(
      new Date(new Date().getTime() - 28 * 24 * 60 * 60 * 1000),
      "yyyy-MM-dd"
    );
    setTanggalAwal(lastWeek);
    setTanggalAkhir(today);
    State.getRekapDashboard(lastWeek, today);
    State.handleTransaksiLine(lastWeek, today);
    State.handlePembayaranLine(lastWeek, today);
  }, []);

  // Generate Error Alert
  useEffect(() => {
    if (State.error) toast.error(State.error);
    State.setError("");
  }, [State.error]);
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div>
        <h5>Dashboard Sarung</h5>
        <div className="d-flex align-items-end my-2">
          <div style={{ width: 200 }}>
            <label>Tanggal Awal</label>
            <input
              type="date"
              className="form-control"
              value={tanggalAwal}
              onChange={(e) => setTanggalAwal(e.target.value)}
            />
          </div>
          <span className="mx-2 ">S/d</span>
          <div style={{ width: 200 }}>
            <label>Tanggal Akhir</label>
            <input
              type="date"
              className="form-control"
              value={tanggalAkhir}
              onChange={(e) => setTanggalAkhir(e.target.value)}
            />
          </div>
          <Button variant="primary" className="mx-2" onClick={handleTampil}>
            Tampil
          </Button>
        </div>
        <div className="my-4">
          <div className="my-2">
            <h6>Tabel Transaksi</h6>
            <table className="table">
              <tbody>
                <tr>
                  <td
                    colSpan={2}
                    className="text-center"
                    style={{ fontWeight: 700 }}
                  >
                    Pemasukan
                  </td>
                </tr>
                <tr>
                  <td>Penjualan Sarung</td>
                  <td>{formatCurrency(State.rekap?.maxPenjualan || 0)}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 700 }}>Total</td>
                  <td>
                    <span className="text-success">
                      {formatCurrency(State.rekap?.maxPenjualan || 0)}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td
                    colSpan={2}
                    className="text-center"
                    style={{ fontWeight: 700 }}
                  >
                    Pengeluaran
                  </td>
                </tr>
                <tr>
                  <td>Pembelian Sarung</td>
                  <td>{formatCurrency(State.rekap?.maxPembelian)}</td>
                </tr>
                <tr>
                  <td>Biaya Penjahitan</td>
                  <td>{formatCurrency(State.rekap?.maxPenjahitan)}</td>
                </tr>
                <tr>
                  <td>Biaya Pranggok</td>
                  <td>{formatCurrency(State.rekap?.maxPranggok)}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 700 }}>Total</td>
                  <td>
                    <span className="text-danger">
                      {formatCurrency(State.rekap?.maxPengeluaran || 0)}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 700 }}>Selisih</td>
                  <td>
                    <span
                      className={`${
                        State.rekap?.selisihTransaksi > 0
                          ? "text-success"
                          : "text-danger"
                      }`}
                    >
                      {formatCurrency(State.rekap?.selisihTransaksi || 0)}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="my-2">
              <h6>Chart Transaksi</h6>
              <TransaksiSarungLine data={State.transaksiLine} />
            </div>
          </div>
          <div className="my-2">
            <h6>Tabel Pembayaran</h6>
            <table className="table">
              <tbody>
                <tr>
                  <td
                    colSpan={2}
                    className="text-center"
                    style={{ fontWeight: 700 }}
                  >
                    Pemasukan
                  </td>
                </tr>
                <tr>
                  <td>Penjualan Sarung</td>
                  <td>{formatCurrency(State.rekap?.penjualan || 0)}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 700 }}>Total</td>
                  <td>
                    <span className="text-success">
                      {formatCurrency(State.rekap?.penjualan || 0)}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td
                    colSpan={2}
                    className="text-center"
                    style={{ fontWeight: 700 }}
                  >
                    Pengeluaran
                  </td>
                </tr>
                <tr>
                  <td>Pembelian Sarung</td>
                  <td>{formatCurrency(State.rekap?.pembelian)}</td>
                </tr>
                <tr>
                  <td>Biaya Penjahitan</td>
                  <td>{formatCurrency(State.rekap?.penjahitan)}</td>
                </tr>
                <tr>
                  <td>Biaya Pranggok</td>
                  <td>{formatCurrency(State.rekap?.pranggok)}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 700 }}>Total</td>
                  <td>
                    <span className="text-danger">
                      {formatCurrency(State.rekap?.pengeluaran || 0)}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 700 }}>Selisih</td>
                  <td>
                    <span
                      className={`${
                        State.rekap?.selisihPembayaran > 0
                          ? "text-success"
                          : "text-danger"
                      }`}
                    >
                      {formatCurrency(State.rekap?.selisihPembayaran || 0)}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="my-2">
              <h6>Chart Pembayaran</h6>
              <PembayaranSarungLine data={State.pembayaranLine} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardSarung;
