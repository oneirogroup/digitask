import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const [userType, setUserType] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [accessToken, setAccessToken] = useState(null);
    const [refreshToken, setRefreshToken] = useState(null);

    useEffect(() => {
        const storedUserType = localStorage.getItem('user_type') || sessionStorage.getItem('user_type');
        const storedIsAdmin = localStorage.getItem('is_admin') === 'true' || sessionStorage.getItem('is_admin') === 'true';
        const storedAccessToken = localStorage.getItem('access_token');
        const storedRefreshToken = localStorage.getItem('refresh_token');

        setUserType(storedUserType);
        setIsAdmin(storedIsAdmin);
        setAccessToken(storedAccessToken);
        setRefreshToken(storedRefreshToken);
    }, []);

    return (
        <UserContext.Provider value={{ userType, isAdmin, accessToken, refreshToken }}>
            {children}
        </UserContext.Provider>
    );
};