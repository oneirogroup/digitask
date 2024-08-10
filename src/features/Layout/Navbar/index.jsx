import { AiOutlineMessage } from 'react-icons/ai';
import { IoNotifications } from 'react-icons/io5';
import { MdPerson } from "react-icons/md";
import './navbar.css';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
    const location = useLocation();

    const getLinkStyle = (path) => {
        return location.pathname === path ? { color: '#005ABF' } : {};
    };
    
    return (
        <div className="navbar-icons">
            <Link to="/chat/" style={getLinkStyle('/chat/')}><AiOutlineMessage /></Link>
            <Link to="/" style={getLinkStyle('/notifications/')}><IoNotifications /></Link>
            <Link to="/profile/" style={getLinkStyle('/profile/')}><MdPerson /></Link>
        </div>
    );
};

export default Navbar;
