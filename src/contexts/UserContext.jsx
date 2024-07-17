import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [userType, setUserType] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const storedUserType = localStorage.getItem('user_type') || sessionStorage.getItem('user_type');
    const storedIsAdmin = localStorage.getItem('is_admin') === 'true' || sessionStorage.getItem('is_admin') === 'true';

    console.log('Stored User Type:', storedUserType);
    console.log('Stored Is Admin:', storedIsAdmin);

    setUserType(storedUserType);
    setIsAdmin(storedIsAdmin);
  }, []);

  return (
    <UserContext.Provider value={{ userType, isAdmin }}>
      {children}
    </UserContext.Provider>
  );
};
