import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import Icon from '../../user/Pages/Icon';
import { UploadImage } from '../../../services/EmergencyReport';
import { BASEURL } from '../../../endpoints';
import {
  ResourceAdminGetAll,
  ResourceAdminAdd,
  ResourceAdminUpdate,
  ResourceAdminRemove,
  ResourceAdminSingle,
  AdminResourceRequestGetAll,
  AdminResourceRequestUpdateStatus,
  AdminResourceRequestDelete
} from '../../../services/adminServices';

const ResourcesAdmin = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Modal states (Delete state removed since we are using SweetAlert)
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Form states
  const [name, setName] = useState('');
  const [type, setType] = useState('Shelter');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [contact, setContact] = useState('');
  const [services, setServices] = useState('');
  const [capacity, setCapacity] = useState(0);
  const [status, setStatus] = useState('Available');
  const [image, setImage] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [activeTab, setActiveTab] = useState('directory'); // 'directory' or 'requests'
  const [requests, setRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [requestStatusFilter, setRequestStatusFilter] = useState('');
  const [actionNotes, setActionNotes] = useState({});

  const loadResources = useCallback(() => {
    setLoading(true);
    ResourceAdminGetAll()
      .then((res) => {
        setResources(res.data.data || []);
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || "Failed to load resources");
      })
      .finally(() => setLoading(false));
  }, []);

  const loadRequests = useCallback(() => {
    setLoadingRequests(true);
    AdminResourceRequestGetAll()
      .then((res) => {
        setRequests(res.data.data || []);
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || "Failed to load requests");
      })
      .finally(() => setLoadingRequests(false));
  }, []);

  const handleUpdateRequestStatus = (requestId, newStatus) => {
    const note = actionNotes[requestId] || '';
    AdminResourceRequestUpdateStatus(requestId, { status: newStatus, adminNotes: note })
      .then((res) => {
        toast.success(res.data.message || `Request updated to ${newStatus}`);
        loadRequests();
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || "Failed to update request status");
      });
  };

  const handleDeleteRequest = (reqItem) => {
    Swal.fire({
      title: 'Delete Request?',
      text: `Are you sure you want to delete the request from ${reqItem.userName}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#c0392b',
      cancelButtonColor: '#35566f',
      confirmButtonText: 'Yes, delete'
    }).then((result) => {
      if (result.isConfirmed) {
        AdminResourceRequestDelete(reqItem._id)
          .then(() => {
            toast.success("Request record removed");
            loadRequests();
          })
          .catch((err) => {
            toast.error(err.response?.data?.message || "Failed to delete request");
          });
      }
    });
  };

  useEffect(() => {
    loadResources();
    loadRequests();
  }, [loadResources, loadRequests]);

  useEffect(() => {
    if (id) {
      openEditModal({ _id: id });
    } else if (location.pathname.endsWith('/add')) {
      openAddModal();
    }
  }, [id, location.pathname]);

  const openAddModal = () => {
    setEditingItem(null);
    setName('');
    setType('Shelter');
    setDescription('');
    setAddress('');
    setContact('');
    setServices('');
    setCapacity(100);
    setStatus('Available');
    setImage('');
    setImageFile(null);
    setIsAddEditOpen(true);
  };

  const openEditModal = async (item) => {
    try {
      const response = await ResourceAdminSingle(item._id);
      const current = response.data.data;
      if (!current) throw new Error("Resource not found");
      setEditingItem(current);
      setName(current.name || '');
      setType(current.type || 'Shelter');
      setDescription(current.description || '');
      setAddress(current.address || current.location || '');
      setContact(current.contact || '');
      setServices(current.services || '');
      setCapacity(current.capacity ?? 0);
      setStatus(current.status || 'Available');
      setImage(current.image || '');
      setImageFile(null);
      setIsAddEditOpen(true);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Failed to load resource");
    }
  };

  const handleSaveResource = async (e) => {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    let imageUrl = image;
    try {
      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);
        const uploadResponse = await UploadImage(formData);
        imageUrl = uploadResponse.data.url?.startsWith("http")
          ? uploadResponse.data.url
          : `${BASEURL.replace(/\/$/, "")}${uploadResponse.data.url}`;
      }
    } catch (uploadError) {
      toast.error(uploadError.response?.data?.message || "Resource image upload failed");
      setSaving(false);
      return;
    }

    const payload = {
      name,
      type,
      description,
      address,
      contact,
      services,
      capacity: parseInt(capacity, 10) || 0,
      status,
      image: imageUrl
    };

    try {
      if (editingItem) {
        payload._id = editingItem._id;
        const response = await ResourceAdminUpdate(payload);
        toast.success(response.data.message || "Resource updated successfully");
      } else {
        const response = await ResourceAdminAdd(payload);
        toast.success(response.data.message || "Emergency resource added successfully");
      }
      setIsAddEditOpen(false);
      if (id || location.pathname.endsWith('/add')) {
        navigate('/admin/resources');
      } else {
        await loadResources();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save resource");
    } finally {
      setSaving(false);
    }
  };

  const handleQuickStatus = (item, newStatus) => {
    ResourceAdminUpdate({ _id: item._id, status: newStatus })
      .then(() => {
        toast.success(`Resource availability set to ${newStatus}`);
        loadResources();
      })
      .catch((err) => toast.error(err.response?.data?.message || "Failed to update status"));
  };

  // SweetAlert Confirmation for Delete
  const handleDeleteTrigger = (item) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `You want to permanently delete "${item.name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        ResourceAdminRemove(item._id)
          .then(() => {
            Swal.fire('Deleted!', 'Resource has been deleted.', 'success');
            loadResources();
          })
          .catch((err) => {
            toast.error(err.response?.data?.message || "Failed to delete resource");
          });
      }
    });
  };

  const filteredResources = resources.filter((item) => {
    const matchesSearch =
      (item.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.resourceId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.address || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.services || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter ? item.type === typeFilter : true;
    const matchesStatus = statusFilter ? item.status === statusFilter : true;

    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusBadge = (s = '') => {
    const val = s.toLowerCase();
    if (val === 'available') return 'green';
    if (val === 'full') return 'amber';
    if (val === 'temporarily closed') return 'red';
    return '';
  };

  const availableCount = resources.filter((item) => item.status === 'Available').length;
  const fullCount = resources.filter((item) => item.status === 'Full').length;
  const closedCount = resources.filter(
    (item) => item.status === 'Temporarily Closed' || item.status === 'Unavailable'
  ).length;

  return (
    <>
      <section className="ui-hero compact">
        <div className="container ui-hero-inner">
          <div className="ui-hero-copy">
            <span className="ui-eyebrow">Operations &middot; Resource directory</span>
            <h1>Emergency resources</h1>
            <p>Manage shelters, hospitals, rescue centers and emergency support facilities.</p>
            <div className="ui-hero-actions">
              <button
                type="button"
                className={`ui-btn ${activeTab === 'directory' ? 'primary' : 'ghost'}`}
                onClick={() => setActiveTab('directory')}
              >
                <Icon name="layers" size={16} /> Facility Directory ({resources.length})
              </button>
              <button
                type="button"
                className={`ui-btn ${activeTab === 'requests' ? 'primary' : 'ghost'}`}
                onClick={() => setActiveTab('requests')}
              >
                <Icon name="clipboard" size={16} /> Citizen Requests ({requests.filter(r => r.status === 'Pending').length} pending)
              </button>
              {activeTab === 'directory' && (
                <Link to="/admin/resources/add" className="ui-btn red">
                  <Icon name="plus" size={16} /> Add resource
                </Link>
              )}
              <button
                type="button"
                className="ui-btn ghost"
                onClick={() => {
                  loadResources();
                  loadRequests();
                }}
              >
                <Icon name="refresh" size={16} /> Refresh
              </button>
            </div>
          </div>
          <div className="ui-hero-meta">
            <div>
              <Icon name="building" size={18} />
              <span><strong>{resources.length || '—'}</strong> listed facilities</span>
            </div>
            <div>
              <Icon name="shield" size={18} />
              <span>Operational status tracked</span>
            </div>
          </div>
        </div>
      </section>

      <main className="container ui-content compact-top">
        <div className="ui-stat-grid">
          <div className="ui-stat-card tone-slate">
            <div className="ui-stat-icon"><Icon name="building" size={20} /></div>
            <div>
              <span className="ui-stat-value">{resources.length}</span>
              <span className="ui-stat-label">Total resources</span>
            </div>
          </div>
          <div className="ui-stat-card tone-green">
            <div className="ui-stat-icon"><Icon name="check" size={20} /></div>
            <div>
              <span className="ui-stat-value">{availableCount}</span>
              <span className="ui-stat-label">Available</span>
            </div>
          </div>
          <div className="ui-stat-card tone-amber">
            <div className="ui-stat-icon"><Icon name="users" size={20} /></div>
            <div>
              <span className="ui-stat-value">{fullCount}</span>
              <span className="ui-stat-label">At capacity</span>
            </div>
          </div>
          <div className="ui-stat-card tone-rose">
            <div className="ui-stat-icon"><Icon name="alert" size={20} /></div>
            <div>
              <span className="ui-stat-value">{closedCount}</span>
              <span className="ui-stat-label">Closed / unavailable</span>
            </div>
          </div>
        </div>

        {activeTab === 'directory' ? (
          <>
            <div className="ui-toolbar">
              <label className="ui-search">
                <Icon name="search" size={16} />
                <input
                  type="search"
                  className="ui-input"
                  placeholder="Search resources by name, ID, address, services..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  aria-label="Search resources"
                />
              </label>
              <select
                className="ui-select"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                aria-label="Filter by category"
              >
                <option value="">All Categories</option>
                <option value="Shelter">Shelters</option>
                <option value="Hospital">Hospitals</option>
                <option value="Rescue Center">Rescue Centers</option>
                <option value="Emergency Support Center">Emergency Support Centers</option>
              </select>
              <select
                className="ui-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                aria-label="Filter by status"
              >
                <option value="">All Statuses</option>
                <option value="Available">Available</option>
                <option value="Full">Full</option>
                <option value="Temporarily Closed">Temporarily Closed</option>
                <option value="Unavailable">Unavailable</option>
              </select>
              <span className="ui-badge blue">{filteredResources.length} shown</span>
            </div>

            <div className="ui-card">
              <div className="ui-card-head">
                <div>
                  <h2>Resource directory</h2>
                  <p>Search, filter and update facility availability.</p>
                </div>
                <span className="ui-badge">{filteredResources.length} of {resources.length}</span>
              </div>
              <div className="ui-card-body">
                {loading ? (
                  <div className="ui-state">
                    <div className="ui-spinner" />
                    <h3>Loading resources</h3>
                    <p>Fetching the latest facility directory...</p>
                  </div>
                ) : filteredResources.length === 0 ? (
                  <div className="ui-state">
                    <div className="state-icon"><Icon name="search" size={24} /></div>
                    <h3>No resources found</h3>
                    <p>Adjust your search or filters to see more facilities.</p>
                    <button
                      type="button"
                      className="ui-btn ghost"
                      onClick={() => { setSearchTerm(''); setTypeFilter(''); setStatusFilter(''); }}
                    >
                      Clear filters
                    </button>
                  </div>
                ) : (
                  <div className="ui-table-wrap">
                    <table className="ui-table">
                      <thead>
                        <tr>
                          <th>Resource ID</th>
                          <th>Resource Name</th>
                          <th>Category</th>
                          <th>Address</th>
                          <th>Helpline Contact</th>
                          <th>Capacity</th>
                          <th>Operational Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredResources.map((item) => (
                          <tr key={item._id}>
                            <td><strong>{item.resourceId || "—"}</strong></td>
                            <td>
                              <strong>{item.name}</strong>
                              <div className="muted">{item.services || item.description}</div>
                            </td>
                            <td><span className="ui-badge">{item.type}</span></td>
                            <td>{item.address}</td>
                            <td><strong>{item.contact}</strong></td>
                            <td>{item.capacity > 0 ? `${item.capacity} persons` : "—"}</td>
                            <td>
                              <span className={`ui-badge ${getStatusBadge(item.status)}`}>{item.status}</span>
                            </td>
                            <td>
                              <div className="ad-table-actions">
                                {item.status === 'Available' ? (
                                  <button
                                    type="button"
                                    className="ui-btn sm ghost"
                                    onClick={() => handleQuickStatus(item, "Full")}
                                    title="Mark Full"
                                  >
                                    Mark Full
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    className="ui-btn sm ghost"
                                    onClick={() => handleQuickStatus(item, "Available")}
                                    title="Make Available"
                                  >
                                    Make Available
                                  </button>
                                )}
                                <Link
                                  to={`/admin/resources/edit/${item._id}`}
                                  className="ui-btn sm ghost"
                                  title="Edit"
                                  aria-label={`Edit ${item.name}`}
                                >
                                  <Icon name="edit" size={14} />
                                </Link>
                                <button
                                  type="button"
                                  className="ui-btn sm red"
                                  onClick={() => handleDeleteTrigger(item)}
                                  title="Delete"
                                  aria-label={`Delete ${item.name}`}
                                >
                                  <Icon name="trash" size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          /* Citizen Requests Management Tab */
          <div className="ui-card">
            <div className="ui-card-head">
              <div>
                <h2>Citizen Resource Requests</h2>
                <p>Manage and handle accommodation or facility requests submitted by citizens.</p>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <select
                  className="ui-select"
                  value={requestStatusFilter}
                  onChange={(e) => setRequestStatusFilter(e.target.value)}
                  style={{ minWidth: '140px' }}
                >
                  <option value="">All statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Waitlisted">Waitlisted</option>
                  <option value="Fulfilled">Fulfilled</option>
                  <option value="Rejected">Rejected</option>
                </select>
                <span className="ui-badge blue">
                  {requests.filter(r => !requestStatusFilter || r.status === requestStatusFilter).length} total
                </span>
              </div>
            </div>
            <div className="ui-card-body">
              {loadingRequests ? (
                <div className="ui-state">
                  <div className="ui-spinner" />
                  <h3>Loading requests</h3>
                  <p>Fetching citizen requests&hellip;</p>
                </div>
              ) : requests.filter(r => !requestStatusFilter || r.status === requestStatusFilter).length === 0 ? (
                <div className="ui-state">
                  <div className="state-icon"><Icon name="clipboard" size={24} /></div>
                  <h3>No requests found</h3>
                  <p>No citizen requests match the selected status filter.</p>
                </div>
              ) : (
                <div className="ui-table-wrap">
                  <table className="ui-table">
                    <thead>
                      <tr>
                        <th>Citizen Details</th>
                        <th>Facility Requested</th>
                        <th>Type & Ref</th>
                        <th>Citizen Notes</th>
                        <th>Status</th>
                        <th>Coordinator Action & Note</th>
                        <th>Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {requests
                        .filter(r => !requestStatusFilter || r.status === requestStatusFilter)
                        .map((req) => (
                          <tr key={req._id}>
                            <td>
                              <strong>{req.userName}</strong>
                              <div className="muted">{req.userEmail}</div>
                              {req.userPhone && <div className="muted">{req.userPhone}</div>}
                              <span className="ui-hint">{new Date(req.createdAt).toLocaleString()}</span>
                            </td>
                            <td>
                              <strong>{req.resourceName}</strong>
                              {req.resourceAddress && (
                                <div className="muted">{req.resourceAddress}</div>
                              )}
                              {req.resourceContact && (
                                <div className="muted">Helpline: {req.resourceContact}</div>
                              )}
                            </td>
                            <td>
                              <span className="ui-badge blue">{req.resourceType}</span>
                              {req.resourceReference && (
                                <div style={{ marginTop: '4px' }}>
                                  <code>{req.resourceReference}</code>
                                </div>
                              )}
                            </td>
                            <td>
                              {req.notes ? (
                                <p style={{ margin: 0, fontSize: '13px', maxWidth: '240px' }}>{req.notes}</p>
                              ) : (
                                <span className="ui-hint">None</span>
                              )}
                            </td>
                            <td>
                              <span className={`ui-badge ${
                                req.status === 'Approved' || req.status === 'Fulfilled'
                                  ? 'green'
                                  : req.status === 'Pending'
                                  ? 'amber'
                                  : req.status === 'Waitlisted'
                                  ? 'blue'
                                  : 'red'
                              }`}>
                                {req.status}
                              </span>
                            </td>
                            <td>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <input
                                  type="text"
                                  className="ui-input sm"
                                  placeholder="Note for citizen..."
                                  value={actionNotes[req._id] !== undefined ? actionNotes[req._id] : (req.adminNotes || '')}
                                  onChange={(e) => setActionNotes({ ...actionNotes, [req._id]: e.target.value })}
                                  style={{ minWidth: '170px', fontSize: '11.5px', padding: '4px 8px' }}
                                />
                                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                                  <button
                                    type="button"
                                    className="ui-btn sm green"
                                    onClick={() => handleUpdateRequestStatus(req._id, 'Approved')}
                                    title="Approve request"
                                  >
                                    Approve
                                  </button>
                                  <button
                                    type="button"
                                    className="ui-btn sm ghost"
                                    onClick={() => handleUpdateRequestStatus(req._id, 'Waitlisted')}
                                    title="Waitlist request"
                                  >
                                    Waitlist
                                  </button>
                                  <button
                                    type="button"
                                    className="ui-btn sm ghost"
                                    onClick={() => handleUpdateRequestStatus(req._id, 'Fulfilled')}
                                    title="Mark fulfilled"
                                  >
                                    Fulfill
                                  </button>
                                  <button
                                    type="button"
                                    className="ui-btn sm red"
                                    onClick={() => handleUpdateRequestStatus(req._id, 'Rejected')}
                                    title="Reject request"
                                  >
                                    Reject
                                  </button>
                                </div>
                              </div>
                            </td>
                            <td>
                              <button
                                type="button"
                                className="ui-btn sm red"
                                onClick={() => handleDeleteRequest(req)}
                                title="Delete request"
                              >
                                <Icon name="trash" size={14} />
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Add / Edit Resource Modal */}
        {isAddEditOpen && (
          <div className="ui-backdrop">
            <div className="ui-modal" role="dialog" aria-modal="true" aria-labelledby="resource-modal-title">
              <div className="ui-modal-top">
                <div>
                  <span className="eyebrow">Resource registry</span>
                  <h2 id="resource-modal-title">{editingItem ? "Edit emergency resource" : "Add emergency resource"}</h2>
                </div>
                <button
                  type="button"
                  className="ui-modal-close"
                  aria-label="Close"
                  onClick={() => (id || location.pathname.endsWith('/add')) ? navigate('/admin/resources') : setIsAddEditOpen(false)}
                >
                  <Icon name="x" size={16} />
                </button>
              </div>
              <form onSubmit={handleSaveResource}>
                <div className="ui-modal-body">
                  <div className="ui-callout">
                    <Icon name="info" size={18} />
                    <div>
                      <h4>Facility details</h4>
                      <p>Configure official details and operational availability.</p>
                    </div>
                  </div>
                  <div className="ui-form-grid">
                    <div className="ui-field full">
                      <label className="ui-label" htmlFor="res-name">Resource Name <span className="req">*</span></label>
                      <input
                        id="res-name"
                        type="text"
                        required
                        className="ui-input"
                        placeholder="e.g. District Central Community Shelter"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div className="ui-field">
                      <label className="ui-label" htmlFor="res-type">Resource Category <span className="req">*</span></label>
                      <select id="res-type" className="ui-select" value={type} onChange={(e) => setType(e.target.value)} required>
                        <option value="Shelter">Shelter</option>
                        <option value="Hospital">Hospital</option>
                        <option value="Rescue Center">Rescue Center</option>
                        <option value="Emergency Support Center">Emergency Support Center</option>
                      </select>
                    </div>
                    <div className="ui-field">
                      <label className="ui-label" htmlFor="res-status">Operational Status <span className="req">*</span></label>
                      <select id="res-status" className="ui-select" value={status} onChange={(e) => setStatus(e.target.value)} required>
                        <option value="Available">Available (Accepting victims)</option>
                        <option value="Full">Full (At capacity)</option>
                        <option value="Temporarily Closed">Temporarily Closed</option>
                        <option value="Unavailable">Unavailable</option>
                      </select>
                    </div>
                    <div className="ui-field">
                      <label className="ui-label" htmlFor="res-contact">Helpline / Contact Number <span className="req">*</span></label>
                      <input
                        id="res-contact"
                        type="tel"
                        required
                        className="ui-input"
                        placeholder="e.g. 0123-456-700"
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                      />
                    </div>
                    <div className="ui-field">
                      <label className="ui-label" htmlFor="res-capacity">Capacity (Persons)</label>
                      <input
                        id="res-capacity"
                        type="number"
                        min={0}
                        className="ui-input"
                        value={capacity}
                        onChange={(e) => setCapacity(e.target.value)}
                      />
                    </div>
                    <div className="ui-field full">
                      <label className="ui-label" htmlFor="res-address">Address / Location <span className="req">*</span></label>
                      <input
                        id="res-address"
                        type="text"
                        required
                        className="ui-input"
                        placeholder="Main Road, Central Ward, Sector 4"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      />
                    </div>
                    <div className="ui-field full">
                      <label className="ui-label" htmlFor="res-services">Available Services</label>
                      <input
                        id="res-services"
                        type="text"
                        className="ui-input"
                        placeholder="e.g. Emergency trauma, surgical ICU, ambulance"
                        value={services}
                        onChange={(e) => setServices(e.target.value)}
                      />
                    </div>
                    <div className="ui-field full">
                      <label className="ui-label" htmlFor="res-image">Resource Image</label>
                      <input
                        id="res-image"
                        type="file"
                        accept="image/*"
                        className="ui-input"
                        onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                      />
                      {image && <span className="ui-hint">Current image saved. Select a new file to replace it.</span>}
                      {imageFile && <span className="ui-hint">Selected: {imageFile.name}</span>}
                    </div>
                    <div className="ui-field full">
                      <label className="ui-label" htmlFor="res-description">Facility Description</label>
                      <textarea
                        id="res-description"
                        rows={3}
                        className="ui-textarea"
                        placeholder="Facility features, generator backup, water filtration..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="ui-modal-foot">
                  <small>Fields marked * are required.</small>
                  <div>
                    <button
                      type="button"
                      className="ui-btn ghost"
                      onClick={() => (id || location.pathname.endsWith('/add')) ? navigate('/admin/resources') : setIsAddEditOpen(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className={`ui-btn red ${saving ? 'spinning' : ''}`} disabled={saving}>
                      <Icon name="check" size={16} />
                      {saving ? "Saving..." : editingItem ? "Update Resource" : "Save Resource"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default ResourcesAdmin;
