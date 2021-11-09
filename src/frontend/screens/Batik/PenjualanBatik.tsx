import React, { useState, useEffect, useRef } from "react";
import { Modal } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import {
  MdAdd,
  MdDelete,
  MdLibraryBooks,
  MdEdit,
  MdPayment,
  MdPrint,
} from "react-icons/md";
import ReactToPrint from "react-to-print";
import Select from "react-select";
import { v4 } from "uuid";
import "react-toastify/dist/ReactToastify.css";

import Confirm from "../../components/Confirm";
import CurrencyInput from "../../components/CurrencyInput";
import Button from "../../components/Button";
import { usePenjualanBatik } from "../../hooks/Batik/penjualanBatikHooks";
import Table, { Columns } from "../../components/Table";
import { formatCurrency, formatNumber } from "../../utils/helper";

const columns: Columns[] = [
  { field: "id", hide: true },
  { field: "tanggal", headerName: "Tanggal" },
  { field: "namaPembeli", headerName: "Nama Pembeli" },
  { field: "total", headerName: "Total", formatter: formatCurrency },
  { field: "sisaTagihan", headerName: "Piutang", formatter: formatCurrency },
];

const PenjualanBatik = () => {
  const State = usePenjualanBatik();
  const printRef = useRef();
  const [modal, setModal] = useState(false);
  const [modalBarang, setModalBarang] = useState(false);
  const [modalPiutang, setModalPiutang] = useState(false);
  const [inputStatus, setInputStatus] = useState<"tambah" | "update">("tambah");
  const [inputStatusP, setInputStatusP] = useState<"tambah" | "update">(
    "tambah"
  );
  const [confirm, setConfirm] = useState(false);
  const [rentang, setRentang] = useState(false);

  // DATATABLE
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<any>({ field: "", direction: "" });
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState("");
  const [filter, setFilter] = useState({ value: "semua", label: "Semua" });
  const [tanggalAwal, setTanggalAwal] = useState("");
  const [tanggalAkhir, setTanggalAkhir] = useState("");
  const [status, setStatus] = useState({ value: "semua", label: "Semua" });
  //   FORM
  const [tanggal, setTanggal] = useState("");
  const [keterangan, setKeterangan] = useState("");
  const [pembeli, setPembeli] = useState<any>({});
  const [detail, setDetail] = useState([]);
  // Detail Form
  const [namaBatik, setNamaBatik] = useState("");
  const [harga, setHarga] = useState("");
  const [jumlah, setJumlah] = useState("");
  const [total, setTotal] = useState("");

  // Form Piutang
  const [piutangList, setPiutangList] = useState([]);
  const [modalInputPiutang, setModalInputPiutang] = useState(false);
  const [tanggalP, setTanggalP] = useState("");
  const [totalP, setTotalP] = useState(0);
  const [tagihanP, setTagihanP] = useState(0);
  const [keteranganP, setKeteranganP] = useState("");
  const [pembeliP, setPembeliP] = useState("");
  const [detailP, setDetailP] = useState([]);
  // Input Piutang
  const [idPiutang, setIdPiutang] = useState("");
  const [tanggalPiutang, setTanggalPiutang] = useState("");
  const [pembayaranPiutang, setPembayaranPiutang] = useState("");
  const [keteranganPiutang, setKeteranganPiutang] = useState("");
  const [batasBayar, setBatasBayar] = useState(0);
  // HANDLER
  const handleOpen = () => {
    setModal(true);
    setInputStatus("tambah");
  };
  // reset form
  const resetFormDetail = () => {
    setNamaBatik("");
    setHarga("");
    setJumlah("");
    setTotal("");
  };
  const resetForm = () => {
    setTanggal("");
    setKeterangan("");
    setPembeli({});
    setDetail([]);
  };
  const getAllPiutang = async () => {
    State.handleGetAll(
      filter.value,
      page,
      limit,
      sort,
      search,
      rentang,
      tanggalAwal,
      tanggalAkhir,
      status.value
    );
    State.handlePrint(
      filter.value,
      search,
      rentang,
      tanggalAwal,
      tanggalAkhir,
      status
    );
  };
  const getRekapPiutang = async () => {
    await State.handleGetRekap(
      filter.value,
      rentang,
      tanggalAwal,
      tanggalAkhir,
      status.value
    );
  };
  // Handle Submit Create or Update
  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputStatus === "tambah") {
      const body = {
        tanggal,
        detail,
        keterangan,
        idPembeli: pembeli.value,
      };
      State.handleCreate(body, () => {
        resetForm();
        setModal(false);
        getAllPiutang();
        getRekapPiutang();
      });
    } else if (inputStatus === "update") {
      const body = {
        tanggal,
        detail,
        keterangan,
        idPembeli: pembeli.value,
      };

      State.handleUpdate(selected, body, () => {
        resetForm();
        setModal(false);
        getAllPiutang();
        getRekapPiutang();
        setSelected("");
      });
    }
  };
  // Handle Update
  const handleUpdate = async () => {
    const one = await State.handleGetOne(selected);

    if (one) {
      setTanggal(one.tanggal);
      setDetail(one.detail);
      setKeterangan(one.keterangan);
      setPembeli({ value: one.idPembeli, label: one.namaPembeli });
      setInputStatus("update");
      setModal(true);
    }
  };

  // Handle Delete
  const handleDelete = async () => {
    await State.handleDelete(selected, () => {
      setSelected("");

      getAllPiutang();
      getRekapPiutang();
    });
    setConfirm(false);
  };
  const handleGetPiutang = async () => {
    const piutang = await State.handleGetDetail(selected);
    if (piutang) {
      setPembeliP(piutang.penjualan.namaPembeli);
      setTanggalP(piutang.penjualan.tanggal);
      setTotalP(piutang.penjualan.total);
      setTagihanP(piutang.penjualan.sisaTagihan);
      setKeteranganP(piutang.penjualan.keterangan);
      setDetailP(piutang.penjualan.detail);
      setModalPiutang(true);
      setPiutangList(piutang.piutang);
    }
  };
  const resetFormPiutang = () => {
    setTanggalPiutang("");
    setPembayaranPiutang("");
    setKeteranganPiutang("");
  };
  const handleSubmitPiutang = async (e) => {
    e.preventDefault();
    if (inputStatusP === "tambah") {
      const body = {
        tanggal: tanggalPiutang,
        pembayaran: pembayaranPiutang,
        keterangan: keteranganPiutang,
        idPenjualan: selected,
      };
      await State.handleCreatePiutang(body, () => {
        setModalInputPiutang(false);
        resetFormPiutang();
        handleGetPiutang();
        getAllPiutang();
        getRekapPiutang();
      });
    } else if (inputStatusP === "update") {
      const body = {
        tanggal: tanggalPiutang,
        pembayaran: pembayaranPiutang,
        keterangan: keteranganPiutang,
        idPenjualan: selected,
      };
      await State.handleUpdatePiutang(idPiutang, body, () => {
        setModalInputPiutang(false);
        resetFormPiutang();
        handleGetPiutang();
        getAllPiutang();
        getRekapPiutang();
      });
    }
  };
  const handleUpdatePiutang = (id) => {
    const one = piutangList.find((item) => item.id === id);
    if (one) {
      setIdPiutang(one.id);
      setTanggalPiutang(one.tanggal);
      setPembayaranPiutang(`${one.pembayaran}`);
      setBatasBayar(one.pembayaran);
      setKeteranganPiutang(one.keterangan);
      setInputStatusP("update");
      setModalInputPiutang(true);
    }
  };
  const handleDeletePiutang = (id) => {
    State.handleDeletePiutang(id, () => {
      handleGetPiutang();
      getAllPiutang();
      getRekapPiutang();
    });
  };
  const handleTambahBarang = (e) => {
    e.preventDefault();
    const body = { id: v4(), namaBatik, jumlah, harga, total };
    setDetail([...detail, body]);
    resetFormDetail();
    setModalBarang(false);
  };
  const handleDeleteBarang = (id) => {
    const filteredDetail = detail.filter((item) => item.id !== id);
    setDetail(filteredDetail);
  };
  // Set Total Harga Automatic
  useEffect(() => {
    if (harga && jumlah) {
      setTotal(`${Number(harga) * Number(jumlah)}`);
    } else {
      setTotal("");
    }
  }, [harga, jumlah]);
  // Generate Success Alert
  useEffect(() => {
    if (State.message) toast.success(State.message);
    State.setMessage("");
  }, [State.message]);

  // Generate Error Alert
  useEffect(() => {
    if (State.error) toast.error(State.error);
    State.setError("");
  }, [State.error]);
  // Datatable Use Effect
  useEffect(() => {
    if (filter && page && limit && sort && search !== undefined && status) {
      getAllPiutang();
      setSelected("");
    }
  }, [
    filter,
    page,
    limit,
    sort,
    search,
    rentang,
    tanggalAwal,
    tanggalAkhir,
    status,
  ]);
  useEffect(() => {
    getRekapPiutang();
  }, [filter, rentang, tanggalAwal, tanggalAkhir, status]);
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
      <Confirm
        show={confirm}
        isLoading={State.loading?.delete}
        handleClose={setConfirm.bind(this, false)}
        handleConfirm={handleDelete}
      />
      <div>
        <h5>Penjualan Batik</h5>
        {!selected && (
          <Button
            variant="primary"
            onClick={handleOpen}
            startIcon={<MdAdd />}
            className="mx-2"
          >
            Tambah
          </Button>
        )}
        {!selected && (
          <ReactToPrint
            onAfterPrint={() => {}}
            pageStyle={"margin:2rem 0"}
            trigger={() => (
              <Button
                variant="success"
                onClick={handleOpen}
                startIcon={<MdPrint />}
                className="mx-2"
                isLoading={State.loading?.print}
              >
                Print
              </Button>
            )}
            content={() => {
              return printRef.current;
            }}
          />
        )}
        {selected && (
          <Button
            variant="info"
            onClick={handleGetPiutang}
            startIcon={<MdLibraryBooks />}
            className="mx-2"
            isLoading={State.loading?.getDetail}
          >
            Piutang
          </Button>
        )}
        {selected && (
          <Button
            variant="warning"
            onClick={handleUpdate}
            startIcon={<MdEdit />}
            className="mx-2"
            isLoading={State.loading?.getOne}
          >
            Update
          </Button>
        )}
        {selected && (
          <Button
            variant="danger"
            onClick={setConfirm.bind(this, true)}
            startIcon={<MdDelete />}
            className="mx-2"
          >
            Delete
          </Button>
        )}
        <div className="my-4">
          <div className="d-flex">
            <div style={{ width: 200 }} className="mx-2">
              <label>Pembeli</label>
              <Select
                value={filter}
                options={[
                  { value: "semua", label: "Semua" },
                  ...State.pembeliFilter.map((item) => ({
                    value: item.id,
                    label: item.namaPembeli,
                  })),
                ]}
                onChange={(value) => setFilter(value)}
              />
            </div>
            <div style={{ width: 200 }} className="mx-2">
              <label>Status</label>
              <Select
                value={status}
                options={[
                  { value: "semua", label: "Semua" },
                  { value: "belum", label: "Belum Lunas" },
                  { value: "lunas", label: "Sudah Lunas" },
                ]}
                onChange={(value) => setStatus(value)}
              />
            </div>
          </div>
          <div className="my-2">
            <div style={{ width: 200 }}>
              <input
                className="form-check-input mx-2"
                type="checkbox"
                checked={rentang}
                onChange={setRentang.bind(this, !rentang)}
              />
              <label>Rentang Tanggal</label>
            </div>
            {rentang && (
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
              </div>
            )}
          </div>
          <div className="row my-2 p-4 box-shadow">
            <div className="col-3 d-flex flex-column">
              <span className="text-gray">Total Transaksi</span>
              <span className="text-white font-weight-bold">
                {State.rekap?.transaksi || 0}
              </span>
            </div>
            <div className="col-3 d-flex flex-column">
              <span className="text-gray">Total Nominal Penjualan</span>
              <span className="text-white font-weight-bold">
                {formatCurrency(State.rekap?.total || 0)}
              </span>
            </div>
            <div className="col-3 d-flex flex-column">
              <span className="text-gray">Sisa Piutang</span>
              <span className="text-white font-weight-bold">
                {formatCurrency(State.rekap?.piutang || 0)}
              </span>
            </div>
            <div className="col-3 d-flex flex-column">
              <span className="text-gray">Piutang Terbayar</span>
              <span className="text-white font-weight-bold">
                {formatCurrency(State.rekap?.terbayar || 0)}
              </span>
            </div>
            <div className="col-6 d-flex flex-column align-items-center mt-4">
              <span className="text-gray">Total Keuntungan (10%)</span>
              <span className="text-white font-weight-bold">
                {formatCurrency(State.rekap?.maxProfit || 0)}
              </span>
            </div>
            <div className="col-6 d-flex flex-column align-items-center mt-4">
              <span className="text-gray">Keuntungan Masuk (10%)</span>
              <span className="text-success font-weight-bold">
                {formatCurrency(State.rekap?.profit || 0)}
              </span>
            </div>
          </div>
          <Table
            columns={columns}
            data={State.data}
            result={State.result}
            limit={limit}
            setLimit={setLimit}
            loading={State.loading?.get}
            page={page}
            setPage={setPage}
            setSearch={setSearch}
            setSort={setSort}
            sort={sort}
            selected={selected}
            setSelected={setSelected}
            label="(By: Tanggal & Nama Pembeli)"
          />
        </div>
      </div>
      <Modal size="xl" show={modal} onHide={setModal.bind(this, false)}>
        <form onSubmit={handleSubmit}>
          <Modal.Header>
            <Modal.Title className="text-capitalize">
              {inputStatus} penjualan batik
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {inputStatus === "update" && (
              <span className="text-danger">
                * Mengupdate Data Pembelian Akan Menghapus Semua Transaksi
                Pembayaran Piutang
              </span>
            )}
            <div className="form-group my-2">
              <label>Pembeli</label>
              <Select
                value={pembeli}
                options={State.pembeliAdd.map((item) => ({
                  value: item.id,
                  label: item.namaPembeli,
                }))}
                onChange={(value) => setPembeli(value)}
              />
            </div>
            <div className="form-group my-2">
              <label>
                Tanggal Penjualan<span className="text-danger">*</span>
              </label>
              <input
                className="form-control"
                type="date"
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
              />
            </div>
            <div className="form-group my-2">
              <label>Keterangan</label>
              <textarea
                rows={3}
                className="form-control"
                value={keterangan}
                onChange={(e) => setKeterangan(e.target.value)}
              ></textarea>
            </div>
            <Button
              variant="success"
              className="my-2"
              onClick={setModalBarang.bind(this, true)}
            >
              Tambah Barang
            </Button>
            <table className="table my-2">
              <thead>
                <tr>
                  <th>Nama Batik</th>
                  <th>Jumlah</th>
                  <th>Harga</th>
                  <th>Total</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {detail.map((item, index) => (
                  <tr key={item.id}>
                    <td>{item.namaBatik}</td>
                    <td>{formatNumber(item.jumlah)}</td>
                    <td>{formatCurrency(item.harga)}</td>
                    <td>{formatCurrency(item.total)}</td>
                    <td>
                      <button
                        type="button"
                        className="text-danger btn"
                        onClick={handleDeleteBarang.bind(this, item.id)}
                      >
                        <MdDelete />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={setModal.bind(this, false)}>
              Close
            </Button>
            <Button
              type="submit"
              variant={inputStatus === "update" ? "warning" : "primary"}
              isLoading={State.loading?.submit}
            >
              {inputStatus === "update" ? <>Update</> : <>Simpan</>}
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
      {/* MODAL BARANG */}
      <Modal show={modalBarang} onHide={setModalBarang.bind(this, false)}>
        <form onSubmit={handleTambahBarang}>
          <Modal.Header>
            <Modal.Title className="text-capitalize">Tambah Barang</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="form-group">
              <label>Nama Batik</label>
              <input
                type="text"
                className="form-control"
                value={namaBatik}
                onChange={(e) => setNamaBatik(e.target.value)}
                placeholder="Masukan Nama Batik"
              />
            </div>
            <div className="form-group">
              <label>Jumlah</label>
              <CurrencyInput
                onChange={(value) => setJumlah(value)}
                value={jumlah}
                className="form-control"
                placeholder="Masukan Jumlah Batik"
              />
            </div>
            <div className="form-group">
              <label>Harga</label>
              <CurrencyInput
                onChange={(value) => setHarga(value)}
                value={harga}
                className="form-control"
                placeholder="Masukan Harga Batik"
                prefix="Rp. "
              />
            </div>
            <div className="form-group my-2">
              <label>Total Harga</label>
              <CurrencyInput
                onChange={() => {}}
                value={total}
                className="form-control"
                placeholder="Masukan Jumlah & Harga Sarung"
                prefix="Rp. "
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={setModalBarang.bind(this, false)}
            >
              Close
            </Button>
            <Button variant="success" type="submit">
              Tambah
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
      {/* MODAL PIUTANG */}
      <Modal
        show={modalPiutang}
        onHide={() => {
          setModalPiutang(false);
          setSelected("");
        }}
        fullscreen={true}
      >
        <Modal.Header>
          <Modal.Title className="text-capitalize">
            piutang pembelian sarung
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-6">
              <label>Pembeli</label>
              <input type="text" className="form-control" value={pembeliP} />
            </div>
            <div className="col-6">
              <label>Tanggal</label>
              <input type="text" className="form-control" value={tanggalP} />
            </div>
            <div className="col-6">
              <label>Nominal Total</label>
              <input
                type="text"
                className="form-control"
                value={formatCurrency(totalP)}
              />
            </div>
            <div className="col-6">
              <label>Sisa Piutang</label>
              <input
                type="text"
                className="form-control"
                value={formatCurrency(tagihanP)}
              />
            </div>
            <div className="col-6">
              <label>Keterangan</label>
              <textarea value={keteranganP} className="form-control"></textarea>
            </div>
          </div>
          <div>
            <Button
              variant="success"
              startIcon={<MdPayment />}
              className="m-2"
              onClick={() => {
                setModalInputPiutang(true);
                setInputStatusP("tambah");
                resetFormPiutang();
              }}
            >
              Bayar
            </Button>
            <div className="row">
              <div className="col-12 col-md-6">
                <h6>Tabel Pembayaran Piutang</h6>
                <div className="table-responsive my-4">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>Tanggal</th>
                        <th>Nominal Pembayaran</th>
                        <th>Keterangan</th>
                        <th>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {piutangList.map((item) => (
                        <tr key={item.id}>
                          <td>{item.tanggal}</td>
                          <td>{formatCurrency(item.pembayaran)}</td>
                          <td>{item.keterangan}</td>
                          <td>
                            <button
                              className="btn text-warning"
                              onClick={handleUpdatePiutang.bind(this, item.id)}
                            >
                              <MdEdit />
                            </button>
                            <button
                              className="btn text-danger"
                              onClick={handleDeletePiutang.bind(this, item.id)}
                            >
                              <MdDelete />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="col-12 col-md-6">
                <h6>Tabel Detail Transaksi</h6>
                <div className="table-responsive my-4">
                  <table className="table my-2">
                    <thead>
                      <tr>
                        <th>Nama Batik</th>
                        <th>Jumlah</th>
                        <th>Harga</th>
                        <th>Total</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {detailP.map((item, index) => (
                        <tr key={item.id}>
                          <td>{item.namaBatik}</td>
                          <td>{formatNumber(item.jumlah)}</td>
                          <td>{formatCurrency(item.harga)}</td>
                          <td>{formatCurrency(item.total)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setModalPiutang(false);
              setSelected("");
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={modalInputPiutang}
        onHide={setModalInputPiutang.bind(this, false)}
      >
        <form onSubmit={handleSubmitPiutang}>
          <Modal.Header>
            <Modal.Title className="text-capitalize">
              {inputStatusP} piutang pembelian sarung
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="form-group my-2">
              <label>
                Tanggal Piutang<span className="text-danger">*</span>
              </label>
              <input
                className="form-control"
                type="date"
                value={tanggalPiutang}
                onChange={(e) => setTanggalPiutang(e.target.value)}
              />
            </div>
            <div className="form-group my-2">
              <label>
                Nominal Pembayaran<span className="text-danger">*</span>
              </label>
              <CurrencyInput
                onChange={(value) => {
                  if (inputStatusP === "tambah") {
                    if (Number(value || 0) <= tagihanP)
                      setPembayaranPiutang(value);
                  } else if (inputStatusP === "update") {
                    if (Number(value || 0) <= tagihanP + batasBayar) {
                      setPembayaranPiutang(value);
                    }
                  }
                }}
                value={pembayaranPiutang}
                className="form-control"
                placeholder="Masukan Nominal Pembayaran"
                prefix="Rp. "
              />
            </div>
            <div className="form-group my-2">
              <label>Keterangan</label>
              <textarea
                rows={3}
                className="form-control"
                value={keteranganPiutang}
                onChange={(e) => setKeteranganPiutang(e.target.value)}
              ></textarea>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={setModalInputPiutang.bind(this, false)}
            >
              Close
            </Button>
            <Button
              type="submit"
              variant={inputStatusP === "update" ? "warning" : "success"}
              isLoading={State.loading?.submitPiutang}
            >
              {inputStatusP === "update" ? <>Update</> : <>Simpan</>}
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
      <div className="d-none">
        <div className="bg-white p-5" ref={printRef}>
          <div>
            <h4 className="text-center custom-title-black mb-4">
              Laporan Penjualan Batik Afrah Collections
            </h4>
          </div>
          <div className="d-flex flex-column my-2 p-4">
            <div className="d-flex justify-content-between border-bottom">
              <span className="custom-text-black">Total Transaksi</span>
              <span className="custom-text-black font-weight-bold">
                {State.rekap?.transaksi || 0}
              </span>
            </div>
            <div className="d-flex justify-content-between border-bottom">
              <span className="custom-text-black">Total Nominal Pembelian</span>
              <span className="custom-text-black font-weight-bold">
                {formatCurrency(State.rekap?.total || 0)}
              </span>
            </div>
            <div className="d-flex justify-content-between border-bottom">
              <span className="custom-text-black">Sisa Piutang</span>
              <span className="custom-text-black font-weight-bold">
                {formatCurrency(State.rekap?.piutang || 0)}
              </span>
            </div>
            <div className="d-flex justify-content-between border-bottom">
              <span className="custom-text-black">Piutang Terbayar</span>
              <span className="custom-text-black font-weight-bold">
                {formatCurrency(State.rekap?.terbayar || 0)}
              </span>
            </div>
            <div className="d-flex justify-content-between border-bottom">
              <span className="custom-text-black">Total Keuntungan (10%)</span>
              <span className="custom-text-black font-weight-bold">
                {formatCurrency(State.rekap?.maxProfit || 0)}
              </span>
            </div>
            <div className="d-flex justify-content-between border-bottom">
              <span className="custom-text-black">Keuntungan Masuk (10%)</span>
              <span className="custom-text-black font-weight-bold">
                {formatCurrency(State.rekap?.profit || 0)}
              </span>
            </div>
          </div>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th className="custom-text-black font-weight-bold">Tanggal</th>
                <th className="custom-text-black font-weight-bold">
                  Nama Pembeli
                </th>
                <th className="custom-text-black font-weight-bold">Total</th>
                <th className="custom-text-black font-weight-bold">
                  Sisa Piutang
                </th>
              </tr>
            </thead>
            <tbody>
              {State.dataPrint.map((item) => (
                <tr key={item.id}>
                  <td className="custom-text-black">{item.tanggal}</td>
                  <td className="custom-text-black">{item.namaPembeli}</td>
                  <td className="custom-text-black">
                    {formatCurrency(item.total)}
                  </td>
                  <td className="custom-text-black">
                    {formatCurrency(item.sisaTagihan)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default PenjualanBatik;
