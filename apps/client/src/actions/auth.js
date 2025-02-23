import refreshAccessToken from "../common/refreshToken";
import { setAuthToken } from "../common/setAuthToken";
import AuthService from "../services/auth.service";
import { LOGIN_FAIL, LOGIN_SUCCESS, LOGOUT, REFRESH_TOKEN_SUCCESS, SET_MESSAGE } from "./types";

export const login = (email, password) => async dispatch => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");

  try {
    const data = await AuthService.login(email, password);

    if (!data || !data.access_token || !data.refresh_token) {
      throw new Error("Invalid login response. Token data is missing.");
    }

    const { access_token, refresh_token, user_type, is_admin, position } = data;

    localStorage.setItem("access_token", access_token);
    localStorage.setItem("refresh_token", refresh_token);
    localStorage.setItem("user_type", user_type);
    localStorage.setItem("is_admin", is_admin);
    localStorage.setItem("position", JSON.stringify(position));

    setAuthToken(access_token);

    dispatch({
      type: LOGIN_SUCCESS,
      payload: { user: data }
    });

    return Promise.resolve();
  } catch (error) {
    if (error.response.status === 403) {
      try {
        const newAccessToken = await refreshAccessToken();
        setAuthToken(newAccessToken);

        dispatch({
          type: REFRESH_TOKEN_SUCCESS,
          payload: newAccessToken
        });

        return dispatch(login(email, password));
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);

        dispatch({
          type: LOGIN_FAIL
        });

        dispatch({
          type: SET_MESSAGE,
          payload: "Token refresh failed. Please log in again."
        });

        return Promise.reject(refreshError);
      }
    }

    const message =
      (error.response && error.response.data && error.response.data.message) || error.message || error.toString();

    dispatch({
      type: LOGIN_FAIL
    });

    dispatch({
      type: SET_MESSAGE,
      payload: message
    });

    return Promise.reject(error);
  }
};

export const refreshTokenSuccess = newAccessToken => ({
  type: REFRESH_TOKEN_SUCCESS,
  payload: newAccessToken
});

export const logout = () => dispatch => {
  AuthService.logout();

  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("is_admin");

  dispatch({
    type: LOGOUT
  });
};
