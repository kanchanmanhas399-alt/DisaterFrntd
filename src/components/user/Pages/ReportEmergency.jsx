import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { EmergencyAdd, UploadImage } from '../../../services/EmergencyReport';
import { DisasterCategoryAdminGetAll } from '../../../services/adminServices';
import { getIsLogin } from '../../../services/AuthServices';
import Icon from './Icon';
import './citizen-ui.css';

const DEFAULT_CATEGORIES = [
  { name: 'Flood' },
  { name: 'Earthquake' },
  { name: 'Fire' },
  { name: 'Landslide' },
  { name: 'Cyclone' },
  { name: 'Storm' },
  { name: 'Other' },
];

const SEVERITY_OPTIONS = [
  { value: 'Low', label: 'Low', note: 'Minor hazard or advisory', icon: 'info', tone: 'tone-green', badge: 'green' },
  { value: 'Medium', label: 'Medium', note: 'Moderate threat', icon: 'alert', tone: 'tone-amber', badge: 'amber' },
  { value: 'High', label: 'High', note: 'Severe danger; evacuation likely', icon: 'alert', tone: 'tone-amber', badge: 'amber' },
  { value: 'Critical', label: 'Critical', note: 'Immediate danger to life', icon: 'siren', tone: 'tone-red', badge: 'red' },
];

