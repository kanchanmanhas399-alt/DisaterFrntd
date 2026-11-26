import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ReportSingle } from '../../../services/EmergencyReport';
import { getIsLogin } from '../../../services/AuthServices';
import toast from 'react-hot-toast';
import Icon from './Icon';
import './citizen-ui.css';

const AssessmentResults = () => {
  const { id } = useParams();
  const nav = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!getIsLogin()) {
      toast.error("Please login to view emergency assessment results");
      nav("/login");
      return;
    }

    if (!id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    ReportSingle(id)
      .then((res) => {
        setReport(res.data.data);
      })
      .catch((err) => {
        const msg = err.response?.data?.message || "Failed to load assessment results";
        toast.error(msg);
      })
      .finally(() => setLoading(false));
  }, [id, nav]);

  const getPriorityTheme = (priority = '') => {
    const p = (priority || '').toLowerCase();
    if (p === 'critical') {
      return {
        tone: 'red',
        badge: 'ui-badge red',
        icon: 'siren'
      };
    }
    if (p === 'high') {
      return {
        tone: 'amber',
        badge: 'ui-badge amber',
        icon: 'alert'
      };
    }
    if (p === 'medium') {
      return {
        tone: 'green',
        badge: 'ui-badge green',
        icon: 'shield'
      };
    }
    return {
      tone: 'slate',
      badge: 'ui-badge',
      icon: 'info'
    };
  };

  const getStatusBadge = (status = '') => {
    const s = status.toLowerCase();
    if (s === 'resolved') return 'ui-badge green';
    if (s === 'responding' || s === 'in-progress') return 'ui-badge blue';
    if (s === 'under review' || s === 'verified') return 'ui-badge amber';
    if (s === 'rejected' || s === 'cancelled') return 'ui-badge red';
    return 'ui-badge';
  };

  if (loading) {
    return (
      <div className="cit-page">
        <section className="ui-hero">
          <div className="container ui-hero-inner">
            <div className="ui-hero-copy">
              <span className="ui-eyebrow">Central Decision-Support Evaluation</span>
              <h1>Emergency Assessment Results</h1>
              <p>Rule-based decision support, immediate safety guidance, and nearby resource matching.</p>
            </div>
          </div>
        </section>
        <main className="container ui-content">
          <div className="ui-state">
            <div className="ui-spinner" />
            <h3>Loading assessment</h3>
            <p>Evaluating rule-based assessment and fetching report details...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="cit-page">
        <section className="ui-hero">
          <div className="container ui-hero-inner">
            <div className="ui-hero-copy">
              <span className="ui-eyebrow">Central Decision-Support Evaluation</span>
              <h1>Emergency Assessment Results</h1>
              <p>Rule-based decision support, immediate safety guidance, and nearby resource matching.</p>
            </div>
          </div>
        </section>
        <main className="container ui-content">
          <div className="ui-state">
            <div className="state-icon"><Icon name="file" size={24} /></div>
            <h2>Assessment Not Found</h2>
            <p>
              The requested emergency report or assessment could not be found or you do not have permission to view it.
            </p>
            <div>
              <Link to="/my-reports" className="ui-btn ghost sm">My Reports</Link>
              <Link to="/emergency" className="ui-btn red sm">Report Emergency</Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const assessment = report.assessment || {};
  const priorityTheme = getPriorityTheme(assessment.priority || report.severity);
  const locationText = typeof report.location === 'object' ? report.location.address : report.location;

  return (
    <div className="cit-page">
      <section className="ui-hero">
        <div className="container ui-hero-inner">
          <div className="ui-hero-copy">
            <span className="ui-eyebrow">Central Decision-Support Evaluation</span>
            <h1>Emergency Assessment Results</h1>
            <p>
              Rule-based decision support, immediate safety guidance, and nearby emergency resource matching.
            </p>
            <div className="ui-hero-actions">
              <Link to="/my-reports" className="ui-btn ghost">
                Track in My Reports
              </Link>
              <Link to="/emergency" className="ui-btn red">
                <Icon name="plus" size={15} /> Report New Incident
              </Link>
            </div>
          </div>

          <div className="ui-hero-meta">
            <div>
              <Icon name={priorityTheme.icon} size={19} />
              <span><strong>{assessment.priority || report.severity}</strong> priority</span>
            </div>
            <div>
              <Icon name="clock" size={19} />
              <span>{new Date(report.dateTime || report.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </section>

      <main className="container ui-content">
        {(assessment.priority === 'Critical' || assessment.priority === 'High' || report.isSOS) && (
          <div className="ui-callout red">
            <Icon name="siren" size={21} />
            <div>
              <h4>URGENT EMERGENCY SAFETY NOTICE</h4>
              <p>
                In immediate life-threatening danger, do not wait for platform updates. Dial{' '}
                <strong>112</strong> immediately.
              </p>
              <a href="tel:112" className="ui-btn ghost sm">
                <Icon name="phone" size={14} /> Call 112
              </a>
            </div>
          </div>
        )}

        <section className="ui-card">
          <div className="ui-card-head">
            <span className={`ui-icon-tile lg tone-${priorityTheme.tone}`}>
              <Icon name={priorityTheme.icon} size={24} />
            </span>
            <div>
              <span className="ui-eyebrow dark">System Assessed Priority</span>
              <h2>{assessment.priority || report.severity} Priority</h2>
            </div>
            <div>
              <span className={getStatusBadge(report.status)}>
                Report Status: {report.status}
              </span>
              {assessment.isOverridden && (
                <span className="ui-badge blue" title={`Overridden by ${assessment.overriddenBy}`}>
                  Admin Override
                </span>
              )}
            </div>
          </div>

          <div className="ui-card-body">
            <div className={`ui-callout ${priorityTheme.tone}`}>
              <Icon name="info" size={18} />
              <div>
                <h4>Deterministic Rule Explanation:</h4>
                <p>
                  {assessment.explanation || `Incident assessed based on ${report.disasterType} hazard conditions, user-reported ${report.severity} severity, and reported affected population.`}
                </p>
                {assessment.isOverridden && assessment.overrideReason && (
                  <div className="ui-callout">
                    <Icon name="info" size={16} />
                    <div>
                      <p>
                        <strong>Administrator Override Reason:</strong> {assessment.overrideReason}
                      </p>
                      <p className="ui-hint">
                        Original Assessment: <strong>{assessment.originalPriority || report.severity}</strong>
                        {' '}&middot; Updated by {assessment.overriddenBy || 'Admin'} on{' '}
                        {new Date(assessment.overriddenAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="ui-grid cols-4">
              <div className="ui-detail-cell">
                <span>Hazard Type</span>
                <strong>{report.disasterType}</strong>
              </div>
              <div className="ui-detail-cell">
                <span>Submitted Severity</span>
                <strong>{report.severity}</strong>
              </div>
              <div className="ui-detail-cell">
                <span>Response Category</span>
                <strong>{assessment.responseCategory || "Emergency Assistance"}</strong>
              </div>
              <div className="ui-detail-cell">
                <span>Affected Individuals</span>
                <strong>{report.affectedPeople || 0} People</strong>
              </div>
            </div>
          </div>
        </section>

        <section className="ui-card">
          <div className="ui-card-head">
            <span className="ui-icon-tile amber sm"><Icon name="zap" size={18} /></span>
            <h3>Immediate Action Recommendations</h3>
          </div>
          <div className="ui-card-body">
            {assessment.immediateActions?.length > 0 ? (
              <ul className="ui-check-list">
                {assessment.immediateActions.map((act, idx) => (
                  <li key={idx}>
                    <Icon name="check" size={14} />
                    <span><strong>{act}</strong></span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="ui-hint">Follow standard civil safety precautions and monitor official updates.</p>
            )}

            {assessment.safetyGuidance?.length > 0 && (
              <div className="ui-callout amber">
                <Icon name="shield" size={18} />
                <div>
                  <h4>Disaster-Specific Safety Instructions:</h4>
                  <ul className="ui-list tone-amber">
                    {assessment.safetyGuidance.map((guide, idx) => (
                      <li key={idx}>{guide}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
          <div className="ui-card-foot">
            <Link to="/safety" className="ui-btn ghost sm">
              Browse All Disaster Safety Guidelines <Icon name="arrowRight" size={14} />
            </Link>
          </div>
        </section>

        <section className="ui-card">
          <div className="ui-card-head">
            <span className="ui-icon-tile sky sm"><Icon name="medical" size={18} /></span>
            <h3>Recommended Emergency Resources (Operational &amp; Available)</h3>
            <Link to="/resources" className="ui-btn ghost sm">All Resources</Link>
          </div>
          <div className="ui-card-body">
            <p className="ui-hint">
              Available facilities filtered by operational status (Full, Closed, and Unavailable resources are excluded).
            </p>

            {assessment.matchedResources?.length > 0 ? (
              <div className="ui-grid cols-2">
                {assessment.matchedResources.map((resItem) => (
                  <div key={resItem._id || resItem.name}>
                    <div className="ui-row tone-sky">
                      <span className="ui-icon-tile"><Icon name="building" size={20} /></span>
                      <div className="ui-row-main">
                        <span className="ui-row-title">
                          {resItem.name} <span className="ui-badge blue">{resItem.type}</span>
                        </span>
                        <span className="ui-row-meta">
                          <Icon name="mapPin" size={13} /> {resItem.address || "Area location"}
                        </span>
                        <p className="ui-row-desc">
                          <strong>Services:</strong> {resItem.services || "Emergency relief and support"}
                        </p>
                        {resItem.recommendationReason && (
                          <p className="ui-hint">
                            <Icon name="check" size={13} /> {resItem.recommendationReason}
                          </p>
                        )}
                        <span className="ui-hint">
                          <Icon name="phone" size={13} /> Contact:{' '}
                          <a href={`tel:${resItem.contact}`}>{resItem.contact}</a>
                        </span>
                      </div>
                      <div className="ui-row-side">
                        <span className="ui-badge green">{resItem.status}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="ui-state">
                <div className="state-icon"><Icon name="building" size={24} /></div>
                <h3>No active facilities</h3>
                <p>
                  No active facilities are currently registered for this zone. Contact regional emergency dispatch (112).
                </p>
              </div>
            )}
          </div>
        </section>

        {report.responseInstructions && (
          <div className="ui-callout green">
            <Icon name="clipboard" size={19} />
            <div>
              <h4>Official Administrator Response Instructions:</h4>
              <p>{report.responseInstructions}</p>
            </div>
          </div>
        )}

        <section className="ui-card">
          <div className="ui-card-head">
            <h3>Report Record Summary</h3>
          </div>
          <div className="ui-card-body">
            <div className="ui-detail-grid">
              <div className="ui-detail-cell">
                <span>Report ID</span>
                <strong><code>{report._id}</code></strong>
              </div>
              <div className="ui-detail-cell">
                <span>Incident Title</span>
                <strong>{report.title}</strong>
              </div>
              <div className="ui-detail-cell">
                <span>Location</span>
                <strong>{locationText}</strong>
              </div>
              <div className="ui-detail-cell">
                <span>Date Logged</span>
                <strong>{new Date(report.dateTime || report.createdAt).toLocaleString()}</strong>
              </div>
              <div className="ui-detail-cell">
                <span>Current Status</span>
                <strong><span className={getStatusBadge(report.status)}>{report.status}</span></strong>
              </div>
              <div className="ui-detail-cell">
                <span>Contact Reference</span>
                <strong>{report.contactNumber || "Associated user account"}</strong>
              </div>
            </div>

            <div className="ui-callout">
              <Icon name="file" size={18} />
              <div>
                <h4>Incident Description</h4>
                <p>{report.description}</p>
              </div>
            </div>

            {report.image && (
              <div className="ui-card-foot">
                <img
                  src={report.image}
                  alt="Incident verification"
                  width={300}
                />
              </div>
            )}
          </div>
        </section>

        <div className="ui-callout amber">
          <Icon name="info" size={18} />
          <div>
            <p>
              <strong>Decision Support Notice:</strong>{' '}
              {assessment.disclaimer || "This rule-based emergency assessment provides automated civil preparedness guidance and does not replace official emergency judgment or professional dispatch. In life-threatening emergencies, immediately dial national emergency services at 112."}
            </p>
          </div>
        </div>

        <section className="ui-card">
          <div className="ui-card-foot">
            <Link to="/my-reports" className="ui-btn ghost sm">
              <Icon name="arrowLeft" size={14} /> View My Reports &amp; History
            </Link>
            <div>
              <Link to="/resources" className="ui-btn ghost sm">Browse All Resources</Link>
              <Link to="/emergency" className="ui-btn red sm">
                <Icon name="plus" size={14} /> Report Another Emergency
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AssessmentResults;
