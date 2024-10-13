import { createContext, useContext, useState, useEffect } from 'react';

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

        const refreshToken = localStorage.getItem('refresh_token');

        if (refreshToken) {
            fetch('http://135.181.42.192/accounts/token/refresh/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    refresh: refreshToken,
                }),
            })
                .then(response => response.json())
                .then(data => {
                    if (data.access) {
                        localStorage.setItem('access_token', data.access);
                        console.log('New access token set in localStorage');
                    } else {
                        console.error('Failed to retrieve new access token:', data);
                    }
                })
                .catch(error => {
                    console.error('Error during token refresh:', error);
                });
        } else {
            console.error('No refresh token found in localStorage');
        }

        setUserType(storedUserType);
        setIsAdmin(storedIsAdmin);
        setAccessToken(storedAccessToken);
        setRefreshToken(refreshToken);
    }, []);

    return (
        <UserContext.Provider value={{ userType, isAdmin, accessToken, refreshToken }}>
            {children}
        </UserContext.Provider>
    );
};