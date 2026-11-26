import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Icon from '../../user/Pages/Icon';
import { AlertAdminSingle, AlertAdminUpdate } from '../../../services/adminServices';

const EditAlert = () => {
  const { id } = useParams();
  const nav = useNavigate();

  const [title, setTitle] = useState('');
  const [disasterType, setDisasterType] = useState('Flood');
  const [description, setDescription] = useState('');
  const [affectedArea, setAffectedArea] = useState('');
  const [severity, setSeverity] = useState('Medium');
  const [status, setStatus] = useState('Active');
  const [dateTime, setDateTime] = useState('');
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      setLoading(true);
      AlertAdminSingle(id)
        .then((res) => {
          const item = res.data.data;
          if (item) {
            setTitle(item.title || '');
            setDisasterType(item.disasterType || 'Flood');
            setDescription(item.description || '');
            setAffectedArea(item.affectedArea || '');
            setSeverity(item.severity || 'Medium');
            setStatus(item.status || 'Active');
            setDateTime(item.dateTime ? new Date(item.dateTime).toISOString().slice(0, 16) : '');
            setImage(item.image || '');
          }
        })
        .catch((err) => {
          const msg = err.response?.data?.message || 'Failed to load alert details';
          toast.error(msg);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [id]);

  const handleSaveAlert = (e) => {
    e.preventDefault();
    const payload = {
      _id: id,
      title,
      disasterType,
      description,
      affectedArea,
      severity,
      status,
      dateTime: dateTime ? new Date(dateTime) : new Date(),
      image
    };

    AlertAdminUpdate(payload)
      .then(() => {
        toast.success('Alert updated successfully');
        nav('/admin/alerts');
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || 'Failed to update alert');
      });
  };

  const hero = (
    <section className="ui-hero compact">
      <div className="container ui-hero-inner">
        <div className="ui-hero-copy">
          <span className="ui-eyebrow">Admin Console &middot; Alerts</span>
          <h1>Edit Disaster Alert</h1>
          <p>Modify published emergency public warnings.</p>
          <div className="ui-hero-actions">
            <Link to="/admin/alerts" className="ui-btn ghost">
              <Icon name="arrowLeft" size={15} /> Back to Alerts
            </Link>
          </div>
        </div>
        <div className="ui-hero-meta">
          <div>
            <Icon name="alert" size={18} />
            <span><strong>{disasterType}</strong> hazard</span>
          </div>
          <div>
            <Icon name="activity" size={18} />
            <span><strong>{severity}</strong> severity</span>
          </div>
        </div>
      </div>
    </section>
  );

  if (loading) {
    return (
      <>
        {hero}
        <main className="container ui-content compact-top">
          <div className="ui-state">
            <div className="ui-spinner" />
            <h3>Loading alert details</h3>
            <p>Fetching the current emergency notice&hellip;</p>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      {hero}
      <main className="container ui-content compact-top">
        <form onSubmit={handleSaveAlert} data-demo-form="">
          <div className="ui-card">
            <div className="ui-card-head">
              <div>
                <h2>Alert details</h2>
                <p>Review every field before publishing the update.</p>
              </div>
              <span className={`ui-badge ${status === 'Active' ? 'green' : 'amber'}`}>
                {status}
              </span>
            </div>

            <div className="ui-card-body">
              <div className="ui-field full">
                <label className="ui-label">Alert Title <span className="req">*</span></label>
                <input
                  type="text"
                  className="ui-input"
                  required
                  placeholder="e.g. Flash Flood Warning - North Zone"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="ui-form-grid">
                <div className="ui-field">
                  <label className="ui-label">Disaster Type <span className="req">*</span></label>
                  <select
                    className="ui-select"
                    value={disasterType}
                    onChange={(e) => setDisasterType(e.target.value)}
                    required
                  >
                    <option value="Flood">Flood</option>
                    <option value="Earthquake">Earthquake</option>
                    <option value="Fire">Fire</option>
                    <option value="Landslide">Landslide</option>
                    <option value="Cyclone">Cyclone</option>
                    <option value="Storm">Storm</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="ui-field">
                  <label className="ui-label">Severity Level <span className="req">*</span></label>
                  <select
                    className="ui-select"
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value)}
                    required
                  >
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="ui-form-grid">
                <div className="ui-field">
                  <label className="ui-label">Affected Location / Area <span className="req">*</span></label>
                  <input
                    type="text"
                    className="ui-input"
                    required
                    placeholder="e.g. North Zone, Canal Corridor"
                    value={affectedArea}
                    onChange={(e) => setAffectedArea(e.target.value)}
                  />
                </div>
                <div className="ui-field">
                  <label className="ui-label">Date and Time</label>
                  <input
                    type="datetime-local"
                    className="ui-input"
                    value={dateTime}
                    onChange={(e) => setDateTime(e.target.value)}
                  />
                </div>
              </div>

              <div className="ui-field">
                <label className="ui-label">Alert Status</label>
                <select
                  className="ui-select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="Active">Active (Visible in public feed)</option>
                  <option value="Inactive">Inactive (Hidden from public feed)</option>
                </select>
                <span className="ui-hint">Inactive notices are hidden from the public feed.</span>
              </div>

              <div className="ui-field">
                <label className="ui-label">Alert Description <span className="req">*</span></label>
                <textarea
                  className="ui-textarea"
                  rows={4}
                  required
                  placeholder="Provide clear incident description, instructions, and risk zones..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="ui-field">
                <label className="ui-label">Optional Image URL or asset link</label>
                <input
                  type="text"
                  className="ui-input"
                  placeholder="https://... or /uploads/..."
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                />
              </div>
            </div>

            <div className="ui-card-foot">
              <span className="ui-hint">Changes are saved to the official alert feed.</span>
              <div className="ad-hero-actions">
                <button type="submit" className="ui-btn red">
                  <Icon name="check" size={15} /> Save Changes
                </button>
                <Link to="/admin/alerts" className="ui-btn ghost">Cancel</Link>
              </div>
            </div>
          </div>
        </form>
      </main>
    </>
  );
};

export default EditAlert;
