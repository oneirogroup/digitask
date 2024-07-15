// authReducer.js
import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT,
  REFRESH_TOKEN,
} from "./actionTypes";

const initialState = {
  isLoggedIn: false,
  accessToken: null,
  refreshToken: null,
  userType: null,
  isAdmin: false,
  loading: false,
  message: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
      return { ...state, loading: true, message: null };
    case LOGIN_SUCCESS:
      return {
        ...state,
        isLoggedIn: true,
        accessToken: action.payload.access_token,
        refreshToken: action.payload.refresh_token,
        userType: action.payload.user_type,
        isAdmin: action.payload.is_admin,
        loading: false,
        message: null,
      };
    case LOGIN_FAILURE:
      return { ...state, loading: false, message: action.payload.message };
    case LOGOUT:
      return { ...initialState };
    case REFRESH_TOKEN:
      return { ...state, accessToken: action.payload.access_token };
    default:
      return state;
  }
};

export default authReducer;
