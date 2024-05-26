import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../actions/auth";
import { Navigate, useNavigate } from 'react-router-dom';


const Home = () => {
    const { user: user } = useSelector((state) => state.auth);
    console.log(user)
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        return <Navigate to="/login" />;
    };
    const handleLogin = () => {
        navigate('/login');
    };
    return (
        <div>
            <h1>Welcome to the Main Page</h1>
            {user ? (
                <div>
                    <h2>User Information</h2>
                    <p>Email: {user.email}</p>
                    <button onClick={handleLogout}>Logout</button>
                </div>
            ) : (
                <div>
                    <p>Please log in to see your information.</p>
                    <button onClick={handleLogin}>Login</button>

                </div>
            )
            }

        </div >
    );
};

export default Home;
