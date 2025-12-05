import { Outlet } from 'react-router-dom';
import Footer from '../landing/Footer';

function Layout() {
  return (
    <div className="app-layout">
      <Outlet />
      <Footer />
    </div>
  );
}

export default Layout;
