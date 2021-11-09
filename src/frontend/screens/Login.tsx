import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import Button from "../components/Button";

const Login = ({ state }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    state.handleLogin(username, password);
    setUsername("");
    setPassword("");
  };

  // Generate Error Alert
  useEffect(() => {
    if (state.error) toast.error(state.error);
    state.setError("");
  }, [state.error]);
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
      <div className="min-vw-100 min-vh-100 d-flex align-items-center justify-content-center">
        <div className="bg-secondary p-5 rounded">
          <h4 className="text-center">Login</h4>
          <form onSubmit={handleSubmit}>
            <div className="form-group py-2">
              <label>Username</label>
              <input
                type="text"
                className="form-control"
                placeholder="Masukan Username..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="form-group py-2">
              <label>Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Masukan Password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              isLoading={state.loading}
              className="mt-2"
            >
              Login
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
