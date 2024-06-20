import axios from "axios";

const refreshAccessToken = async () => {
  const refresh_token = localStorage.getItem("refresh_token");
  if (!refresh_token) {
    throw new Error("No refresh token available");
  }
  try {
    const response = await axios.post(
      "http://135.181.42.192/accounts/token/refresh/",
      {
        refresh: refresh_token,
      }
    );
    const { access } = response.data;
    localStorage.setItem("access_token", access);
    axios.defaults.headers.common["Authorization"] = `Bearer ${access}`;
    return access;
  } catch (error) {
    console.error("Error refreshing token:", error);
    throw error;
  }
};

const fetchWithAuth = async (url, options = {}, retry = true) => {
  const token = localStorage.getItem("access_token");
  try {
    const response = await axios({
      url,
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403) &&
      retry
    ) {
      try {
        const newAccessToken = await refreshAccessToken();
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newAccessToken}`;
        return fetchWithAuth(url, options, false);
      } catch (refreshError) {
        console.error("Error: Token refresh failed:", refreshError);
        throw refreshError;
      }
    } else {
      throw error;
    }
  }
};

export { refreshAccessToken, fetchWithAuth };
