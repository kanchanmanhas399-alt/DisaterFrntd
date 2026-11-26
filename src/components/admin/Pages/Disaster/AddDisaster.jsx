import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { DisasterAdd } from '../../../../services/DisasterService';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../user/Pages/Icon';

const AddDisaster = () => {
  const nav = useNavigate();

  const [disasterId, setDisasterId] = useState('');
  const [disasterName, setDisasterName] = useState('');
  const [type, setType] = useState('');
  const [location, setLocation] = useState('');
  const [severity, setSeverity] = useState('');
  const [status, setStatus] = useState('');

  function handleForm(e) {
    e.preventDefault();

    const payload = { disasterId, disasterName, type, location, severity, status };

    DisasterAdd(payload)
      .then((res) => {
        toast.success(res.data.message || 'Disaster added successfully');
        handleReset();
        nav(-1);
      })
      .catch((err) => {
        const errorMessage = err.response?.data?.message || err.message || 'Failed to add disaster';
        toast.error(errorMessage);
      });
  }

  function handleReset() {
    setDisasterId('');
    setDisasterName('');
    setType('');
    setLocation('');
    setSeverity('');
    setStatus('');
  }

  return (
    <>
      <section className="ui-hero compact">
        <div className="container ui-hero-inner">
          <div className="ui-hero-copy">
            <span className="ui-eyebrow">Admin Console · Operations</span>
            <h1>Add disaster event</h1>
            <p>Record a new disaster event or incident category.</p>
          </div>
          <div className="ui-hero-meta">
            <div>
              <Icon name="storm" size={18} />
              <span>Incident record</span>
            </div>
            <div>
              <Icon name="mapPin" size={18} />
              <span>Location based</span>
            </div>
          </div>
        </div>
      </section>

      <main className="container ui-content compact-top">
        <div className="ui-section-head">
          <div>
            <span className="ui-eyebrow dark">New event</span>
            <h2>Incident details</h2>
            <p>Complete all required fields to register the event.</p>
          </div>
          <span className="ui-badge amber">Draft record</span>
        </div>

        <div className="ui-split">
          <form onSubmit={handleForm} onReset={handleReset} data-demo-form="" className="ui-card">
            <div className="ui-card-head">
              <div>
                <h3>Event information</h3>
                <p>Asterisk marks required fields.</p>
              </div>
              <span className="ui-badge">Step 1 of 1</span>
            </div>
            <div className="ui-card-body">
              <div className="ui-form-grid">
                <div className="ui-field">
                  <label className="ui-label" htmlFor="new-disaster-id">Disaster ID <span className="req">*</span></label>
                  <input
                    id="new-disaster-id"
                    className="ui-input"
                    value={disasterId}
                    onChange={(event) => setDisasterId(event.target.value)}
                    required
                    placeholder="e.g., DS-103"
                  />
                </div>

                <div className="ui-field">
                  <label className="ui-label" htmlFor="new-disaster-name">Disaster Name <span className="req">*</span></label>
                  <input
                    id="new-disaster-name"
                    className="ui-input"
                    value={disasterName}
                    onChange={(event) => setDisasterName(event.target.value)}
                    required
                    placeholder="e.g., Coastal flooding"
                  />
                </div>

                <div className="ui-field">
                  <label className="ui-label" htmlFor="new-disaster-type">Type <span className="req">*</span></label>
                  <input
                    id="new-disaster-type"
                    className="ui-input"
                    value={type}
                    onChange={(event) => setType(event.target.value)}
                    required
                    placeholder="e.g., Flood, Fire, Earthquake"
                  />
                </div>

                <div className="ui-field">
                  <label className="ui-label" htmlFor="new-disaster-location">Location <span className="req">*</span></label>
                  <input
                    id="new-disaster-location"
                    className="ui-input"
                    value={location}
                    onChange={(event) => setLocation(event.target.value)}
                    required
                    placeholder="e.g., Coastal Line"
                  />
                </div>

                <div className="ui-field">
                  <label className="ui-label" htmlFor="new-disaster-severity">Severity <span className="req">*</span></label>
                  <select
                    id="new-disaster-severity"
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
                  <label className="ui-label" htmlFor="new-disaster-status">Status <span className="req">*</span></label>
                  <select
                    id="new-disaster-status"
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
              <span className="ui-hint">Verify the event ID before saving.</span>
              <div>
                <button type="submit" className="ui-btn primary">
                  <Icon name="check" size={15} /> Save Disaster
                </button>
                <button type="reset" className="ui-btn ghost">Reset</button>
              </div>
            </div>
          </form>

          <div>
            <div className="ui-card">
              <div className="ui-card-head">
                <h3>Recording guide</h3>
              </div>
              <div className="ui-card-body">
                <div className="ui-grid cols-2">
                  <div className="ui-callout amber">
                    <Icon name="alert" size={17} />
                    <div>
                      <h4>Severity</h4>
                      <p>Use Low through Critical based on impact.</p>
                    </div>
                  </div>
                  <div className="ui-callout green">
                    <Icon name="activity" size={17} />
                    <div>
                      <h4>Status</h4>
                      <p>Track Active, Monitoring, Pending, or Resolved.</p>
                    </div>
                  </div>
                </div>
                <div className="ui-detail-grid">
                  <div className="ui-detail-cell">
                    <span>Identifier</span>
                    <strong>Unique disaster ID</strong>
                  </div>
                  <div className="ui-detail-cell">
                    <span>Location</span>
                    <strong>Affected area</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default AddDisaster;
