import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field, FormikHelpers } from "formik";
import { ToastContainer, toast } from "react-toastify";
import Button from "../components/Button";
import Table, { Columns } from "../components/Table";
import { useUser } from "../hooks/userHooks";

import "react-toastify/dist/ReactToastify.css";
import { MdAdd, MdDelete, MdEdit } from "react-icons/md";
import Confirm from "../components/Confirm";

const columns: Columns[] = [
  { field: "id", hide: true },
  { field: "username", headerName: "Username" },
];
const PranggokSarung = () => {
  const State = useUser();
  const [modal, setModal] = useState(false);
  const [inputStatus, setInputStatus] = useState<"tambah" | "update">("tambah");
  const [confirm, setConfirm] = useState(false);

  // DATATABLE
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<any>({ field: "", direction: "" });
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState("");

  //   form
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setRepassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  // HANDLER
  const handleOpen = () => {
    setModal(true);
    setInputStatus("tambah");
  };
  const resetForm = () => {
    setUsername("");
    setPassword("");
    setRepassword("");
    setOldPassword("");
  };
  // Handle Submit Create or Update
  const handleSubmit: any = (e) => {
    e.preventDefault();
    if (inputStatus === "tambah") {
      const body = { username, password, repassword };
      State.handleCreate(body, () => {
        resetForm();
        setModal(false);
        State.handleGetAll(page, limit, sort, search);
      });
    } else if (inputStatus === "update") {
      const body = { username, password, repassword, oldPassword };
      State.handleUpdate(selected, body, () => {
        resetForm();
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
      setUsername(one.username);
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
        <h5>Pranggok Sarung</h5>
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
            label="(By: Username)"
          />
        </div>
      </div>
      <Modal show={modal} onHide={setModal.bind(this, false)}>
        <form onSubmit={handleSubmit}>
          <Modal.Header>
            <Modal.Title className="text-capitalize">
              {inputStatus} data user
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="form-group my-2">
              <label>Username</label>
              <input
                type="text"
                className="form-control"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            {inputStatus === "update" && (
              <div className="form-group my-2">
                <label>Password Lama</label>
                <input
                  type="password"
                  className="form-control"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                />
              </div>
            )}
            <div className="form-group my-2">
              <label>Password Baru</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="form-group my-2">
              <label>Re-Password</label>
              <input
                type="password"
                className="form-control"
                value={repassword}
                onChange={(e) => setRepassword(e.target.value)}
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
        </form>
      </Modal>
    </>
  );
};

export default PranggokSarung;
