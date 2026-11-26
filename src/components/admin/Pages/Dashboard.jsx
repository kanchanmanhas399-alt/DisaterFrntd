import React, { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { GetAdminDashboardStats } from '../../../services/EmergencyReport';
import Icon from '../../user/Pages/Icon';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAlerts: 0,
    activeAlerts: 0,
    totalReports: 0,
    pendingReports: 0,
    underReviewReports: 0,
    respondingReports: 0,
    resolvedReports: 0,
    totalSOS: 0,
    pendingSOS: 0,
    totalResources: 0,
    availableResources: 0,
    recentSOS: [],
    recentReports: [],
    latestAlerts: []
  });
  const [loading, setLoading] = useState(true);

  const loadStats = useCallback(() => {
    setLoading(true);
    GetAdminDashboardStats()
      .then((res) => {
        setStats(res.data.data || {});
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || 'Unable to load operational statistics');
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const getStatusBadge = (status = '') => {
    const s = status.toLowerCase();
    if (s === 'resolved') return 'ui-badge green';
    if (s === 'responding' || s === 'pending') return 'ui-badge red';
    if (s === 'under review' || s === 'verified') return 'ui-badge amber';
    if (s === 'rejected' || s === 'cancelled') return 'ui-badge red';
    return 'ui-badge';
  };

  return (
    <>
      <section className="ui-hero compact">
        <div className="container ui-hero-inner">
          <div className="ui-hero-copy">
            <span className="ui-eyebrow">Operations Command</span>
            <h1>Dashboard</h1>
            <p>Live operational overview across alerts, reports and SOS activity.</p>
            <div className="ui-hero-actions">
              <Link to="/admin/alerts" className="ui-btn red sm">
                <Icon name="plus" size={15} /> Issue Alert
              </Link>
              <Link to="/admin/reports" className="ui-btn ghost sm">
                <Icon name="clipboard" size={15} /> Review Reports
              </Link>
              <button type="button" className="ui-btn ghost sm" onClick={loadStats}>
                <Icon name="refresh" size={15} /> Refresh
              </button>
            </div>
          </div>
          <div className="ui-hero-meta">
            <div>
              <Icon name="siren" size={19} />
              <span><strong>{loading ? '—' : stats.activeAlerts}</strong> active alerts</span>
            </div>
            <div>
              <Icon name="alert" size={19} />
              <span><strong>{loading ? '—' : stats.pendingReports}</strong> pending reports</span>
            </div>
          </div>
        </div>
      </section>

      <main className="container ui-content compact-top">
        <div className="ui-stat-grid">
          <article className="ui-stat-card tone-sky">
            <span className="ui-stat-icon"><Icon name="users" size={20} /></span>
            <div>
              <span className="ui-stat-value">{loading ? '—' : stats.totalUsers}</span>
              <span className="ui-stat-label">Registered citizens</span>
              <span className="ui-stat-label">Platform user profiles</span>
            </div>
          </article>

          <article className="ui-stat-card tone-red">
            <span className="ui-stat-icon"><Icon name="siren" size={20} /></span>
            <div>
              <span className="ui-stat-value">{loading ? '—' : stats.activeAlerts}</span>
              <span className="ui-stat-label">Active disaster alerts</span>
              <span className="ui-stat-label">{stats.totalAlerts} total notices issued</span>
            </div>
          </article>

          <article className="ui-stat-card tone-amber">
            <span className="ui-stat-icon"><Icon name="clipboard" size={20} /></span>
            <div>
              <span className="ui-stat-value">{loading ? '—' : stats.totalReports}</span>
              <span className="ui-stat-label">Emergency reports</span>
              <span className="ui-stat-label">{stats.pendingReports} pending &bull; {stats.respondingReports} responding</span>
            </div>
          </article>

          <article className="ui-stat-card tone-rose">
            <span className="ui-stat-icon"><Icon name="alert" size={20} /></span>
            <div>
              <span className="ui-stat-value">{loading ? '—' : stats.totalSOS}</span>
              <span className="ui-stat-label">Critical SOS beacons</span>
              <span className="ui-stat-label">{stats.pendingSOS} urgent pending</span>
            </div>
          </article>
        </div>

        <div className="ui-section-head">
          <div>
            <h2>Triage and resources</h2>
            <p>Current pipeline and facility capacity.</p>
          </div>
        </div>

        <div className="ui-stat-grid">
          <article className="ui-stat-card tone-amber">
            <span className="ui-stat-icon"><Icon name="clock" size={20} /></span>
            <div>
              <span className="ui-stat-value">{loading ? '—' : stats.pendingReports}</span>
              <span className="ui-stat-label">Pending reports</span>
              <span className="ui-stat-label">Awaiting triage</span>
            </div>
          </article>

          <article className="ui-stat-card tone-slate">
            <span className="ui-stat-icon"><Icon name="eye" size={20} /></span>
            <div>
              <span className="ui-stat-value">{loading ? '—' : stats.underReviewReports}</span>
              <span className="ui-stat-label">Under review</span>
              <span className="ui-stat-label">Assessing hazard</span>
            </div>
          </article>

          <article className="ui-stat-card tone-green">
            <span className="ui-stat-icon"><Icon name="check" size={20} /></span>
            <div>
              <span className="ui-stat-value">{loading ? '—' : stats.resolvedReports}</span>
              <span className="ui-stat-label">Resolved incidents</span>
              <span className="ui-stat-label">Successfully addressed</span>
            </div>
          </article>

          <article className="ui-stat-card tone-teal">
            <span className="ui-stat-icon"><Icon name="building" size={20} /></span>
            <div>
              <span className="ui-stat-value">{loading ? '—' : stats.availableResources}</span>
              <span className="ui-stat-label">Available resources</span>
              <span className="ui-stat-label">{stats.totalResources} registered facilities</span>
            </div>
          </article>
        </div>

        <div className="ui-section-head">
          <div>
            <h2>Quick operations</h2>
            <p>Open an active work queue.</p>
          </div>
        </div>

        <div className="ui-card">
          <div className="ui-card-body">
            <div className="ui-grid cols-3">
              <Link to="/admin/alerts" className="ui-btn red sm block">
                <Icon name="plus" size={15} /> New Alert
              </Link>
              <Link to="/admin/reports" className="ui-btn ghost sm block">
                <Icon name="clipboard" size={15} /> Triage Reports ({stats.pendingReports} pending)
              </Link>
              <Link to="/admin/resources" className="ui-btn ghost sm block">
                <Icon name="building" size={15} /> Manage Resources
              </Link>
              <Link to="/admin/safety" className="ui-btn ghost sm block">
                <Icon name="shield" size={15} /> Safety Protocols
              </Link>
              <Link to="/admin/users" className="ui-btn ghost sm block">
                <Icon name="users" size={15} /> User Accounts
              </Link>
            </div>
          </div>
        </div>

        {stats.recentSOS?.length > 0 && (
          <>
            <div className="ui-section-head">
              <div>
                <h2><Icon name="siren" size={19} /> Recent critical SOS beacons</h2>
                <p>Urgent distress signals transmitted by citizens.</p>
              </div>
              <Link to="/admin/reports" className="ui-btn red sm">
                Respond in reports <Icon name="arrowRight" size={15} />
              </Link>
            </div>

            <div className="ui-table-wrap">
              <table className="ui-table">
                <thead>
                  <tr>
                    <th>SOS Incident</th>
                    <th>Caller / Contact</th>
                    <th>Location</th>
                    <th>Affected</th>
                    <th>Timestamp</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentSOS.map((sos) => (
                    <tr key={sos._id}>
                      <td>
                        <strong>{sos.title}</strong>
                        <br />
                        <small className="muted">{sos.description}</small>
                      </td>
                      <td>
                        <strong>{sos.userId?.name || 'Citizen'}</strong>
                        <br />
                        <small>{sos.contactNumber || sos.userId?.phone || '—'}</small>
                      </td>
                      <td>{sos.location?.address || 'GPS'}</td>
                      <td><strong>{sos.affectedPeople || 1}</strong></td>
                      <td>{new Date(sos.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                      <td>
                        <span className={getStatusBadge(sos.status)}>{sos.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        <div className="ui-section-head">
          <div>
            <h2><Icon name="clipboard" size={19} /> Recent emergency reports</h2>
            <p>Latest incidents reported across all zones.</p>
          </div>
          <Link to="/admin/reports" className="ui-btn ghost sm">
            View all reports <Icon name="arrowRight" size={15} />
          </Link>
        </div>

        <div className="ui-table-wrap">
          <table className="ui-table">
            <thead>
              <tr>
                <th>Incident</th>
                <th>Reported By</th>
                <th>Hazard</th>
                <th>Location</th>
                <th>Severity</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7"><div className="ui-spinner" /> Loading reports...</td>
                </tr>
              ) : stats.recentReports?.length === 0 ? (
                <tr>
                  <td colSpan="7" className="muted">No emergency reports recorded yet.</td>
                </tr>
              ) : (
                stats.recentReports.map((item) => (
                  <tr key={item._id}>
                    <td>
                      <strong>{item.title}</strong>
                      {item.isSOS && <> <span className="ui-badge red">SOS</span></>}
                    </td>
                    <td>{item.userId?.name || 'Citizen'}</td>
                    <td>{item.disasterType}</td>
                    <td>{item.location?.address || '—'}</td>
                    <td>
                      <span className={`ui-badge ${item.severity === 'Critical' ? 'red' : item.severity === 'High' ? 'amber' : 'red'}`}>
                        {item.severity}
                      </span>
                    </td>
                    <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                    <td>
                      <span className={getStatusBadge(item.status)}>{item.status}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="ui-section-head">
          <div>
            <h2><Icon name="bell" size={19} /> Latest published disaster alerts</h2>
            <p>Public warnings currently active or recently issued.</p>
          </div>
          <Link to="/admin/alerts" className="ui-btn ghost sm">
            Manage alerts <Icon name="arrowRight" size={15} />
          </Link>
        </div>

        {stats.latestAlerts?.length === 0 ? (
          <div className="ui-state">
            <div className="state-icon"><Icon name="bell" size={24} /></div>
            <p>No disaster alerts published.</p>
          </div>
        ) : (
          stats.latestAlerts?.map((alert) => (
            <article key={alert._id} className="ui-row">
              <span className={`ui-icon-tile sm ${alert.severity === 'Critical' ? 'tone-red' : 'tone-slate'}`}>
                <Icon name={alert.severity === 'Critical' ? 'alert' : 'bell'} size={16} />
              </span>
              <div className="ui-row-main">
                <span className="ui-row-title">
                  {alert.title} &bull; {alert.affectedArea} ({alert.disasterType})
                </span>
                <p className="ui-row-desc">{alert.description}</p>
              </div>
              <div className="ui-row-side">
                <span className={`ui-badge ${alert.status === 'Active' ? 'green' : 'amber'}`}>
                  {alert.status}
                </span>
                <span className={`ui-badge ${alert.severity === 'Critical' ? 'red' : alert.severity === 'High' ? 'amber' : ''}`}>
                  {alert.severity}
                </span>
              </div>
            </article>
          ))
        )}
      </main>
    </>
  );
};

export default Dashboard;
