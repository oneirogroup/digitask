import axios from "axios";
import { useNavigate } from "react-router-dom";

const useRefreshToken = () => {
  const navigate = useNavigate();
  const refreshAccessToken = async () => {
    const refresh_token = localStorage.getItem("refresh_token");
    if (!refresh_token) {
      localStorage.removeItem("access_token");
      navigate("/login/");
      throw new Error("No refresh token available");
    }
    try {
      const response = await axios.post("http://37.61.77.5/accounts/token/refresh/", { refresh: refresh_token });
      const { access } = response.data;
      localStorage.setItem("access_token", access);
      axios.defaults.headers.common["Authorization"] = `Bearer ${access}`;
    } catch (error) {
      navigate("/login/");
      throw error;
    }
  };

  return refreshAccessToken;
};

export default useRefreshToken;
