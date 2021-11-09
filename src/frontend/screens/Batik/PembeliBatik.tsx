import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field, FormikHelpers } from "formik";
import { ToastContainer, toast } from "react-toastify";
import Button from "../../components/Button";
import { usePembeliBatik } from "../../hooks/Batik/pembeliBatikHooks";
import Table, { Columns } from "../../components/Table";

import "react-toastify/dist/ReactToastify.css";
import { MdAdd, MdDelete, MdEdit } from "react-icons/md";
import Confirm from "../../components/Confirm";

const columns: Columns[] = [
  { field: "id", hide: true },
  { field: "namaPembeli", headerName: "Nama Pembeli" },
  { field: "noTelp", headerName: "Nomor Telpon" },
  { field: "noKtp", headerName: "Nomor KTP" },
  { field: "keterangan", headerName: "Keterangan" },
];
const init = {
  namaPembeli: "",
  noKtp: "",
  noTelp: "",
  keterangan: "",
};
const PembeliBatik = () => {
  const State = usePembeliBatik();
  const [modal, setModal] = useState(false);
  const [initialValues, setInitialValues] = useState(() => init);
  const [inputStatus, setInputStatus] = useState<"tambah" | "update">("tambah");
  const [confirm, setConfirm] = useState(false);

  // DATATABLE
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<any>({ field: "", direction: "" });
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState("");
  // HANDLER
  const handleOpen = () => {
    setModal(true);
    setInitialValues(init);
    setInputStatus("tambah");
  };

  // Handle Submit Create or Update
  const handleSubmit: any = (values, helper: FormikHelpers<any>) => {
    if (inputStatus === "tambah") {
      State.handleCreate(values, () => {
        helper.resetForm();
        setModal(false);
        State.handleGetAll(page, limit, sort, search);
      });
    } else if (inputStatus === "update") {
      State.handleUpdate(selected, values, () => {
        helper.resetForm();
        setModal(false);
        State.handleGetAll(page, limit, sort, search);
        setSelected("");
      });
    }
  };
  // Handle Update
  const handleUpdate = async () => {
    const one = await State.handleGetOne(selected);

    if (one) {
      setInitialValues({
        namaPembeli: one.namaPembeli,
        noTelp: one.noTelp,
        noKtp: one.noKtp,
        keterangan: one.keterangan,
      });
      setInputStatus("update");
      setModal(true);
    }
  };

  // Handle Delete
  const handleDelete = async () => {
    await State.handleDelete(selected, () => {
      setSelected("");
      State.handleGetAll(page, limit, sort, search);
    });
    setConfirm(false);
  };

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
    if (page && limit && sort && search !== undefined) {
      State.handleGetAll(page, limit, sort, search);
      setSelected("");
    }
  }, [page, limit, sort, search]);
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
        <h5>Pembeli Batik</h5>
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
            label="(By: Nama Pembeli, KTP, No Telpon)"
          />
        </div>
      </div>
      <Modal show={modal} onHide={setModal.bind(this, false)}>
        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
          <Form>
            <Modal.Header>
              <Modal.Title className="text-capitalize">
                {inputStatus} data pembeli batik
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="form-group my-2">
                <label>
                  Nama Pembeli<span className="text-danger">*</span>
                </label>
                <Field
                  className="form-control"
                  name="namaPembeli"
                  placeholder="Masukan Nama Pembeli"
                />
              </div>
              <div className="form-group my-2">
                <label>Nomor Telpon</label>
                <Field
                  className="form-control"
                  name="noTelp"
                  placeholder="Masukan Nomor Telpon"
                />
              </div>
              <div className="form-group my-2">
                <label>Nomor KTP</label>
                <Field
                  className="form-control"
                  name="noKtp"
                  placeholder="Masukan Nomor KTP"
                />
              </div>
              <div className="form-group my-2">
                <label>Keterangan</label>
                <Field
                  className="form-control"
                  component="textarea"
                  rows="3"
                  name="keterangan"
                  placeholder="Masukan Keterangan"
                />
              </div>
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
          </Form>
        </Formik>
      </Modal>
    </>
  );
};

export default PembeliBatik;
