import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const [userType, setUserType] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [accessToken, setAccessToken] = useState(null);
    const [refreshToken, setRefreshToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUserType = localStorage.getItem('user_type') || sessionStorage.getItem('user_type');
        const storedIsAdmin = localStorage.getItem('is_admin') === 'true' || sessionStorage.getItem('is_admin') === 'true';
        const storedAccessToken = localStorage.getItem('access_token');
        const storedRefreshToken = localStorage.getItem('refresh_token');

        const refreshAccessToken = async () => {
            if (storedRefreshToken) {
                try {
                    const response = await fetch('http://37.61.77.5/accounts/token/refresh/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ refresh: storedRefreshToken }),
                    });

                    const data = await response.json();
                    if (data.access) {
                        localStorage.setItem('access_token', data.access);
                        setAccessToken(data.access);
                        console.log('New access token set in localStorage');
                    } else {
                        console.error('Failed to retrieve new access token:', data);
                    }
                } catch (error) {
                    console.error('Error during token refresh:', error);
                }
            } else {
                console.error('No refresh token found in localStorage');
            }

            setUserType(storedUserType);
            setIsAdmin(storedIsAdmin);
            setLoading(false);
        };

        refreshAccessToken();
    }, []);

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-content">
                    <div className="spinner"></div>
                    <p className="loading-text">Yüklənir, gözləyin zəhmət olmasa...</p>
                </div>
            </div>
        );
    }

    return (
        <UserContext.Provider value={{ userType, isAdmin, accessToken, refreshToken }}>
            {children}
        </UserContext.Provider>
    );
};
