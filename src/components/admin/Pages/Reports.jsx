import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ReportAll, ReportUpdate, ReportDelete } from '../../../services/EmergencyReport';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import Icon from '../../user/Pages/Icon';

const statusTone = (status = '') => {
  const s = status.toLowerCase();
  if (s === 'resolved') return 'green';
  if (s === 'under review' || s === 'verified') return 'amber';
  if (s === 'pending' || s === 'responding' || s === 'in-progress' || s === 'rejected' || s === 'cancelled') return 'red';
  return '';
};

const severityTone = (severity = '') => {
  const s = severity.toLowerCase();
  if (s === 'critical') return 'red';
  if (s === 'high') return 'amber';
  return 'red';
};

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');
  const [sosOnly, setSosOnly] = useState(false);

  // Detail modal & status update state
  const [selectedReport, setSelectedReport] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [updateStatusVal, setUpdateStatusVal] = useState('Pending');
  const [responseInstructions, setResponseInstructions] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [statusNote, setStatusNote] = useState('');
  const [overridePriority, setOverridePriority] = useState('');
  const [overrideReason, setOverrideReason] = useState('');
  const [updating, setUpdating] = useState(false);
  const [updatingReportIds, setUpdatingReportIds] = useState([]);

  const loadReports = useCallback(() => {
    setLoading(true);
    ReportAll()
      .then((res) => {
        setReports(res.data.data || []);
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || 'Unable to load reports');
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  const openReportDetails = (report) => {
    setSelectedReport(report);
    setUpdateStatusVal(report.status || 'Pending');
    setResponseInstructions(report.responseInstructions || '');
    setAdminNotes(report.adminNotes || '');
    setStatusNote('');
    setOverridePriority(report.assessment?.overriddenPriority || '');
    setOverrideReason(report.assessment?.overrideReason || '');
    setIsDetailOpen(true);
  };

  const handleUpdateReport = async (e) => {
    if (e) e.preventDefault();
    if (!selectedReport) return;

    setUpdating(true);
    try {
      const payload = {
        _id: selectedReport._id,
        status: updateStatusVal,
        responseInstructions,
        adminNotes,
        note: statusNote || `Status updated to ${updateStatusVal}`,
        ...(overridePriority ? { overridePriority, overrideReason } : {})
      };

      const res = await ReportUpdate(payload);
      toast.success(res.data.message || `Report updated to ${updateStatusVal}`);
      setIsDetailOpen(false);
      setSelectedReport(null);
      loadReports();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update report status');
    } finally {
      setUpdating(false);
    }
  };

  const handleQuickStatus = async (report, newStatus) => {
    if (updatingReportIds.includes(report._id)) return;
    setUpdatingReportIds((current) => [...current, report._id]);
    setReports((current) => current.map((item) => item._id === report._id ? { ...item, status: newStatus } : item));
    try {
      const response = await ReportUpdate({
        _id: report._id,
        status: newStatus,
        note: `Quick action: changed status to ${newStatus}`
      });
      setReports((current) => current.map((item) => item._id === report._id ? { ...item, ...(response.data.data || {}), status: newStatus } : item));
      toast.success(response.data.message || `Report status set to ${newStatus}`);
    } catch (err) {
      setReports((current) => current.map((item) => item._id === report._id ? { ...item, status: report.status } : item));
      toast.error(err.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdatingReportIds((current) => current.filter((id) => id !== report._id));
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Are you sure you want to permanently delete this report record?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await ReportDelete(id);
          Swal.fire({
            title: 'Deleted!',
            text: 'Report deleted successfully.',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });
          loadReports();
        } catch (err) {
          Swal.fire({
            title: 'Error!',
            text: err.response?.data?.message || 'Failed to delete report.',
            icon: 'error'
          });
        }
      }
    });
  };

  const filteredReports = reports.filter((item) => {
    const matchesSearch =
      (item.title || '').toLowerCase().includes(search.toLowerCase()) ||
      (item.disasterType || '').toLowerCase().includes(search.toLowerCase()) ||
      (item.location?.address || '').toLowerCase().includes(search.toLowerCase()) ||
      (item.userId?.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (item.description || '').toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter ? item.status === statusFilter : true;
    const matchesSeverity = severityFilter ? item.severity === severityFilter : true;
    const matchesSOS = sosOnly ? Boolean(item.isSOS) : true;

    return matchesSearch && matchesStatus && matchesSeverity && matchesSOS;
  });

  const sosCount = reports.filter((item) => item.isSOS).length;

  return (
    <>
      <section className="ui-hero compact">
        <div className="container ui-hero-inner">
          <div className="ui-hero-copy">
            <span className="ui-eyebrow">Admin Console &middot; Reports</span>
            <h1>Emergency Report Management</h1>
            <p>Review citizen reports, assign response statuses, and transmit dispatcher instructions.</p>
            <div className="ui-hero-actions">
              <button
                type="button"
                className={`ui-btn ${sosOnly ? 'red' : 'ghost'}`}
                onClick={() => setSosOnly(!sosOnly)}
              >
                <Icon name="alert" size={15} /> {sosOnly ? 'Show All Reports' : 'Filter SOS Only'}
              </button>
              <button type="button" className="ui-btn ghost" onClick={loadReports}>
                <Icon name="refresh" size={15} /> Refresh
              </button>
            </div>
          </div>
          <div className="ui-hero-meta">
            <div>
              <Icon name="file" size={18} />
              <span><strong>{reports.length}</strong> total reports</span>
            </div>
            <div>
              <Icon name="siren" size={18} />
              <span><strong>{sosCount}</strong> SOS beacons</span>
            </div>
          </div>
        </div>
      </section>

      <main className="container ui-content compact-top">
        <div className="ui-toolbar">
          <label className="ui-search">
            <Icon name="search" size={16} />
            <input
              type="search"
              className="ui-input"
              placeholder="Search reports by title, hazard, location, reporter..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search reports"
            />
          </label>
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
            <option value="Rejected">Rejected</option>
          </select>
          <select
            className="ui-select"
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            aria-label="Filter by severity"
          >
            <option value="">All severities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        {loading ? (
          <div className="ui-state">
            <div className="ui-spinner" />
            <h3>Loading emergency reports</h3>
            <p>Fetching citizen submissions and system assessments&hellip;</p>
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="ui-state">
            <div className="state-icon"><Icon name="file" size={24} /></div>
            <h3>No emergency reports found</h3>
            <p>Adjust your search or filters to see more incidents.</p>
          </div>
        ) : (
          <div className="ui-table-wrap">
            <table className="ui-table">
              <thead>
                <tr>
                  <th>Incident Details</th>
                  <th>Reported By</th>
                  <th>Hazard Type</th>
                  <th>Location</th>
                  <th>Severity</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.map((item) => (
                  <tr key={item._id}>
                    <td>
                      <strong>{item.title}</strong>
                      {item.isSOS && <span className="ui-badge red">SOS</span>}
                      <div className="muted">{item.description}</div>
                    </td>
                    <td>
                      <strong>{item.userId?.name || 'Citizen'}</strong>
                      <div className="muted">{item.userId?.email || ''}</div>
                      {item.contactNumber && <div className="muted">Tel: {item.contactNumber}</div>}
                    </td>
                    <td>{item.disasterType}</td>
                    <td>{item.location?.address || '—'}</td>
                    <td>
                      <span className={`ui-badge ${severityTone(item.severity)}`}>
                        {item.severity}
                      </span>
                    </td>
                    <td className="muted">{new Date(item.createdAt).toLocaleDateString()}</td>
                    <td>
                      <span className={`ui-badge ${statusTone(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td>
                      <div className="ad-table-actions">
                        <Link
                          className="ui-btn sm plain"
                          to={`/admin/report-details/${item._id}`}
                        >
                          <Icon name="clipboard" size={15} /> Review &amp; Manage
                        </Link>
                        <button
                          type="button"
                          className="ui-btn sm ghost"
                          onClick={() => openReportDetails(item)}
                          aria-label="Open review modal"
                        >
                          <Icon name="eye" size={15} />
                        </button>

                        {item.status === 'Pending' && (
                          <button
                            type="button"
                            className="ui-btn sm primary"
                            onClick={() => handleQuickStatus(item, 'Under Review')}
                            disabled={updatingReportIds.includes(item._id)}
                            title="Mark Under Review"
                          >
                            {updatingReportIds.includes(item._id) ? 'Updating...' : 'Review'}
                          </button>
                        )}

                        {item.status === 'Under Review' && (
                          <button
                            type="button"
                            className="ui-btn sm primary"
                            onClick={() => handleQuickStatus(item, 'Responding')}
                            disabled={updatingReportIds.includes(item._id)}
                            title="Dispatch Responders"
                          >
                            {updatingReportIds.includes(item._id) ? 'Updating...' : 'Respond'}
                          </button>
                        )}

                        {item.status === 'Responding' && (
                          <button
                            type="button"
                            className="ui-btn sm green"
                            onClick={() => handleQuickStatus(item, 'Resolved')}
                            disabled={updatingReportIds.includes(item._id)}
                            title="Resolve Incident"
                          >
                            {updatingReportIds.includes(item._id) ? 'Updating...' : 'Resolve'}
                          </button>
                        )}

                        <button
                          type="button"
                          className="ui-btn sm red"
                          onClick={() => handleDelete(item._id)}
                          aria-label="Delete report"
                          title="Delete"
                        >
                          <Icon name="trash" size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {isDetailOpen && selectedReport && (
        <div className="ui-backdrop">
          <div className="ui-modal" role="dialog" aria-modal="true" aria-label="Review emergency report">
            <div className="ui-modal-top">
              <div>
                <span className="eyebrow">Report review &middot; #{selectedReport._id?.slice(-6)}</span>
                <h2>{selectedReport.title}</h2>
              </div>
              <button
                type="button"
                className="ui-modal-close"
                aria-label="Close report review"
                onClick={() => setIsDetailOpen(false)}
              >
                <Icon name="x" size={16} />
              </button>
            </div>

            <form onSubmit={handleUpdateReport}>
              <div className="ui-modal-body">
                <div className="ui-row">
                  <div className="ui-row-main">
                    <div className="ad-table-actions">
                      <span className={`ui-badge ${statusTone(selectedReport.status)}`}>
                        Current: {selectedReport.status}
                      </span>
                      {selectedReport.isSOS && <span className="ui-badge red">SOS Incident</span>}
                    </div>
                  </div>
                </div>

                <div className="ui-detail-grid">
                  <div className="ui-detail-cell">
                    <span>Reporter Name</span>
                    <strong>{selectedReport.userId?.name || 'Citizen'}</strong>
                  </div>
                  <div className="ui-detail-cell">
                    <span>Email</span>
                    <strong>{selectedReport.userId?.email || '—'}</strong>
                  </div>
                  <div className="ui-detail-cell">
                    <span>Phone / Contact</span>
                    <strong>{selectedReport.contactNumber || selectedReport.userId?.phone || '—'}</strong>
                  </div>
                  <div className="ui-detail-cell">
                    <span>Disaster Type</span>
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
                    <span>Submitted At</span>
                    <strong>{new Date(selectedReport.createdAt).toLocaleString()}</strong>
                  </div>
                </div>

                <div className="ui-card">
                  <div className="ui-card-head"><h3>Incident record</h3></div>
                  <div className="ui-card-body">
                    <span className="ui-label">Incident Location</span>
                    <p>{selectedReport.location?.address || 'Unspecified'}</p>
                    <span className="ui-label">Full Incident Description</span>
                    <p>{selectedReport.description}</p>
                    {selectedReport.image && (
                      <div className="ui-detail-cell">
                        <span>Submitted Incident Photo</span>
                        <img src={selectedReport.image} alt="Incident verification" width={300} />
                      </div>
                    )}
                  </div>
                </div>

                {selectedReport.assessment && (
                  <div className="ui-card">
                    <div className="ui-card-head">
                      <h3>Rule-Based Emergency Assessment</h3>
                      <span className={`ui-badge ${selectedReport.assessment.priority === 'Critical' ? 'red' : 'amber'}`}>
                        Priority: {selectedReport.assessment.priority}
                      </span>
                    </div>
                    <div className="ui-card-body">
                      <div className="ui-detail-grid">
                        <div className="ui-detail-cell">
                          <span>Response Category</span>
                          <strong>{selectedReport.assessment.responseCategory}</strong>
                        </div>
                      </div>

                      {selectedReport.assessment.explanation && (
                        <div className="ui-callout amber">
                          <Icon name="info" size={17} />
                          <div>
                            <h4>Explanation</h4>
                            <p>{selectedReport.assessment.explanation}</p>
                          </div>
                        </div>
                      )}

                      {selectedReport.assessment.isOverridden && (
                        <div className="ui-callout">
                          <Icon name="settings" size={17} />
                          <div>
                            <h4>Admin Override Active</h4>
                            <p>
                              Overridden to {selectedReport.assessment.overriddenPriority} ({selectedReport.assessment.overrideReason})
                            </p>
                          </div>
                        </div>
                      )}

                      {selectedReport.assessment.immediateActions?.length > 0 && (
                        <span className="ui-label">Recommended Immediate Actions</span>
                      )}
                      {selectedReport.assessment.immediateActions?.length > 0 && (
                        <ul className="ui-list">
                          {selectedReport.assessment.immediateActions.map((act, i) => <li key={i}>{act}</li>)}
                        </ul>
                      )}

                      {selectedReport.assessment.matchedResources?.length > 0 && (
                        <>
                          <span className="ui-label">Matching Resources</span>
                          <span className="ui-hint">Available units only &mdash; full or closed resources are excluded.</span>
                          <div className="ui-grid cols-2">
                            {selectedReport.assessment.matchedResources.map((resItem) => (
                              <div className="ui-detail-cell" key={resItem._id}>
                                <span>{resItem.type || 'Resource'}</span>
                                <strong>{resItem.name}</strong>
                                <div className="ui-hint">{resItem.address}</div>
                                <div className="ui-hint">Contact: {resItem.contact}</div>
                                <div><span className="ui-badge green">{resItem.status}</span></div>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}

                <div className="ui-card">
                  <div className="ui-card-head">
                    <h3>Update Report Status &amp; Transmit Instructions</h3>
                  </div>
                  <div className="ui-card-body">
                    <div className="ui-form-grid">
                      <div className="ui-field">
                        <label className="ui-label">Update Status Workflow <span className="req">*</span></label>
                        <select
                          className="ui-select"
                          value={updateStatusVal}
                          onChange={(e) => setUpdateStatusVal(e.target.value)}
                          required
                        >
                          <option value="Pending">Pending (Awaiting Dispatcher)</option>
                          <option value="Under Review">Under Review (Assessing Situation)</option>
                          <option value="Responding">Responding (Teams Dispatched)</option>
                          <option value="Resolved">Resolved (Incident Addressed)</option>
                          <option value="Rejected">Rejected (Invalid / Non-actionable)</option>
                        </select>
                      </div>
                      <div className="ui-field">
                        <label className="ui-label">Status Change Reason / Log Note</label>
                        <input
                          type="text"
                          className="ui-input"
                          placeholder="e.g. Dispatched rescue boat unit 3"
                          value={statusNote}
                          onChange={(e) => setStatusNote(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="ui-callout">
                      <Icon name="settings" size={17} />
                      <div>
                        <h4>Assessment Priority Override</h4>
                        <div className="ui-form-grid">
                          <div className="ui-field">
                            <label className="ui-label">Override Priority</label>
                            <select
                              className="ui-select"
                              value={overridePriority}
                              onChange={(e) => setOverridePriority(e.target.value)}
                            >
                              <option value="">Keep System Priority ({selectedReport.assessment?.priority || 'Current'})</option>
                              <option value="Critical">Critical</option>
                              <option value="High">High</option>
                              <option value="Medium">Medium</option>
                              <option value="Low">Low</option>
                            </select>
                          </div>
                          <div className="ui-field">
                            <label className="ui-label">Override Reason</label>
                            <input
                              type="text"
                              className="ui-input"
                              placeholder="e.g. Verified life danger via emergency services"
                              value={overrideReason}
                              onChange={(e) => setOverrideReason(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="ui-field">
                      <label className="ui-label">Official Response Instructions (Visible to Citizen)</label>
                      <textarea
                        className="ui-textarea"
                        rows={2}
                        placeholder="e.g. Emergency response team has been dispatched to your location. Please move to the roof with visible signaling cloth."
                        value={responseInstructions}
                        onChange={(e) => setResponseInstructions(e.target.value)}
                      />
                    </div>

                    <div className="ui-field">
                      <label className="ui-label">Administrative Notes (Internal Only)</label>
                      <textarea
                        className="ui-textarea"
                        rows={2}
                        placeholder="Internal notes regarding coordination with local fire brigade or NDRF..."
                        value={adminNotes}
                        onChange={(e) => setAdminNotes(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {selectedReport.statusHistory?.length > 0 && (
                  <div className="ui-card">
                    <div className="ui-card-head"><h3>Status History &amp; Audit Trail</h3></div>
                    <div className="ui-card-body">
                      <ul className="ui-list">
                        {selectedReport.statusHistory.map((hist, idx) => (
                          <li key={idx}>
                            <span className={`ui-badge ${statusTone(hist.status)}`}>{hist.status}</span>
                            <span className="ui-hint">
                              {new Date(hist.changedAt).toLocaleString()} by {hist.changedByName || 'Admin'}
                            </span>
                            <span>{hist.note}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              <div className="ui-modal-foot">
                <small>Status changes are recorded in the audit trail.</small>
                <div>
                  <button
                    type="button"
                    className="ui-btn ghost"
                    onClick={() => setIsDetailOpen(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="ui-btn red" disabled={updating}>
                    <Icon name="check" size={15} />
                    {updating ? 'Saving Changes...' : 'Save Status & Transmit Instructions'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Reports;
