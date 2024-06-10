import axios from "axios";

export const fetchChartData = (token) => async (dispatch) => {
  try {
    if (!token) {
      throw new Error("Token is missing.");
    }

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    };

    const res = await axios.get(
      "http://135.181.42.192/services/mainpage/",
      config
    );

    dispatch({
      type: "FETCH_CHART_DATA",
      payload: res.data,
    });
  } catch (err) {
    console.error("Error fetching chart data:", err);
  }
};
