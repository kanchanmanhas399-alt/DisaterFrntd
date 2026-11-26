import React, { useEffect, useState, useCallback } from 'react';
import { GetUserDashboard } from '../../../services/EmergencyReport';
import { UserMyResourceRequests } from '../../../services/adminServices';
import { getIsLogin, getName } from '../../../services/AuthServices';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Icon from './Icon';
import './citizen-ui.css';

const UserDashboard = () => {
  const [stats, setStats] = useState({
    totalReports: 0,
    pending: 0,
    underReview: 0,
    responding: 0,
    resolved: 0,
    totalActiveAlerts: 0,
    recentReports: [],
    activeAlerts: []
  });
  const [myRequests, setMyRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [loading, setLoading] = useState(true);

  const nav = useNavigate();
  const userName = getName() || "Citizen";

  const loadDashboard = useCallback(() => {
    if (!getIsLogin()) {
      toast.error("Please login to access your dashboard");
      nav("/login");
      return;
    }

    setLoading(true);
    setLoadingRequests(true);
    GetUserDashboard()
      .then((res) => {
        setStats(res.data.data || {});
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || "Failed to load dashboard data");
      })
      .finally(() => setLoading(false));

    UserMyResourceRequests()
      .then((res) => {
        setMyRequests(res.data.data || []);
      })
      .catch(() => {
        // Non-blocking
      })
      .finally(() => setLoadingRequests(false));
  }, [nav]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const getStatusBadge = (status = '') => {
    const s = status.toLowerCase();
    if (s === 'resolved') return 'ui-badge green';
    if (s === 'responding' || s === 'in-progress') return 'ui-badge blue';
    if (s === 'under review' || s === 'verified') return 'ui-badge amber';
    if (s === 'rejected' || s === 'cancelled') return 'ui-badge red';
    return 'ui-badge';
  };

  const formatCount = (value) => String(value).padStart(2, '0');

  return (
    <div className="cit-page">
      <section className="ui-hero">
        <div className="container ui-hero-inner">
          <div className="ui-hero-copy">
            <span className="ui-eyebrow">Citizen Dashboard &middot; Operations Overview</span>
            <h1>Citizen Dashboard</h1>
            <p>
              Welcome back, <strong>{userName}</strong>. Track your incident reports and active emergency advisories.
            </p>
            <div className="ui-hero-actions">
              <Link to="/emergency" className="ui-btn green">
                <Icon name="plus" size={15} /> Report Incident
              </Link>
              <Link to="/sos" className="ui-btn red">
                <Icon name="siren" size={15} /> SOS Beacon
              </Link>
            </div>
          </div>

          <div className="ui-hero-meta">
            <div>
              <Icon name="file" size={19} />
              <span><strong>{loading ? '—' : formatCount(stats.totalReports)}</strong> reports tracked</span>
            </div>
            <div>
              <Icon name="home" size={19} />
              <span><strong>{loadingRequests ? '—' : formatCount(myRequests.length)}</strong> facility requests</span>
            </div>
            <div>
              <Icon name="bell" size={19} />
              <span><strong>{loading ? '—' : formatCount(stats.totalActiveAlerts)}</strong> active alerts</span>
            </div>
          </div>
        </div>
      </section>

      <main className="container ui-content">
        <div className="ui-stat-grid">
          <div className="ui-stat-card tone-sky">
            <span className="ui-stat-icon"><Icon name="file" size={20} /></span>
            <div>
              <span className="ui-stat-value">{loading ? "—" : formatCount(stats.totalReports)}</span>
              <span className="ui-stat-label">Total Reports</span>
              <span className="ui-hint">Submitted by you</span>
            </div>
          </div>

          <div className="ui-stat-card tone-amber">
            <span className="ui-stat-icon"><Icon name="clock" size={20} /></span>
            <div>
              <span className="ui-stat-value">{loading ? "—" : formatCount(stats.pending)}</span>
              <span className="ui-stat-label">Pending Review</span>
              <span className="ui-hint">Awaiting dispatcher</span>
            </div>
          </div>

          <div className="ui-stat-card tone-green">
            <span className="ui-stat-icon"><Icon name="activity" size={20} /></span>
            <div>
              <span className="ui-stat-value">
                {loading ? "—" : formatCount(stats.underReview + stats.responding)}
              </span>
              <span className="ui-stat-label">Active / Responding</span>
              <span className="ui-hint">Under active response</span>
            </div>
          </div>

          <div className="ui-stat-card tone-red">
            <span className="ui-stat-icon"><Icon name="bell" size={20} /></span>
            <div>
              <span className="ui-stat-value">{loading ? "—" : formatCount(stats.totalActiveAlerts)}</span>
              <span className="ui-stat-label">Active Alerts</span>
              <span className="ui-hint">Notices in your region</span>
            </div>
          </div>
        </div>

        <div className="ui-section-head">
          <div>
            <h2>Quick Actions</h2>
            <p>Open the tools you use most.</p>
          </div>
        </div>

        <div className="ui-grid cols-4">
          <div>
            <Link to="/emergency" className="ui-row tone-sky">
              <span className="ui-icon-tile"><Icon name="clipboard" size={20} /></span>
              <span className="ui-row-main">
                <span className="ui-row-title">Report Emergency</span>
                <span className="ui-hint">Log incident for assistance</span>
              </span>
              <Icon name="chevronRight" size={16} />
            </Link>
          </div>

          <div>
            <Link to="/my-reports" className="ui-row tone-violet">
              <span className="ui-icon-tile"><Icon name="list" size={20} /></span>
              <span className="ui-row-main">
                <span className="ui-row-title">My Report History</span>
                <span className="ui-hint">Track response status</span>
              </span>
              <Icon name="chevronRight" size={16} />
            </Link>
          </div>

          <div>
            <Link to="/resources" className="ui-row tone-green">
              <span className="ui-icon-tile"><Icon name="medical" size={20} /></span>
              <span className="ui-row-main">
                <span className="ui-row-title">Emergency Resources</span>
                <span className="ui-hint">Shelters, hospitals &amp; rescue</span>
              </span>
              <Icon name="chevronRight" size={16} />
            </Link>
          </div>

          <div>
            <Link to="/safety" className="ui-row tone-teal">
              <span className="ui-icon-tile"><Icon name="shield" size={20} /></span>
              <span className="ui-row-main">
                <span className="ui-row-title">Safety Guidelines</span>
                <span className="ui-hint">Hazard preparedness tips</span>
              </span>
              <Icon name="chevronRight" size={16} />
            </Link>
          </div>
        </div>

        <div className="ui-section-head">
          <div>
            <h2>Your Recent Emergency Reports</h2>
            <p>Live status of your submitted incidents.</p>
          </div>
          <Link className="ui-btn ghost sm" to="/my-reports">
            View All Reports <Icon name="arrowRight" size={14} />
          </Link>
        </div>

        <div className="ui-table-wrap">
          <table className="ui-table">
            <thead>
              <tr>
                <th>Incident Title</th>
                <th>Hazard Type</th>
                <th>Location</th>
                <th>Severity</th>
                <th>Date Logged</th>
                <th>Status</th>
                <th>Response Category</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8">
                    <div className="ui-state">
                      <div className="ui-spinner" />
                      <p>Loading reports...</p>
                    </div>
                  </td>
                </tr>
              ) : stats.recentReports?.length === 0 ? (
                <tr>
                  <td colSpan="8">
                    <div className="ui-state">
                      <div className="state-icon"><Icon name="file" size={24} /></div>
                      <h3>No reports submitted</h3>
                      <p>You have not submitted any emergency reports yet.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                stats.recentReports.map((report) => (
                  <tr key={report._id}>
                    <td>
                      <strong>{report.title}</strong>
                      {report.isSOS && (
                        <span className="ui-badge red">SOS</span>
                      )}
                    </td>
                    <td>{report.disasterType}</td>
                    <td>{report.location?.address || "—"}</td>
                    <td>
                      <span className={`ui-badge ${report.severity === 'Critical' ? 'red' : report.severity === 'High' ? 'amber' : ''}`}>
                        {report.severity}
                      </span>
                    </td>
                    <td>{new Date(report.createdAt).toLocaleDateString()}</td>
                    <td>
                      <span className={getStatusBadge(report.status)}>
                        {report.status}
                      </span>
                    </td>
                    <td>
                      <span className="ui-hint">
                        {report.assessment?.responseCategory || "Emergency Assistance"}
                      </span>
                    </td>
                    <td>
                      <Link
                        to={`/assessment-results/${report._id}`}
                        className="ui-btn ghost sm"
                      >
                        Assessment <Icon name="arrowRight" size={14} />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* My Resource Requests Section */}
        <div className="ui-section-head">
          <div>
            <h2>My Facility & Resource Requests</h2>
            <p>Shelter, hospital, and rescue center connection requests submitted by you.</p>
          </div>
          <Link className="ui-btn ghost sm" to="/resources">
            <Icon name="plus" size={14} /> Browse Resources
          </Link>
        </div>

        {loadingRequests ? (
          <div className="ui-state">
            <div className="ui-spinner" />
            <h3>Loading your requests</h3>
            <p>Fetching your facility connect records&hellip;</p>
          </div>
        ) : myRequests.length === 0 ? (
          <div className="ui-state">
            <div className="state-icon"><Icon name="home" size={24} /></div>
            <h3>No facility requests logged</h3>
            <p>You haven't requested admission or connection with any emergency facility yet.</p>
            <div style={{ marginTop: '12px' }}>
              <Link to="/resources" className="ui-btn primary sm">
                Explore Emergency Facilities
              </Link>
            </div>
          </div>
        ) : (
          <div className="ui-table-wrap">
            <table className="ui-table">
              <thead>
                <tr>
                  <th>Facility</th>
                  <th>Type</th>
                  <th>Reference</th>
                  <th>Contact Info</th>
                  <th>Submitted</th>
                  <th>Status</th>
                  <th>Coordinator Note</th>
                </tr>
              </thead>
              <tbody>
                {myRequests.map((req) => (
                  <tr key={req._id}>
                    <td>
                      <strong>{req.resourceName}</strong>
                      {req.resourceAddress && (
                        <span className="ui-hint">{req.resourceAddress}</span>
                      )}
                    </td>
                    <td>
                      <span className="ui-badge blue">{req.resourceType}</span>
                    </td>
                    <td>
                      <code>{req.resourceReference || '—'}</code>
                    </td>
                    <td>
                      <div>{req.resourceContact || '—'}</div>
                      {req.notes && (
                        <span className="ui-hint" title={req.notes}>Note: {req.notes.length > 30 ? req.notes.substring(0, 30) + '…' : req.notes}</span>
                      )}
                    </td>
                    <td>{new Date(req.createdAt).toLocaleDateString()}</td>
                    <td>
                      <span className={`ui-badge ${
                        req.status === 'Approved' || req.status === 'Fulfilled'
                          ? 'green'
                          : req.status === 'Pending'
                          ? 'amber'
                          : req.status === 'Waitlisted'
                          ? 'blue'
                          : 'red'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    <td>
                      {req.adminNotes ? (
                        <span style={{ fontSize: '12px', color: '#17324d', fontWeight: 600 }}>{req.adminNotes}</span>
                      ) : (
                        <span className="ui-hint">Awaiting coordinator review</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="ui-section-head">
          <div>
            <h2>Active Public Safety Notices</h2>
            <p>Current advisories issued by civil protection.</p>
          </div>
          <Link className="ui-btn ghost sm" to="/alerts">
            View All Alerts <Icon name="arrowRight" size={14} />
          </Link>
        </div>

        {stats.activeAlerts?.length === 0 ? (
          <div className="ui-state">
            <div className="state-icon"><Icon name="bell" size={24} /></div>
            <h3>No active alerts</h3>
            <p>No active alerts currently issued.</p>
          </div>
        ) : (
          <div>
            {stats.activeAlerts?.slice(0, 3).map((alert) => (
              <div
                key={alert._id}
                className={`ui-row ${alert.severity === 'Critical' ? 'tone-red' : 'tone-amber'}`}
              >
                <span className="ui-icon-tile">
                  <Icon name={alert.severity === 'Critical' ? 'siren' : 'alert'} size={20} />
                </span>
                <div className="ui-row-main">
                  <span className="ui-row-title">{alert.title} &bull; {alert.affectedArea}</span>
                  <p className="ui-row-desc">{alert.description}</p>
                </div>
                <div className="ui-row-side">
                  <span className={`ui-badge ${alert.severity === 'Critical' ? 'red' : alert.severity === 'High' ? 'amber' : ''}`}>
                    {alert.severity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default UserDashboard;
