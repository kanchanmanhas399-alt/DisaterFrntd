import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../Pages/Icon';
import './site-shell.css';

const Footer = () => (
  <footer className="site-footer site-shell">
    <div className="container">
      <div className="site-footer-grid">
        <div>
          <h3><Icon name="shield" size={17} /> DisasterGuard</h3>
          <p>Official emergency information, incident reporting, and practical safety guidance in one place.</p>
          <small>
            Demonstration portal. Connect verified authorities and services before production use.
          </small>
        </div>
        <div>
          <span className="site-footer-label">Public portal</span>
          <Link to="/alerts">Active alerts</Link>
          <Link to="/resources">Emergency resources</Link>
          <Link to="/safety">Safety guidance</Link>
          <Link to="/about">About the system</Link>
        </div>
        <div>
          <span className="site-footer-label">Account &amp; response</span>
          <Link to="/emergency">Report an emergency</Link>
          <Link to="/sos">SOS assistance</Link>
          <Link to="/my-reports">My reports</Link>
          <Link to="/login">Sign in</Link>
        </div>
      </div>
      <div className="site-footer-bottom">
        &copy; {new Date().getFullYear()} DisasterGuard &bull; In immediate danger, dial 112.
      </div>
    </div>
  </footer>
);

export default Footer;
