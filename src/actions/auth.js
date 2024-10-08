import {
  // REGISTER_SUCCESS,
  // REGISTER_FAIL,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  SET_MESSAGE,
  REFRESH_TOKEN_SUCCESS,
} from "./types";

import AuthService from "../services/auth.service";

// export const register = (username, email, password) => (dispatch) => {
//   return AuthService.register(username, email, password).then(
//     (response) => {
//       dispatch({
//         type: REGISTER_SUCCESS,
//       });

//       dispatch({
//         type: SET_MESSAGE,
//         payload: response.data.message,
//       });

//       return Promise.resolve();
//     },
//     (error) => {
//       const message =
//         (error.response &&
//           error.response.data &&
//           error.response.data.message) ||
//         error.message ||
//         error.toString();

//       dispatch({
//         type: REGISTER_FAIL,
//       });

//       dispatch({
//         type: SET_MESSAGE,
//         payload: message,
//       });

//       return Promise.reject();
//     }
//   );
// };

export const login = (email, password) => (dispatch) => {
  return AuthService.login(email, password).then(
    (data) => {
      const { access_token, refresh_token, user_type } = data;

      localStorage.setItem("access_token", access_token);
      localStorage.setItem("refresh_token", refresh_token);
      localStorage.setItem("user_type", user_type);

      dispatch({
        type: LOGIN_SUCCESS,
        payload: { user: data },
      });

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
};

export const refreshTokenSuccess = (newAccessToken) => ({
  type: REFRESH_TOKEN_SUCCESS,
  payload: newAccessToken,
});

export const logout = () => (dispatch) => {
  AuthService.logout();

  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("user_type");

  dispatch({
    type: LOGOUT,
  });
};
