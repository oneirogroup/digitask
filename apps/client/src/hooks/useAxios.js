// import { useState, useCallback } from "react";
// import axios from "axios";

// const useAxios = () => {
//   const [employees, setEmployees] = useState([]);

//   const refreshAccessToken = useCallback(async () => {
//     try {
//       const refreshToken = localStorage.getItem("refresh_token");
//       const response = await axios.post(
//         "https://app.digitask.store/accounts/token/refresh/",
//         {
//           refresh: refreshToken,
//         }
//       );
//       localStorage.setItem("access_token", response.data.access);
//     } catch (error) {
//       console.error("Error refreshing access token:", error);
//     }
//   }, []);

//   const fetchEmployees = useCallback(async () => {
//     try {
//       await refreshAccessToken();
//       const token = localStorage.getItem("access_token");
//       const response = await axios.get(
//         "https://app.digitask.store/accounts/users/",
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       setEmployees(response.data);
//     } catch (error) {
//       console.error("Error fetching employees:", error);
//     }
//   }, [refreshAccessToken]);

//   return { employees, fetchEmployees, refreshAccessToken };
// };

// export default useAxios;
