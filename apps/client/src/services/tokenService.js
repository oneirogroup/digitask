import axios from "axios";
import { store } from "../store"; // Import your Redux store
import { refreshTokenSuccess, logout } from "../actions/auth"; // Update with your actual auth actions

const setupAxiosInterceptors = () => {
  axios.interceptors.request.use(
    async (config) => {
      const state = store.getState();
      const accessToken = state.auth.accessToken; // Get current access token from Redux

      if (accessToken) {
        config.headers["Authorization"] = `Bearer ${accessToken}`;
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;

      if (
        error.response &&
        error.response.status === 403 &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true;
        const state = store.getState();
        const refreshToken = state.auth.refreshToken;

        if (refreshToken) {
          try {
            // Attempt to refresh the access token
            const response = await axios.post(
              "http://135.181.42.192/accounts/token/refresh/",
              {
                refresh: refreshToken,
              }
            );

            // Update the access token in Redux
            store.dispatch(refreshTokenSuccess(response.data.access));

            // Retry the original request with the new access token
            axios.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${response.data.access}`;
            originalRequest.headers[
              "Authorization"
            ] = `Bearer ${response.data.access}`;
            return axios(originalRequest);
          } catch (error) {
            // If refresh fails, log the user out
            store.dispatch(logout());
            return Promise.reject(error);
          }
        }
      }

      return Promise.reject(error);
    }
  );
};

export default setupAxiosInterceptors;
