import { AiOutlineMessage } from "react-icons/ai";
import { IoNotifications } from "react-icons/io5";
import { MdOutlinePersonOutline } from "react-icons/md";
import "./navbar.css"
import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <div className="navbar-icons">
            <Link><AiOutlineMessage /></Link>
            <Link><IoNotifications /></Link>
            <Link><MdOutlinePersonOutline /></Link>
        </div>
    )
}

export default Navbar;