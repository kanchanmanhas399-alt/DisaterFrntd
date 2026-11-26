import { Outlet } from 'react-router-dom';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';
import AdminFooter from './AdminFooter';
import '../admin-ui.css';

export default function AdminLayout() {
  return (
    <div className="admin-shell">
      <AdminHeader />
      <div className="ad-body">
        <AdminSidebar />
        <main className="ad-main cit-page">
          <Outlet />
        </main>
      </div>
      <AdminFooter />
    </div>
  );
}
