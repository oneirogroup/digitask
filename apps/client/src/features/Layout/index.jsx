import { Outlet, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from './Navbar';
import "./layout.css";

const Layout = () => {
  const location = useLocation();
  const hideSidebarRoutes = ["/login", "/login/", "/re-password", "/re-password/", "/re-password-code", "/re-password-code/", "/set-new-password", "/set-new-password/"];
  const shouldHideSidebar = hideSidebarRoutes.includes(location.pathname);
  const shouldHideNavbar = hideSidebarRoutes.includes(location.pathname);

  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(prevState => !prevState);
  };



  return (
    <div className={shouldHideSidebar ? "layout-no-sidebar" : "layout-with-sidebar"}>
      {!shouldHideNavbar && <Navbar className="navbar" onToggleSidebar={toggleSidebar} />}
      {!shouldHideSidebar && (
        <>
          <Sidebar className="sidebar" isSidebarOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        </>
      )}
      <div className={shouldHideSidebar ? "main-content-no-sidebar" : "main-content"}>
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
