import axios from "axios";

import { refreshAccessToken } from "../actions/authActions";

const setupInterceptors = store => {
  axios.interceptors.request.use(
    async config => {
      const token = localStorage.getItem("access_token");

      if (token) {
        config.headers["Authorization"] = "Bearer " + token;
      }

      return config;
    },
    error => {
      return Promise.reject(error);
    }
  );

  axios.interceptors.response.use(
    response => {
      return response;
    },
    async error => {
      const originalRequest = error.config;

      if (error.response && error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          await store.dispatch(refreshAccessToken());
          return axios(originalRequest); // Yenilənmiş token ilə sorğunu təkrarla
        } catch (err) {
          return Promise.reject(err);
        }
      }

      return Promise.reject(error);
    }
  );
};

export default setupInterceptors;
