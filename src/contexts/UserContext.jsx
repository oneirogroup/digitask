import React, { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export const useUser = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
  const [userType, setUserType] = useState(null);
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    const fetchUserType = async () => {
      try {
        const response = await fetch(
          "http://135.181.42.192/accounts/profile/",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
        const data = await response.json();
        setUserType(data.user_type);
        setUserEmail(data.email);
      } catch (error) {
        console.error("Error fetching user type:", error);
      }
    };

    fetchUserType();
  }, []);

  return (
    <UserContext.Provider value={{ userType, userEmail }}>
      {children}
    </UserContext.Provider>
  );
};
