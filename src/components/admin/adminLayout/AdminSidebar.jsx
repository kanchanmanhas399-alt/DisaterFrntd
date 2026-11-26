import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../../user/Pages/Icon';

const NAV_GROUPS = [
  {
    label: 'Operations',
    links: [
      { to: '/admin', label: 'Dashboard', icon: 'gauge', end: true },
      { to: '/admin/reports', label: 'Emergency Reports', icon: 'clipboard' },
      { to: '/admin/disaster-email-recipients', label: 'Disaster Email Recipients', icon: 'mail' },
      { to: '/admin/alerts', label: 'Disaster Alerts', icon: 'bell' },
      { to: '/admin/resources', label: 'Resources', icon: 'layers' },
      { to: '/admin/safety', label: 'Safety Guidelines', icon: 'shield' },
    ],
  },
  {
    label: 'Facilities & Records',
    links: [
      { to: '/admin/disaster', label: 'Disasters', icon: 'storm' },
      { to: '/admin/categories', label: 'Categories', icon: 'list' },
      { to: '/admin/shelters', label: 'Shelters', icon: 'home' },
      { to: '/admin/hospitals', label: 'Hospitals', icon: 'medical' },
      { to: '/admin/rescuecenters', label: 'Rescue Centers', icon: 'ambulance' },
      { to: '/admin/users', label: 'Users', icon: 'users' },
    ],
  },
  {
    label: 'Account',
    links: [
      { to: '/admin/profile', label: 'Admin Profile', icon: 'user' },
      { to: '/', label: 'View public site', icon: 'arrowRight', public: true },
    ],
  },
];

const AdminSidebar = () => {
  const { pathname } = useLocation();

  const isActive = (link) => {
    if (link.end) return pathname === '/admin';
    if (link.to === '/admin/categories') {
      return pathname.startsWith('/admin/categories') || pathname === '/admin/addcategory';
    }
    return pathname.toLowerCase().startsWith(link.to.toLowerCase());
  };

  return (
    <aside className="ad-sidebar">
      <div className="ad-sidebar-inner">
        {NAV_GROUPS.map((group, index) => (
          <React.Fragment key={group.label}>
            {index > 0 && <div className="ad-side-divider" />}
            <div className="ad-side-label">{group.label}</div>
            {group.links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`ad-side-link ${isActive(link) ? 'active' : ''} ${link.public ? 'public' : ''}`}
              >
                <Icon name={link.icon} size={16} />
                {link.label}
              </Link>
            ))}
          </React.Fragment>
        ))}
      </div>
    </aside>
  );
};

export default AdminSidebar;
