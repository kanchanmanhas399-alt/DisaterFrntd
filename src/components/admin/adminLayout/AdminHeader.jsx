import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getemail, clear } from '../../../services/AuthServices';
import toast from 'react-hot-toast';
import Icon from '../../user/Pages/Icon';

const AdminHeader = () => {
  const [email, setEmail] = useState('');
  const nav = useNavigate();

  useEffect(() => {
    setEmail(getemail());
  }, []);

  const logout = () => {
    clear();
    toast.success('Admin logged out');
    nav('/');
  };

  return (
    <>
      <div className="ad-topstrip">
        <div className="container">
          <span>Administrator management console &bull; DisasterGuard emergency operations</span>
          <Link to="/">Switch to public portal &rarr;</Link>
        </div>
      </div>

      <header className="ad-header">
        <div className="container">
          <Link className="ad-brand" to="/admin">
            <span className="ad-brand-mark"><Icon name="shield" size={20} /></span>
            DisasterGuard <small>ADMIN</small>
          </Link>

          <div className="ad-header-actions">
            <Link to="/admin/categories" className="ad-header-link">
              <Icon name="layers" size={15} /> Categories
            </Link>
            <Link to="/" className="ad-header-link">
              <Icon name="home" size={15} /> Public site
            </Link>
            {email && (
              <span className="ad-user-chip">
                <span className="ad-user-avatar"><Icon name="user" size={14} /></span>
                <span>{email.split('@')[0]}</span>
              </span>
            )}
            <button type="button" className="ad-logout" onClick={logout} title="Log out" aria-label="Log out">
              <Icon name="logout" size={15} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>
    </>
  );
};

export default AdminHeader;
