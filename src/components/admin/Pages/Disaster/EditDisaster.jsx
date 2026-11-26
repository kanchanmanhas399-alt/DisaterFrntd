import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { DisasterSingle, DisasterUpdate } from '../../../../services/DisasterService';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Icon from '../../../user/Pages/Icon';

const EditDisaster = () => {
  const { id } = useParams();
  const nav = useNavigate();

  const [disasterId, setDisasterId] = useState('');
  const [disasterName, setDisasterName] = useState('');
  const [type, setType] = useState('');
  const [location, setLocation] = useState('');
  const [severity, setSeverity] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      setLoading(true);
      DisasterSingle(id)
        .then((res) => {
          const data = res.data.data;
          if (data) {
            setDisasterId(data.disasterId || '');
            setDisasterName(data.disasterName || '');
            setType(data.type || '');
            setLocation(data.location || '');
            setSeverity(data.severity || '');
            setStatus(data.status || '');
          }
        })
        .catch((err) => {
          const msg = err.response?.data?.message || 'Failed to load disaster details';
          toast.error(msg);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [id]);

  function handleForm(e) {
    e.preventDefault();

    const payload = {
      _id: id,
      disasterId,
      disasterName,
      type,
      location,
      severity,
      status,
    };

    DisasterUpdate(payload)
      .then((res) => {
        toast.success(res.data.message || 'Disaster updated successfully');
        nav('/admin/disaster');
      })
      .catch((err) => {
        const errorMessage = err.response?.data?.message || err.message || 'Failed to update disaster';
        toast.error(errorMessage);
      });
  }

  return (
    <>
      <section className="ui-hero compact">
        <div className="container ui-hero-inner">
          <div className="ui-hero-copy">
            <span className="ui-eyebrow">Admin Console · Operations</span>
            <h1>Edit disaster event</h1>
            <p>Modify existing disaster record details.</p>
          </div>
          <div className="ui-hero-meta">
            <div>
              <Icon name="storm" size={18} />
              <span>{disasterName || 'Disaster record'}</span>
            </div>
            <div>
              <Icon name="mapPin" size={18} />
              <span>{location || 'Affected area'}</span>
            </div>
          </div>
        </div>
      </section>

      <main className="container ui-content compact-top">
        {loading ? (
          <div className="ui-state">
            <div className="ui-spinner" />
            <h3>Loading disaster details...</h3>
            <p>Fetching the incident record.</p>
          </div>
        ) : (
          <>
            <div className="ui-section-head">
              <div>
                <span className="ui-eyebrow dark">Incident record</span>
                <h2>Edit event</h2>
                <p>Update event identity, severity, and response status.</p>
              </div>
              <Link to="/admin/disaster" className="ui-btn ghost">
                <Icon name="arrowLeft" size={15} /> Back to disasters
              </Link>
            </div>

            <div className="ui-split">
              <form onSubmit={handleForm} data-demo-form="" className="ui-card">
                <div className="ui-card-head">
                  <div>
                    <h3>Event information</h3>
                    <p>Asterisk marks required fields.</p>
                  </div>
                  <span className="ui-badge blue">Editing</span>
                </div>
                <div className="ui-card-body">
                  <div className="ui-form-grid">
                    <div className="ui-field">
                      <label className="ui-label" htmlFor="edit-disaster-id">Disaster ID <span className="req">*</span></label>
                      <input
                        id="edit-disaster-id"
                        className="ui-input"
                        value={disasterId}
                        onChange={(event) => setDisasterId(event.target.value)}
                        required
                        placeholder="e.g., DS-101"
                      />
                    </div>

                    <div className="ui-field">
                      <label className="ui-label" htmlFor="edit-disaster-name">Disaster Name <span className="req">*</span></label>
                      <input
                        id="edit-disaster-name"
                        className="ui-input"
                        value={disasterName}
                        onChange={(event) => setDisasterName(event.target.value)}
                        required
                        placeholder="e.g., Northern rainfall"
                      />
                    </div>

                    <div className="ui-field">
                      <label className="ui-label" htmlFor="edit-disaster-type">Type <span className="req">*</span></label>
                      <input
                        id="edit-disaster-type"
                        className="ui-input"
                        value={type}
                        onChange={(event) => setType(event.target.value)}
                        required
                        placeholder="e.g., Flood"
                      />
                    </div>

                    <div className="ui-field">
                      <label className="ui-label" htmlFor="edit-disaster-location">Location <span className="req">*</span></label>
                      <input
                        id="edit-disaster-location"
                        className="ui-input"
                        value={location}
                        onChange={(event) => setLocation(event.target.value)}
                        required
                        placeholder="e.g., North Zone"
                      />
                    </div>

                    <div className="ui-field">
                      <label className="ui-label" htmlFor="edit-disaster-severity">Severity <span className="req">*</span></label>
                      <select
                        id="edit-disaster-severity"
                        className="ui-select"
                        value={severity}
                        onChange={(event) => setSeverity(event.target.value)}
                        required
                      >
                        <option value="">Select severity</option>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Critical">Critical</option>
                      </select>
                    </div>

                    <div className="ui-field">
                      <label className="ui-label" htmlFor="edit-disaster-status">Status <span className="req">*</span></label>
                      <select
                        id="edit-disaster-status"
                        className="ui-select"
                        value={status}
                        onChange={(event) => setStatus(event.target.value)}
                        required
                      >
                        <option value="">Select status</option>
                        <option value="Active">Active</option>
                        <option value="Monitoring">Monitoring</option>
                        <option value="Pending">Pending</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="ui-card-foot">
                  <span className="ui-hint">Changes apply after saving.</span>
                  <div>
                    <button type="submit" className="ui-btn red">
                      <Icon name="check" size={15} /> Update Disaster
                    </button>
                    <Link to="/admin/disaster" className="ui-btn ghost">Cancel</Link>
                  </div>
                </div>
              </form>

              <div>
                <div className="ui-card">
                  <div className="ui-card-head">
                    <h3>Record snapshot</h3>
                  </div>
                  <div className="ui-card-body">
                    <div className="ui-detail-grid">
                      <div className="ui-detail-cell">
                        <span>Disaster ID</span>
                        <strong>{disasterId || '—'}</strong>
                      </div>
                      <div className="ui-detail-cell">
                        <span>Status</span>
                        <strong>{status || '—'}</strong>
                      </div>
                    </div>
                    <div className="ui-callout amber">
                      <Icon name="info" size={17} />
                      <div>
                        <h4>Response status</h4>
                        <p>Keep status current as the incident progresses.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </>
  );
};

export default EditDisaster;
