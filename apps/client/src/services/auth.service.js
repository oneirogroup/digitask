import axios from "axios";

import axiosInstance from "../actions/axiosInstance";

const API_URL = "http://37.61.77.5/accounts/";

// const register = (username, email, password) => {
//   return axios.post(API_URL + "register", {
//     username,
//     email,
//     password,
//   });
// };

const refreshAccessToken = refresh_token => {
  return axios.post(API_URL + "token/refresh/", { refresh: refresh_token }).then(response => response.data);
};

const scheduleTokenRefresh = refresh_token => {
  const tokenPayload = JSON.parse(atob(refresh_token.split(".")[1]));
  const expiryTime = tokenPayload.exp * 1000 - Date.now();

  const refreshTime = expiryTime - 60000;

  setTimeout(() => {
    refreshAccessToken(refresh_token)
      .then(newTokens => {
        localStorage.setItem("access_token", newTokens.access_token);
        scheduleTokenRefresh(newTokens.refresh_token);
      })
      .catch(error => {
        console.error("Token refresh failed", error);
        logout();
      });
  }, refreshTime);
};

const login = async (email, password) => {
  try {
    const response = await axiosInstance.post(API_URL + "login/", {
      email,
      password
    });

    if (response.data.access_token && response.data.refresh_token) {
      localStorage.setItem("access_token", response.data.access_token);
      localStorage.setItem("refresh_token", response.data.refresh_token);

      scheduleTokenRefresh(response.data.refresh_token);
    }

    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 403) {
      try {
        const newAccessToken = await refreshAccessToken();
        localStorage.setItem("access_token", newAccessToken);

        // Yeni token ile login işlemini tekrar dene
        return await login(email, password);
      } catch (refreshError) {
        console.error("Token yenileme başarısız:", refreshError);
        throw refreshError;
      }
    }

    throw error;
  }
};
const logout = () => {
  localStorage.removeItem("user");
};

export default {
  // register,
  login,
  logout
};