const ReportEmergency = () => {
  const [disasterType, setDisasterType] = useState('Flood');
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [severity, setSeverity] = useState('Medium');
  const [affectedPeople, setAffectedPeople] = useState(0);
  const [dateTime, setDateTime] = useState(() => new Date().toISOString().slice(0, 16));
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [categories, setCategories] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [submittedReport, setSubmittedReport] = useState(null);

  const nav = useNavigate();

  useEffect(() => {
    if (!getIsLogin()) {
      toast.error('Please login to report an emergency', { id: 'auth-report' });
      nav('/login');
      return;
    }

    DisasterCategoryAdminGetAll()
      .then((res) => setCategories(res.data.data || []))
      .catch(() => setCategories(DEFAULT_CATEGORIES));
  }, [nav]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) {
      setSelectedFile(null);
      setImagePreview('');
      return;
    }
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const resetForm = () => {
    setTitle('');
    setLocation('');
    setDescription('');
    setAffectedPeople(0);
    setSelectedFile(null);
    setImagePreview('');
  };

  const handleForm = async (event) => {
    event.preventDefault();

    if (!title.trim() || !location.trim() || !description.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    let imageUrl = '';

    try {
      if (selectedFile) {
        const formData = new FormData();
        formData.append('image', selectedFile);
        try {
          const uploadRes = await UploadImage(formData);
          imageUrl = uploadRes.data.url || '';
        } catch (uploadErr) {
          console.warn('Image upload failed, using local preview:', uploadErr.message);
          imageUrl = imagePreview;
        }
      }

      const payload = {
        title: title.trim(),
        disasterType,
        location: location.trim(),
        severity,
        affectedPeople: parseInt(affectedPeople, 10) || 0,
        dateTime: dateTime ? new Date(dateTime) : new Date(),
        description: description.trim(),
        image: imageUrl,
      };

      const res = await EmergencyAdd(payload);
      toast.success(res.data.message || 'Emergency report submitted successfully!');

      const reportId = res.data.data?._id;
      if (reportId) {
        nav(`/assessment-results/${reportId}`);
      } else {
        setSubmittedReport(res.data.data);
      }
      resetForm();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to submit emergency report');
    } finally {
      setSubmitting(false);
    }
  };

  const assessment = submittedReport?.assessment;

  return (
    <div className="cit-page">
      <section className="ui-hero">
        <div className="container ui-hero-inner">
          <div className="ui-hero-copy">
            <span className="ui-eyebrow">Incident reporting</span>
            <h1>Report an emergency</h1>
            <p>
              Give a clear account of what is happening, where it is and who is affected.
              The system will generate initial guidance and a suggested response category
              from the details you provide.
            </p>
          </div>
          <div className="ui-hero-meta">
            <div>
              <Icon name="phone" size={19} />
              <span><strong>112</strong> for life-threatening danger</span>
            </div>
            <div>
              <Icon name="info" size={19} />
              <span>Guidance and reporting, not dispatch</span>
            </div>
          </div>
        </div>
      </section>

      <main className="container ui-content">
        <div className="ui-callout red">
          <Icon name="phone" size={18} />
          <div>
            <h4>Life in immediate danger? Call 112 now.</h4>
            <p>Use this form for reporting and guidance, not for dispatching responders.</p>
          </div>
        </div>

        <div className="ui-split">
          <div>
            {submittedReport && (
              <section className="ui-card">
                <div className="ui-card-head">
                  <div>
                    <span className="ui-eyebrow dark">Report recorded</span>
                    <h2>{submittedReport.title}</h2>
                  </div>
                  <span className="ui-badge green">{submittedReport.status || 'Received'}</span>
                </div>
                <div className="ui-card-body">
                  <p>
                    <strong>{submittedReport.title}</strong> has been logged. Keep the reference
                    number for follow-up.
                  </p>
                  {assessment && (
                    <>
                      <div className="ui-section-head">
                        <div>
                          <h2>Initial system assessment</h2>
                          <p>Based on the details you submitted</p>
                        </div>
                      </div>
                      <div className="ui-detail-grid">
                        <div className="ui-detail-cell">
                          <span>Response category</span>
                          <strong>{assessment.responseCategory || 'Emergency assistance'}</strong>
                        </div>
                        <div className="ui-detail-cell">
                          <span>Assessed priority</span>
                          <strong>{assessment.priority || 'Not set'}</strong>
                        </div>
                      </div>

                      {assessment.immediateActions?.length > 0 && (
                        <div className="ui-callout green">
                          <Icon name="check" size={17} />
                          <div>
                            <h4>Immediate actions</h4>
                            <ul className="ui-check-list">
                              {assessment.immediateActions.map((action, index) => (
                                <li key={index}><Icon name="check" size={14} /><span>{action}</span></li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                      {assessment.safetyGuidance?.length > 0 && (
                        <div className="ui-callout">
                          <Icon name="shield" size={17} />
                          <div>
                            <h4>Safety guidance</h4>
                            <ul className="ui-check-list">
                              {assessment.safetyGuidance.map((guide, index) => (
                                <li key={index}><Icon name="check" size={14} /><span>{guide}</span></li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                      {assessment.matchedResources?.length > 0 && (
                        <div className="ui-section-head">
                          <div>
                            <h2>Nearby facilities</h2>
                            <p>Suggested by the system &mdash; call ahead to confirm</p>
                          </div>
                        </div>
                      )}
                      {assessment.matchedResources?.length > 0 && (
                        <div className="ui-grid cols-2">
                          {assessment.matchedResources.map((item) => (
                            <div key={item._id}>
                              <div className="ui-row">
                                <span className="ui-icon-tile sm tone-teal"><Icon name="mapPin" size={15} /></span>
                                <span className="ui-row-main">
                                  <span className="ui-row-title">{item.name}</span>
                                  <span className="ui-row-meta">
                                    <span>{item.type}</span>
                                    <span>{item.status}</span>
                                  </span>
                                  <span className="ui-row-desc">{item.address}</span>
                                </span>
                                <span className="ui-row-side">
                                  <span className="ui-hint">Contact: {item.contact}</span>
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      {assessment.disclaimer && (
                        <div className="ui-callout amber">
                          <Icon name="alert" size={17} />
                          <p>{assessment.disclaimer}</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
                <div className="ui-card-foot">
                  <button type="button" className="ui-btn primary" onClick={() => nav('/my-reports')}>
                    Track in my reports
                  </button>
                  <button type="button" className="ui-btn ghost" onClick={() => setSubmittedReport(null)}>
                    Submit another incident
                  </button>
                </div>
              </section>
            )}

            <form className="ui-grid" onSubmit={handleForm}>
              <div>
              <section className="ui-card">
                <div className="ui-card-head">
                  <div>
                    <span className="ui-eyebrow dark">Step 01</span>
                    <h2>Incident</h2>
                  </div>
                  <span className="ui-hint">Required fields marked *</span>
                </div>
                <div className="ui-card-body">
                  <div className="ui-form-grid">
                    <div className="ui-field">
                      <label className="ui-label" htmlFor="emg-type">Hazard type <span className="req">*</span></label>
                      <select
                        id="emg-type"
                        className="ui-select"
                        value={disasterType}
                        onChange={(event) => setDisasterType(event.target.value)}
                        required
                      >
                        {(categories.length > 0 ? categories : DEFAULT_CATEGORIES).map((item) => (
                          <option key={item._id || item.name} value={item.name}>{item.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="ui-field">
                      <label className="ui-label" htmlFor="emg-title">Short title <span className="req">*</span></label>
                      <input
                        id="emg-title"
                        className="ui-input"
                        type="text"
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        placeholder="e.g. Water over Main Street near the bridge"
                        required
                      />
                    </div>
                  </div>
                </div>
              </section>
              </div>

              <div>
              <section className="ui-card">
                <div className="ui-card-head">
                  <div>
                    <span className="ui-eyebrow dark">Step 02</span>
                    <h2>Location &amp; severity</h2>
                  </div>
                </div>
                <div className="ui-card-body">
                  <div className="ui-form-grid">
                    <div className="ui-field">
                      <label className="ui-label" htmlFor="emg-location">Location <span className="req">*</span></label>
                      <input
                        id="emg-location"
                        className="ui-input"
                        type="text"
                        value={location}
                        onChange={(event) => setLocation(event.target.value)}
                        placeholder="Street, landmark, district or city"
                        required
                      />
                    </div>
                    <div className="ui-field">
                      <label className="ui-label" htmlFor="emg-affected">People affected</label>
                      <input
                        id="emg-affected"
                        className="ui-input"
                        type="number"
                        min={0}
                        value={affectedPeople}
                        onChange={(event) => setAffectedPeople(event.target.value)}
                      />
                      <span className="ui-hint">Use 0 if you are unsure.</span>
                    </div>
                    <div className="ui-field full">
                      <span className="ui-label">Severity level <span className="req">*</span></span>
                      <div className="severity-options">
                        {SEVERITY_OPTIONS.map((option) => {
                          const isSelected = severity === option.value;
                          return (
                            <label key={option.value} className={`ui-row severity-card ${isSelected ? 'active' : ''}`}>
                              <span className="severity-card-head">
                                <span className="severity-card-title-group">
                                  <span className={`ui-icon-tile sm ${option.tone}`}>
                                    <Icon name={option.icon} size={15} />
                                  </span>
                                  <span className="ui-row-title">{option.label}</span>
                                </span>
                                <input
                                  type="radio"
                                  name="severity"
                                  value={option.value}
                                  checked={isSelected}
                                  onChange={(event) => setSeverity(event.target.value)}
                                />
                              </span>
                              <span className="ui-row-desc severity-card-desc">{option.note}</span>
                              {isSelected && (
                                <span className={`ui-badge ${option.badge} severity-card-badge`}>Selected</span>
                              )}
                            </label>
                          );
                        })}
                      </div>
                    </div>
                    <div className="ui-field full">
                      <label className="ui-label" htmlFor="emg-time">When did it start</label>
                      <input
                        id="emg-time"
                        className="ui-input"
                        type="datetime-local"
                        value={dateTime}
                        onChange={(event) => setDateTime(event.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </section>
              </div>

              <div>
              <section className="ui-card">
                <div className="ui-card-head">
                  <div>
                    <span className="ui-eyebrow dark">Step 03</span>
                    <h2>Description &amp; evidence</h2>
                  </div>
                </div>
                <div className="ui-card-body">
                  <div className="ui-form-grid">
                    <div className="ui-field full">
                      <label className="ui-label" htmlFor="emg-desc">What is happening <span className="req">*</span></label>
                      <textarea
                        id="emg-desc"
                        className="ui-textarea"
                        rows={4}
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                        placeholder="Describe hazards, damage, water depth, trapped people or injuries. Be specific about what you can see."
                        required
                      />
                    </div>
                    <div className="ui-field full">
                      <label className="ui-label" htmlFor="emg-image">Photograph (optional)</label>
                      <input
                        id="emg-image"
                        className="ui-input"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                      <span className="ui-hint">A clear photo helps, but is not required.</span>
                      {imagePreview && (
                        <div className="ui-detail-cell">
                          <img
                            src={imagePreview}
                            alt="Incident preview"
                            style={{ display: 'block', maxWidth: '100%', maxHeight: 180, objectFit: 'cover' }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </section>
              </div>

              <div className="ui-callout red">
                <Icon name="alert" size={16} />
                <p>
                  Assessments are system-generated to help you act quickly. They do not
                  dispatch emergency services. Call 112 for immediate life-threatening danger.
                </p>
              </div>

              <div className="ui-card">
                <div className="ui-card-foot">
                  <small>Fields marked * are required.</small>
                  <div>
                    <button type="submit" className="ui-btn primary" disabled={submitting}>
                      {submitting ? 'Sending report…' : 'Send incident report'}
                    </button>
                    <button type="reset" className="ui-btn ghost" onClick={resetForm}>Clear form</button>
                  </div>
                </div>
              </div>
            </form>
          </div>

          <aside aria-label="Reporting guidance">
            <section className="ui-card">
              <div className="ui-card-head"><h3>Before you submit</h3></div>
              <div className="ui-card-body">
                <ol className="ui-list">
                  <li><span className="ui-badge blue">01</span> Move yourself to safety before writing anything.</li>
                  <li><span className="ui-badge blue">02</span> Note the nearest cross street or landmark.</li>
                  <li><span className="ui-badge blue">03</span> Say what is happening now, not what might happen.</li>
                  <li><span className="ui-badge blue">04</span> Give a number for people affected, or 0 if unknown.</li>
                </ol>
              </div>
            </section>

            <section className="ui-card">
              <div className="ui-card-head"><h3>What happens next</h3></div>
              <div className="ui-card-body">
                <ul className="ui-check-list">
                  <li><Icon name="check" size={14} /><span><strong>Report is logged</strong> You receive a reference for tracking.</span></li>
                  <li><Icon name="check" size={14} /><span><strong>Guidance is generated</strong> Immediate actions are based on hazard and severity.</span></li>
                  <li><Icon name="check" size={14} /><span><strong>Facilities are matched</strong> Available shelters and rescue units are suggested.</span></li>
                </ul>
              </div>
            </section>

            <div className="ui-grid">
              <div className="ui-callout red">
                <Icon name="phone" size={18} />
                <div>
                  <h4>Emergency line</h4>
                  <p><strong>112</strong> &mdash; call for immediate life-threatening danger.</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default ReportEmergency;
