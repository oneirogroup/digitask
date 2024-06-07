export const fetchProfileData = (accessToken) => {
  return async (dispatch) => {
    try {
      const response = await fetch("http://135.181.42.192/accounts/profile/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch profile data");
      }

      const data = await response.json();
      dispatch({ type: "FETCH_PROFILE_SUCCESS", payload: data });
    } catch (error) {
      dispatch({ type: "FETCH_PROFILE_ERROR", payload: error.message });
    }
  };
};
