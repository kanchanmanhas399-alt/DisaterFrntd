import React, { useEffect, useState, useCallback } from 'react';
import { GetMyReports } from '../../../services/EmergencyReport';
import { getIsLogin } from '../../../services/AuthServices';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Icon from './Icon';
import './citizen-ui.css';

const EmergencyHistory = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [search, setSearch] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);

  const nav = useNavigate();

  const loadReports = useCallback(() => {
    if (!getIsLogin()) {
      toast.error("Please login to view your emergency reports");
      nav("/login");
      return;
    }

    setLoading(true);
    GetMyReports()
      .then((res) => {
        setReports(res.data.data || []);
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || "Failed to load report history");
      })
      .finally(() => setLoading(false));
  }, [nav]);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  const filteredReports = reports.filter((item) => {
    const matchesSearch =
      (item.title || '').toLowerCase().includes(search.toLowerCase()) ||
      (item.disasterType || '').toLowerCase().includes(search.toLowerCase()) ||
      (item.location?.address || '').toLowerCase().includes(search.toLowerCase()) ||
      (item.description || '').toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter ? item.status === statusFilter : true;
    const matchesType = typeFilter ? item.disasterType === typeFilter : true;

    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadge = (status = '') => {
    const s = status.toLowerCase();
    if (s === 'resolved') return 'ui-badge green';
    if (s === 'responding' || s === 'in-progress' || s === 'pending') return 'ui-badge red';
    if (s === 'under review' || s === 'verified') return 'ui-badge amber';
    if (s === 'rejected' || s === 'cancelled') return 'ui-badge red';
    return 'ui-badge';
  };

  return (
    <div className="cit-page">
      <section className="ui-hero">
        <div className="container ui-hero-inner">
          <div className="ui-hero-copy">
            <span className="ui-eyebrow">Citizen Report Records</span>
            <h1>My Emergency Report History</h1>
            <p>
              Track live dispatcher status, response instructions, and assessment guidance for your reports.
            </p>
            <div className="ui-hero-actions">
              <Link to="/emergency" className="ui-btn red">
                <Icon name="plus" size={15} /> Report New Incident
              </Link>
            </div>
          </div>

          <div className="ui-hero-meta">
            <div>
              <Icon name="file" size={19} />
              <span><strong>{loading ? '—' : reports.length}</strong> total reports</span>
            </div>
            <div>
              <Icon name="search" size={19} />
              <span><strong>{loading ? '—' : filteredReports.length}</strong> matching this view</span>
            </div>
          </div>
        </div>
      </section>

      <main className="container ui-content">
        <div className="ui-toolbar">
          <label className="ui-search">
            <Icon name="search" size={16} />
            <input
              type="search"
              className="ui-input"
              placeholder="Search your reports by title, location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search your reports"
            />
          </label>

          <div className="ui-field">
            <span className="ui-label">Status</span>
            <select
              className="ui-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filter by status"
            >
              <option value="">All statuses</option>
              <option value="Pending">Pending</option>
              <option value="Under Review">Under Review</option>
              <option value="Responding">Responding</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          <div className="ui-field">
            <span className="ui-label">Hazard type</span>
            <select
              className="ui-select"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              aria-label="Filter by hazard type"
            >
              <option value="">All hazard types</option>
              <option value="Flood">Flood</option>
              <option value="Earthquake">Earthquake</option>
              <option value="Fire">Fire</option>
              <option value="Landslide">Landslide</option>
              <option value="Cyclone">Cyclone</option>
              <option value="Storm">Storm</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <button type="button" className="ui-btn ghost" onClick={loadReports}>
            <Icon name="refresh" size={15} /> Refresh
          </button>
        </div>

        <div className="ui-table-wrap">
          <table className="ui-table">
            <thead>
              <tr>
                <th>Report Title</th>
                <th>Hazard Type</th>
                <th>Location</th>
                <th>Severity</th>
                <th>Submitted Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7">
                    <div className="ui-state">
                      <div className="ui-spinner" />
                      <p>Loading your reports...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredReports.length === 0 ? (
                <tr>
                  <td colSpan="7">
                    <div className="ui-state">
                      <div className="state-icon"><Icon name="search" size={24} /></div>
                      <h3>No reports found</h3>
                      <p>No emergency reports found.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredReports.map((report) => (
                  <tr key={report._id}>
                    <td>
                      <strong>{report.title}</strong>
                      {report.isSOS && (
                        <span className="ui-badge red">SOS</span>
                      )}
                      <span className="ui-row-desc">{report.description}</span>
                    </td>
                    <td>{report.disasterType}</td>
                    <td>{report.location?.address || "—"}</td>
                    <td>
                      <span className="ui-badge red">{report.severity}</span>
                    </td>
                    <td>{new Date(report.createdAt).toLocaleDateString()}</td>
                    <td>
                      <span className={getStatusBadge(report.status)}>
                        {report.status}
                      </span>
                    </td>
                    <td>
                      <Link
                        to={`/assessment-results/${report._id}`}
                        className="ui-btn primary sm"
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
      </main>

      {selectedReport && (
        <div className="ui-backdrop">
          <div className="ui-modal">
            <div className="ui-modal-top">
              <div>
                <span className="eyebrow">Report Quick View</span>
                <h2>{selectedReport.title}</h2>
                <div>
                  <span className={getStatusBadge(selectedReport.status)}>
                    {selectedReport.status}
                  </span>
                  {selectedReport.isSOS && <span className="ui-badge red">CRITICAL SOS</span>}
                </div>
              </div>
              <button
                type="button"
                className="ui-modal-close"
                aria-label="Close report details"
                onClick={() => setSelectedReport(null)}
              >
                <Icon name="x" size={16} />
              </button>
            </div>

            <div className="ui-modal-body">
              <div className="ui-detail-grid">
                <div className="ui-detail-cell">
                  <span>Hazard</span>
                  <strong>{selectedReport.disasterType}</strong>
                </div>
                <div className="ui-detail-cell">
                  <span>Severity</span>
                  <strong>{selectedReport.severity}</strong>
                </div>
                <div className="ui-detail-cell">
                  <span>Affected People</span>
                  <strong>{selectedReport.affectedPeople || 0}</strong>
                </div>
                <div className="ui-detail-cell">
                  <span>Date</span>
                  <strong>{new Date(selectedReport.createdAt).toLocaleString()}</strong>
                </div>
              </div>

              <section className="ui-card">
                <div className="ui-card-body">
                  <h3>Incident Details</h3>
                  <div className="ui-detail-grid">
                    <div className="ui-detail-cell">
                      <span>Incident Location</span>
                      <strong>{selectedReport.location?.address || "Unspecified"}</strong>
                    </div>
                    <div className="ui-detail-cell">
                      <span>Description</span>
                      <strong>{selectedReport.description}</strong>
                    </div>
                  </div>

                  {selectedReport.image && (
                    <div className="ui-card-foot">
                      <img
                        src={selectedReport.image}
                        alt="Incident"
                        width={260}
                      />
                    </div>
                  )}
                </div>
              </section>

              {selectedReport.responseInstructions && (
                <div className="ui-callout green">
                  <Icon name="clipboard" size={19} />
                  <div>
                    <h4>Official Administrator Response Instructions:</h4>
                    <p>{selectedReport.responseInstructions}</p>
                  </div>
                </div>
              )}

              {selectedReport.assessment && (
                <section className="ui-card">
                  <div className="ui-card-head">
                    <h3>System-Generated Assessment Guidance</h3>
                    <span className="ui-badge blue">Rule-based</span>
                  </div>
                  <div className="ui-card-body">
                    <div className="ui-detail-grid">
                      <div className="ui-detail-cell">
                        <span>Response Category</span>
                        <strong>{selectedReport.assessment.responseCategory}</strong>
                      </div>
                      <div className="ui-detail-cell">
                        <span>Assessed Priority</span>
                        <strong>
                          <span className={selectedReport.assessment.priority === 'Critical' ? 'ui-badge red' : 'ui-badge'}>
                            {selectedReport.assessment.priority}
                          </span>
                        </strong>
                      </div>
                    </div>

                    {selectedReport.assessment.immediateActions?.length > 0 && (
                      <div>
                        <h4>Immediate Recommended Actions:</h4>
                        <ul className="ui-check-list">
                          {selectedReport.assessment.immediateActions.map((act, i) => (
                            <li key={i}>
                              <Icon name="check" size={14} />
                              <span>{act}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {selectedReport.assessment.matchedResources?.length > 0 && (
                      <div>
                        <h4>Available Nearby Emergency Resources:</h4>
                        <ul className="ui-list tone-green">
                          {selectedReport.assessment.matchedResources.map((resItem) => (
                            <li key={resItem._id}>
                              <strong>{resItem.name}</strong> ({resItem.type}) &middot; Contact: {resItem.contact} &middot; Status:{' '}
                              <span className="ui-badge green">{resItem.status}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="ui-callout amber">
                      <Icon name="info" size={17} />
                      <div>
                        <p>{selectedReport.assessment.disclaimer}</p>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {selectedReport.statusHistory?.length > 0 && (
                <section className="ui-card">
                  <div className="ui-card-head">
                    <h3>Status History Timeline</h3>
                  </div>
                  <div className="ui-card-body">
                    <ul className="ui-list tone-slate">
                      {selectedReport.statusHistory.map((hist, idx) => (
                        <li key={idx}>
                          <span className={getStatusBadge(hist.status)}>{hist.status}</span>
                          <span className="ui-hint">{new Date(hist.changedAt).toLocaleString()}</span>
                          <span className="ui-row-desc">{hist.note || "Status updated"}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>
              )}
            </div>

            <div className="ui-modal-foot">
              <Link
                to={`/assessment-results/${selectedReport._id}`}
                className="ui-btn red sm"
              >
                Open Full Assessment Results <Icon name="arrowRight" size={14} />
              </Link>
              <button
                type="button"
                className="ui-btn ghost sm"
                onClick={() => setSelectedReport(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmergencyHistory;
