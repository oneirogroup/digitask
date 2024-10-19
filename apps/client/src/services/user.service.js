import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://135.181.42.192/";

const getPublicContent = () => {
  return axios.get(API_URL + "");
};

const getUserBoard = () => {
  return axios.get(API_URL + "accounts/users/", { headers: authHeader() });
};


const getAdminBoard = () => {
  return axios.get(API_URL + "admin/", { headers: authHeader() });
};

export default {
  getPublicContent,
  getUserBoard,
  getAdminBoard,
};
