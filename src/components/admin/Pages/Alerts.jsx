import React, { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Icon from '../../user/Pages/Icon';
import {
  AlertAdminGetAll,
  AlertAdminAdd,
  AlertAdminUpdate,
  AlertAdminRemove
} from '../../../services/adminServices';

const severityTone = (sev = '') => {
  const s = sev.toLowerCase();
  if (s === 'critical') return 'red';
  if (s === 'high') return 'amber';
  if (s === 'medium') return 'blue';
  return '';
};

const Alerts = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');

  // Modal state
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [editingAlert, setEditingAlert] = useState(null);

  // Form state
  const [title, setTitle] = useState('');
  const [disasterType, setDisasterType] = useState('Flood');
  const [description, setDescription] = useState('');
  const [affectedArea, setAffectedArea] = useState('');
  const [severity, setSeverity] = useState('Medium');
  const [status, setStatus] = useState('Active');
  const [dateTime, setDateTime] = useState('');
  const [image, setImage] = useState('');

  const loadAlerts = useCallback(() => {
    setLoading(true);
    AlertAdminGetAll()
      .then((res) => setAlerts(res.data.data || []))
      .catch((err) => toast.error(err.response?.data?.message || 'Unable to load alerts'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadAlerts();
  }, [loadAlerts]);

  useEffect(() => {
    if (location.pathname.endsWith('/add')) openAddModal();
  }, [location.pathname]);

  const openAddModal = () => {
    setEditingAlert(null);
    setTitle('');
    setDisasterType('Flood');
    setDescription('');
    setAffectedArea('');
    setSeverity('Medium');
    setStatus('Active');
    setDateTime(new Date().toISOString().slice(0, 16));
    setImage('');
    setIsAddEditOpen(true);
  };

  const handleSaveAlert = (e) => {
    e.preventDefault();
    const payload = {
      title,
      disasterType,
      description,
      affectedArea,
      severity,
      status,
      dateTime: dateTime ? new Date(dateTime) : new Date(),
      image
    };

    if (editingAlert) {
      payload._id = editingAlert._id;
      AlertAdminUpdate(payload)
        .then(() => {
          toast.success('Alert updated successfully');
          setIsAddEditOpen(false);
          if (location.pathname.endsWith('/add')) navigate('/admin/alerts');
          else loadAlerts();
        })
        .catch((err) => toast.error(err.response?.data?.message || 'Failed to update alert'));
    } else {
      AlertAdminAdd(payload)
        .then(() => {
          toast.success('Disaster alert published successfully');
          setIsAddEditOpen(false);
          if (location.pathname.endsWith('/add')) navigate('/admin/alerts');
          else loadAlerts();
        })
        .catch((err) => toast.error(err.response?.data?.message || 'Failed to publish alert'));
    }
  };

  const toggleStatus = (item) => {
    const nextStatus = item.status === 'Active' ? 'Inactive' : 'Active';
    AlertAdminUpdate({ _id: item._id, status: nextStatus })
      .then(() => {
        toast.success(`Alert marked as ${nextStatus}`);
        loadAlerts();
      })
      .catch((err) => toast.error(err.response?.data?.message || 'Failed to update status'));
  };

  const openDeleteModal = (item) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `Are you sure you want to permanently delete alert "${item.title}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        AlertAdminRemove(item._id)
          .then(() => {
            Swal.fire({
              title: 'Deleted!',
              text: 'Alert deleted successfully.',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
            });
            loadAlerts();
          })
          .catch((err) => {
            Swal.fire({
              title: 'Error!',
              text: err.response?.data?.message || 'Failed to delete alert.',
              icon: 'error'
            });
          });
      }
    });
  };

  const filteredAlerts = alerts.filter((item) => {
    const matchesSearch =
      (item.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.disasterType || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.affectedArea || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter ? item.status === statusFilter : true;
    const matchesSeverity = severityFilter ? item.severity === severityFilter : true;

    return matchesSearch && matchesStatus && matchesSeverity;
  });

  const activeCount = alerts.filter((item) => item.status === 'Active').length;
  const closeModal = () => {
    if (location.pathname.endsWith('/add')) navigate('/admin/alerts');
    else setIsAddEditOpen(false);
  };

  return (
    <>
      <section className="ui-hero compact">
        <div className="container ui-hero-inner">
          <div className="ui-hero-copy">
            <span className="ui-eyebrow">Admin Console &middot; Alerts</span>
            <h1>Disaster Alert Management</h1>
            <p>Create, review, publish, and maintain official emergency notices.</p>
            <div className="ui-hero-actions">
              <Link to="/admin/alerts/add" className="ui-btn red">
                <Icon name="plus" size={15} /> Create New Alert
              </Link>
            </div>
          </div>
          <div className="ui-hero-meta">
            <div>
              <Icon name="bell" size={18} />
              <span><strong>{alerts.length}</strong> total alerts</span>
            </div>
            <div>
              <Icon name="activity" size={18} />
              <span><strong>{activeCount}</strong> active now</span>
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
              placeholder="Search alerts by title, region, disaster..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search alerts"
            />
          </label>
          <select
            className="ui-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filter by status"
          >
            <option value="">All statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
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
          <button type="button" className="ui-btn ghost" onClick={loadAlerts}>
            <Icon name="refresh" size={15} /> Refresh
          </button>
        </div>

        {loading ? (
          <div className="ui-state">
            <div className="ui-spinner" />
            <h3>Loading alerts</h3>
            <p>Fetching official emergency notices&hellip;</p>
          </div>
        ) : filteredAlerts.length === 0 ? (
          <div className="ui-state">
            <div className="state-icon"><Icon name="bell" size={24} /></div>
            <h3>No alerts found</h3>
            <p>Adjust your search or filters to see more notices.</p>
          </div>
        ) : (
          <div className="ui-table-wrap">
            <table className="ui-table">
              <thead>
                <tr>
                  <th>Alert Title</th>
                  <th>Disaster Type</th>
                  <th>Affected Area</th>
                  <th>Severity</th>
                  <th>Date / Time</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAlerts.map((item) => (
                  <tr key={item._id}>
                    <td>
                      <strong>{item.title}</strong>
                      <div className="muted">{item.description}</div>
                    </td>
                    <td>{item.disasterType}</td>
                    <td>{item.affectedArea}</td>
                    <td>
                      <span className={`ui-badge ${severityTone(item.severity)}`}>
                        {item.severity}
                      </span>
                    </td>
                    <td className="muted">{new Date(item.dateTime || item.createdAt).toLocaleString()}</td>
                    <td>
                      <span className={`ui-badge ${item.status === 'Active' ? 'green' : 'amber'}`}>
                        {item.status}
                      </span>
                    </td>
                    <td>
                      <div className="ad-table-actions">
                        <button
                          type="button"
                          className="ui-btn sm ghost"
                          onClick={() => toggleStatus(item)}
                          title="Toggle Active / Inactive"
                        >
                          <Icon name="refresh" size={14} />
                          {item.status === 'Active' ? 'Deactivate' : 'Activate'}
                        </button>
                        <Link
                          to={`/admin/editalert/${item._id}`}
                          className="ui-btn sm plain"
                          aria-label="Edit alert"
                          title="Edit alert"
                        >
                          <Icon name="edit" size={15} />
                        </Link>
                        <button
                          type="button"
                          className="ui-btn sm red"
                          onClick={() => openDeleteModal(item)}
                          aria-label="Delete alert"
                          title="Delete alert"
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

      {isAddEditOpen && (
        <div className="ui-backdrop">
          <div className="ui-modal" role="dialog" aria-modal="true" aria-label="Alert editor">
            <div className="ui-modal-top">
              <div>
                <span className="eyebrow">Alert registry</span>
                <h2>{editingAlert ? 'Edit Disaster Alert' : 'Create New Disaster Alert'}</h2>
              </div>
              <button
                type="button"
                className="ui-modal-close"
                aria-label="Close alert editor"
                onClick={closeModal}
              >
                <Icon name="x" size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveAlert}>
              <div className="ui-modal-body">
                <p className="ui-hint">
                  Publish verified emergency alerts to notify citizens and responders.
                </p>

                <div className="ui-field">
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
                  <span className="ui-hint">Used as the alert thumbnail in the public feed.</span>
                </div>
              </div>

              <div className="ui-modal-foot">
                <small>Fields marked * are required.</small>
                <div>
                  <button type="button" className="ui-btn ghost" onClick={closeModal}>
                    Cancel
                  </button>
                  <button type="submit" className="ui-btn red">
                    {editingAlert ? 'Save Changes' : 'Publish Alert'}
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

export default Alerts;
