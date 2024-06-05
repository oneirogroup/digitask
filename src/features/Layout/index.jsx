import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Navbar from './Navbar';
import "./layout.css";

const Layout = () => {
  const location = useLocation();
  const hideSidebarRoutes = ["/login/"];

  const shouldHideSidebar = hideSidebarRoutes.includes(location.pathname);
  const shouldHideNavbar = hideSidebarRoutes.includes(location.pathname);

  return (
    <div className={shouldHideSidebar ? "layout-no-sidebar" : "layout-with-sidebar"}>
      {!shouldHideNavbar && <Navbar className="navbar" />}
      {!shouldHideSidebar && <Sidebar className="sidebar" />}
      <div className={shouldHideSidebar ? "main-content-no-sidebar" : "main-content"}>
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
