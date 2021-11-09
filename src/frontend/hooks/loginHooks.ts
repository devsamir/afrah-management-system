import { useState } from "react";
import errorHandler from "../../backend/utils/errorHandler";
import { login } from "../../backend/controllers/loginController";

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (username, password) => {
    try {
      setLoading(true);
      const res = await login(username, password);
      if (res) {
        setIsLogin(true);
      }
    } catch (err) {
      setIsLogin(false);
      setError(errorHandler(err));
    } finally {
      setLoading(false);
    }
  };
  return { loading, isLogin, error, handleLogin, setError };
};
