import AuthService from "../services/auth.service";
import { setAuthToken } from "../common/setAuthToken";
import { refreshTokenSuccess } from "./auth";
import { LOGIN_FAIL, SET_MESSAGE } from "./types";

export const refreshAccessToken = () => (dispatch) => {
  const refresh_token = localStorage.getItem("refresh_token");

  if (refresh_token) {
    return AuthService.refreshAccessToken(refresh_token).then(
      (data) => {
        const { access_token } = data;
        localStorage.setItem("access_token", access_token);

        setAuthToken(access_token);

        dispatch(refreshTokenSuccess(access_token));

        return Promise.resolve();
      },
      (error) => {
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        dispatch({
          type: LOGIN_FAIL,
        });

        dispatch({
          type: SET_MESSAGE,
          payload: message,
        });

        return Promise.reject();
      }
    );
  }
};
