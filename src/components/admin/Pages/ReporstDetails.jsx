import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AdminReportSingle, ReportUpdate } from '../../../services/EmergencyReport';
import toast from 'react-hot-toast';
import Icon from '../../user/Pages/Icon';

const statusTone = (status = '') => {
  const s = status.toLowerCase();
  if (s === 'resolved') return 'green';
  if (s === 'responding') return 'blue';
  return 'amber';
};

const ReporstDetails = () => {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusVal, setStatusVal] = useState('Pending');
  const [responseInstructions, setResponseInstructions] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [note, setNote] = useState('');
  const [overridePriority, setOverridePriority] = useState('');
  const [overrideReason, setOverrideReason] = useState('');
  const [saving, setSaving] = useState(false);

  const loadReport = useCallback(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    AdminReportSingle(id)
      .then((res) => {
        const data = res.data.data;
        setReport(data);
        setStatusVal(data?.status || 'Pending');
        setResponseInstructions(data?.responseInstructions || '');
        setAdminNotes(data?.adminNotes || '');
        if (data?.assessment?.isOverridden) {
          setOverridePriority(data.assessment.overriddenPriority || '');
          setOverrideReason(data.assessment.overrideReason || '');
        }
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || 'Failed to load report details');
      })
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    loadReport();
  }, [loadReport]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!report) return;

    setSaving(true);
    try {
      const payload = {
        _id: report._id,
        status: statusVal,
        responseInstructions,
        adminNotes,
        note: note || `Status updated to ${statusVal}`,
        ...(overridePriority ? { overridePriority, overrideReason } : {})
      };

      await ReportUpdate(payload);
      toast.success(`Report status updated to ${statusVal}`);
      loadReport();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update report');
    } finally {
      setSaving(false);
    }
  };

  const hero = (
    <section className="ui-hero compact">
      <div className="container ui-hero-inner">
        <div className="ui-hero-copy">
          <span className="ui-eyebrow">Admin Console &middot; Reports</span>
          <h1>Emergency Report Details &amp; Assessment Review</h1>
          <p>Incident review, rule-based assessment, priority override, and response coordination.</p>
          <div className="ui-hero-actions">
            <button type="button" className="ui-btn ghost" onClick={() => window.print()}>
              <Icon name="file" size={15} /> Print Details
            </button>
            <Link to="/admin/reports" className="ui-btn ghost">
              <Icon name="arrowLeft" size={15} /> Back to List
            </Link>
          </div>
        </div>
        <div className="ui-hero-meta">
          <div>
            <Icon name="clipboard" size={18} />
            <span><strong>#{id?.slice(-6) || '—'}</strong> reference</span>
          </div>
          {report && (
            <div>
              <Icon name="activity" size={18} />
              <span><strong>{report.status}</strong> status</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );

  if (!id) {
    return (
      <>
        {hero}
        <main className="container ui-content compact-top">
          <div className="ui-state">
            <div className="state-icon"><Icon name="file" size={24} /></div>
            <h3>No Report Selected</h3>
            <p>Navigate through the Emergency Reports list to view incident details.</p>
            <Link to="/admin/reports" className="ui-btn ghost">
              <Icon name="arrowLeft" size={15} /> Back to Reports List
            </Link>
          </div>
        </main>
      </>
    );
  }

  if (loading) {
    return (
      <>
        {hero}
        <main className="container ui-content compact-top">
          <div className="ui-state">
            <div className="ui-spinner" />
            <h3>Loading report details</h3>
            <p>Fetching the incident record and its assessment&hellip;</p>
          </div>
        </main>
      </>
    );
  }

  if (!report) {
    return (
      <>
        {hero}
        <main className="container ui-content compact-top">
          <div className="ui-state">
            <div className="state-icon"><Icon name="search" size={24} /></div>
            <h3>Report Not Found</h3>
            <p>The requested incident record is unavailable.</p>
            <Link to="/admin/reports" className="ui-btn ghost">
              <Icon name="arrowLeft" size={15} /> Back to Reports List
            </Link>
          </div>
        </main>
      </>
    );
  }

  const assessment = report.assessment || {};

  return (
    <>
      {hero}
      <main className="container ui-content compact-top">
        <div className="ui-card">
          <div className="ui-card-head">
            <div>
              <h2>#{report._id?.slice(-6)} &middot; {report.title}</h2>
              <p>
                Submitted: {new Date(report.createdAt).toLocaleString()} &middot; Reporter:{' '}
                <strong>{report.userId?.name || 'Citizen'}</strong> ({report.userId?.email}) &middot; Phone:{' '}
                <strong>{report.contactNumber || report.userId?.phone || '—'}</strong>
              </p>
            </div>
            <div className="ad-table-actions">
              {report.isSOS && <span className="ui-badge red">Critical SOS</span>}
              <span className={`ui-badge ${statusTone(report.status)}`}>{report.status}</span>
            </div>
          </div>
          <div className="ui-card-body">
            <div className="ui-detail-grid">
              <div className="ui-detail-cell">
                <span>Hazard Type</span>
                <strong>{report.disasterType}</strong>
              </div>
              <div className="ui-detail-cell">
                <span>Location</span>
                <strong>{typeof report.location === 'object' ? report.location.address : report.location || 'Unspecified'}</strong>
              </div>
              <div className="ui-detail-cell">
                <span>Submitted Severity</span>
                <div>
                  <span className={`ui-badge ${report.severity === 'Critical' ? 'red' : 'amber'}`}>
                    {report.severity}
                  </span>
                </div>
              </div>
              <div className="ui-detail-cell">
                <span>Affected People</span>
                <strong>{report.affectedPeople || 0} individuals</strong>
              </div>
            </div>

            <span className="ui-label">Detailed Incident Description</span>
            <p>{report.description}</p>

            {report.image && (
              <div className="ui-detail-cell">
                <span>Incident Verification Photo</span>
                <img src={report.image} alt="Incident" width={350} />
              </div>
            )}
          </div>
        </div>

        {report.assessment && (
          <div className="ui-card">
            <div className="ui-card-head">
              <div>
                <h2>System-Generated Emergency Assessment</h2>
                <p>Rule-based guidance used to prioritise the response.</p>
              </div>
              <div className="ad-table-actions">
                <span className={`ui-badge ${assessment.priority === 'Critical' ? 'red' : assessment.priority === 'High' ? 'amber' : 'green'}`}>
                  Assessed Priority: {assessment.priority}
                </span>
                {assessment.isOverridden && <span className="ui-badge blue">Admin Overridden</span>}
              </div>
            </div>
            <div className="ui-card-body">
              <div className="ui-detail-grid">
                <div className="ui-detail-cell">
                  <span>Response Category</span>
                  <strong>{assessment.responseCategory || 'Emergency Assistance'}</strong>
                </div>
                <div className="ui-detail-cell">
                  <span>Original User Severity</span>
                  <strong>{assessment.originalSeverity || report.severity}</strong>
                </div>
              </div>

              {assessment.explanation && (
                <div className="ui-callout amber">
                  <Icon name="info" size={17} />
                  <div>
                    <h4>Deterministic Assessment Explanation</h4>
                    <p>{assessment.explanation}</p>
                  </div>
                </div>
              )}

              {assessment.isOverridden && (
                <div className="ui-callout">
                  <Icon name="settings" size={17} />
                  <div>
                    <h4>Priority Override Active</h4>
                    <p>
                      Overridden to <strong>{assessment.overriddenPriority}</strong> by{' '}
                      {assessment.overriddenBy || 'Admin'} on{' '}
                      {new Date(assessment.overriddenAt).toLocaleString()}. Reason:{' '}
                      {assessment.overrideReason || 'Administrative decision'}. Original system priority:{' '}
                      {assessment.originalPriority}
                    </p>
                  </div>
                </div>
              )}

              {assessment.immediateActions?.length > 0 && (
                <>
                  <span className="ui-label">Recommended Immediate Actions</span>
                  <ul className="ui-list">
                    {assessment.immediateActions.map((act, i) => <li key={i}>{act}</li>)}
                  </ul>
                </>
              )}

              {assessment.safetyGuidance?.length > 0 && (
                <>
                  <span className="ui-label">Disaster-Specific Safety Guidance</span>
                  <ul className="ui-list">
                    {assessment.safetyGuidance.map((guide, i) => <li key={i}>{guide}</li>)}
                  </ul>
                </>
              )}

              {assessment.matchedResources?.length > 0 && (
                <>
                  <span className="ui-label">Available Matching Resources</span>
                  <span className="ui-hint">Only resources with Available status are listed.</span>
                  <div className="ui-grid cols-2">
                    {assessment.matchedResources.map((res) => (
                      <div className="ui-detail-cell" key={res._id || res.name}>
                        <span>{res.type || 'Resource'}</span>
                        <strong>{res.name}</strong>
                        <div className="ui-hint">{res.address}</div>
                        {res.recommendationReason && (
                          <div className="ui-hint">{res.recommendationReason}</div>
                        )}
                        <div className="ui-hint">Contact: {res.contact}</div>
                        <div><span className="ui-badge green">{res.status}</span></div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        <form onSubmit={handleUpdate} className="ui-card">
          <div className="ui-card-head">
            <div>
              <h2>Update Incident Status &amp; Priority Override</h2>
              <p>Response instructions are visible to the citizen in their dashboard.</p>
            </div>
          </div>
          <div className="ui-card-body">
            <div className="ui-form-grid">
              <div className="ui-field">
                <label className="ui-label">Update Status Workflow <span className="req">*</span></label>
                <select
                  className="ui-select"
                  value={statusVal}
                  onChange={(e) => setStatusVal(e.target.value)}
                >
                  <option value="Pending">Pending</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Responding">Responding</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
              <div className="ui-field">
                <label className="ui-label">Audit Log Note</label>
                <input
                  type="text"
                  className="ui-input"
                  placeholder="e.g. Teams dispatched on site / Verification call made"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>
            </div>

            <div className="ui-callout">
              <Icon name="settings" size={17} />
              <div>
                <h4>Administrative Assessment Priority Override</h4>
                <p>Override the rule-based priority when field assessment differs. Recorded with explanation.</p>
                <div className="ui-form-grid">
                  <div className="ui-field">
                    <label className="ui-label">Override Priority</label>
                    <select
                      className="ui-select"
                      value={overridePriority}
                      onChange={(e) => setOverridePriority(e.target.value)}
                    >
                      <option value="">Keep System Priority ({assessment.priority || 'Current'})</option>
                      <option value="Critical">Critical</option>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                  <div className="ui-field">
                    <label className="ui-label">Override Justification / Explanation</label>
                    <input
                      type="text"
                      className="ui-input"
                      placeholder="e.g. On-ground police assessment confirms trapped victims"
                      value={overrideReason}
                      onChange={(e) => setOverrideReason(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="ui-field">
              <label className="ui-label">Response Instructions (Visible to Citizen)</label>
              <textarea
                className="ui-textarea"
                rows={3}
                placeholder="Official guidance from command center to affected citizen..."
                value={responseInstructions}
                onChange={(e) => setResponseInstructions(e.target.value)}
              />
            </div>

            <div className="ui-field">
              <label className="ui-label">Internal Administrator Notes (Confidential)</label>
              <textarea
                className="ui-textarea"
                rows={2}
                placeholder="Confidential coordination details with fire / NDRF / police..."
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
              />
            </div>
          </div>
          <div className="ui-card-foot">
            <span className="ui-hint">All status changes are recorded in the audit trail.</span>
            <button type="submit" className="ui-btn red" disabled={saving}>
              <Icon name="check" size={15} />
              {saving ? 'Saving Changes...' : 'Save Status & Transmit Instructions'}
            </button>
          </div>
        </form>

        {report.statusHistory?.length > 0 && (
          <div className="ui-card">
            <div className="ui-card-head"><h2>Status History &amp; Audit Trail</h2></div>
            <div className="ui-card-body">
              <ul className="ui-list">
                {report.statusHistory.map((hist, idx) => (
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
      </main>
    </>
  );
};

export default ReporstDetails;
