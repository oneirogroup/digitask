import { combineReducers } from "redux";
import auth from "./auth";
import message from "./message";
import userReducer from "./userReducer";

export default combineReducers({
  user: userReducer,
  auth,
  message,
});
