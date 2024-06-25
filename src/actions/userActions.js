import { fetchWithAuth } from "../utils/auth";

export const fetchUser = () => async (dispatch) => {
  dispatch({ type: "FETCH_USER_REQUEST" });

  try {
    const data = await fetchWithAuth("http://135.181.42.192/accounts/profile/");
    dispatch({ type: "FETCH_USER_SUCCESS", payload: data });
  } catch (error) {
    dispatch({ type: "FETCH_USER_FAILURE", error: "Error fetching user type" });
  }
};
