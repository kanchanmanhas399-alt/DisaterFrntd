import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getemail, getName, isAdmin, getIsLogin, clear } from '../../../services/AuthServices';
import { NotificationMy, NotificationMarkRead, NotificationMarkAllRead } from '../../../services/adminServices';
import toast from 'react-hot-toast';
import Icon from '../Pages/Icon';
import './site-shell.css';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/alerts', label: 'Alerts' },
  { to: '/resources', label: 'Resources' },
  { to: '/safety', label: 'Safety' },
  { to: '/emergency', label: 'Report Emergency' },
  { to: '/about', label: 'About' },
];

const Header = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [adminUser, setAdminUser] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);  const notificationRef = useRef(null);

  const nav = useNavigate();
  const { pathname } = useLocation();

  const loadNotifications = useCallback(async () => {
    if (getIsLogin()) {
      try {
        const res = await NotificationMy();
        setNotifications(res.data.data || []);
        setUnreadCount(res.data.unreadCount || 0);
      } catch {
        // Notification polling is best-effort; never block the portal.
      }
    }
  }, []);

  useEffect(() => {
    const syncAuthentication = () => {
      const loggedIn = getIsLogin();
      setIsLoggedIn(loggedIn);
      if (loggedIn) {
        setEmail(getemail());
        setName(getName());
        setAdminUser(isAdmin());
        loadNotifications();
      } else {
        setEmail('');
        setName('');
        setAdminUser(false);
        setNotifications([]);
        setUnreadCount(0);
        setShowNotifications(false);
      }
    };

    syncAuthentication();
    window.addEventListener('disasterguard-auth-change', syncAuthentication);
    window.addEventListener('storage', syncAuthentication);
    return () => {
      window.removeEventListener('disasterguard-auth-change', syncAuthentication);
      window.removeEventListener('storage', syncAuthentication);
    };
  }, [loadNotifications]);

  useEffect(() => {
    const closeOnOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) setShowNotifications(false);
    };
    const closeOnEscape = (event) => { if (event.key === 'Escape') setShowNotifications(false); };
    document.addEventListener('mousedown', closeOnOutside);
    document.addEventListener('touchstart', closeOnOutside);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('mousedown', closeOnOutside);
      document.removeEventListener('touchstart', closeOnOutside);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, []);

  const logout = () => {
    clear();
    setIsLoggedIn(false);
    setEmail('');
    setName('');
    setAdminUser(false);
    toast.success('Logged out successfully');
    nav('/');
  };

  const handleMarkAsRead = async (id) => {
    try {
      await NotificationMarkRead(id);
      loadNotifications();
    } catch {
      // Keep the dropdown usable if a single update cannot be marked.
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await NotificationMarkAllRead();
      loadNotifications();
      toast.success('All notifications marked as read');
    } catch {
      // Keep the dropdown usable if bulk update fails.
    }
  };

  const displayName = name ? name.split(' ')[0] : email.split('@')[0];

  return (
    <div className="site-shell">
      <div className="site-topstrip">
        <div className="container">
          <span>
            Official emergency hotline: dial <strong>112</strong> for immediate life-threatening assistance.
          </span>
          {adminUser && (
            <Link to="/admin" className="site-admin-link">
              Admin console <Icon name="arrowRight" size={12} />
            </Link>
          )}
        </div>
      </div>

      <header className="site-header">
        <div className="container site-header-inner">
          <Link className="site-brand" to="/">
            <span className="site-brand-mark"><Icon name="shield" size={19} /></span>
            Disaster<span>Guard</span>
          </Link>

          <nav className="site-nav" aria-label="Main navigation">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`site-nav-link ${pathname === link.to ? 'active' : ''}`}
              >
                {link.label}
              </Link>
            ))}

            {isLoggedIn ? (
              <>
                <Link
                  to={adminUser ? '/admin' : '/userdashboard'}
                  className={`site-nav-link ${pathname === (adminUser ? '/admin' : '/userdashboard') ? 'active' : ''}`}
                >
                  {adminUser ? 'Admin Dashboard' : 'Dashboard'}
                </Link>
                <Link to="/my-reports" className={`site-nav-link ${pathname === '/my-reports' ? 'active' : ''}`}>
                  My Reports
                </Link>

                <div className="site-notification-wrap" ref={notificationRef}>
                  <button
                    type="button"
                    className="site-icon-btn"
                    onClick={() => setShowNotifications((current) => !current)}
                    aria-label="Notifications"
                    aria-expanded={showNotifications}
                  >
                    <Icon name="bell" size={17} />
                    {unreadCount > 0 && <span className="site-icon-count">{unreadCount}</span>}
                  </button>

                  {showNotifications && (
                    <div className="site-dropdown">
                      <div className="site-dropdown-head">
                        <strong>Notifications ({unreadCount} unread)</strong>
                        {unreadCount > 0 && (
                          <button type="button" className="site-text-btn small" onClick={handleMarkAllRead}>
                            Mark all read
                          </button>
                        )}
                      </div>

                      {notifications.length === 0 ? (
                        <p className="site-empty">No notifications.</p>
                      ) : (
                        notifications.map((item) => (
                          <div
                            key={item._id}
                            className={`site-notification ${item.isRead ? '' : 'unread'}`}
                            onClick={() => !item.isRead && handleMarkAsRead(item._id)}
                          >
                            <div className="site-notification-head">
                              <strong>{item.title}</strong>
                              <small>{new Date(item.createdAt).toLocaleDateString()}</small>
                            </div>
                            <p>{item.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>

                <span className="site-user-chip">
                  <span className="site-user-avatar"><Icon name="user" size={14} /></span>
                  <span>{displayName}</span>
                </span>
                <button type="button" className="site-text-btn" onClick={logout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="site-nav-link">Login</Link>
                <Link to="/register" className="site-nav-link">Register</Link>
              </>
            )}

            <Link className="site-nav-link sos" to="/sos">
              <Icon name="siren" size={14} /> SOS
            </Link>
          </nav>
        </div>
      </header>
    </div>
  );
};

export default Header;
