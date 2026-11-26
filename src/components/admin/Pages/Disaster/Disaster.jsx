import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import { DisasterAll, DisasterDelete } from '../../../../services/DisasterService';
import { Link } from 'react-router-dom';
import Icon from '../../../user/Pages/Icon';

const Disaster = ({ onViewChange, setSelectedDisaster }) => {
  const [disasters, setDisasters] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const loadDisasters = () => {
    DisasterAll()
      .then((res) => {
        setDisasters(res.data.data || []);
      })
      .catch((err) => {
        const message = err.response?.data?.message || 'Unable to load disasters';
        toast.error(message);
      });
  };

  useEffect(() => {
    loadDisasters();
  }, []);

  const filteredDisasters = disasters.filter((item) => {
    const search = (item.disasterName || '').toLowerCase();
    const matchesSearch =
      search.includes(searchTerm.toLowerCase()) ||
      (item.disasterId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.location || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter ? item.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  const DeleteItem = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this disaster record!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        DisasterDelete(id)
          .then((res) => {
            Swal.fire({
              title: 'Deleted!',
              text: res.data.message || 'Disaster deleted successfully!',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
            });
            loadDisasters();
          })
          .catch((err) => {
            Swal.fire({
              title: 'Error!',
              text: err.response?.data?.message || 'Failed to delete disaster.',
              icon: 'error'
            });
          });
      }
    });
  };

  const getBadgeClass = (status) => {
    switch (status) {
      case 'Active': return 'ui-badge green';
      case 'Monitoring': return 'ui-badge amber';
      case 'Resolved': return 'ui-badge blue';
      default: return 'ui-badge';
    }
  };

  return (
    <>
      <section className="ui-hero compact">
        <div className="container ui-hero-inner">
          <div className="ui-hero-copy">
            <span className="ui-eyebrow">Admin Console · Operations</span>
            <h1>Disaster management</h1>
            <p>Manage incident categories and recorded disaster events.</p>
          </div>
          <div className="ui-hero-meta">
            <div>
              <Icon name="storm" size={18} />
              <span><strong>{disasters.length}</strong> records</span>
            </div>
            <div>
              <Icon name="filter" size={18} />
              <span><strong>{filteredDisasters.length}</strong> shown</span>
            </div>
          </div>
        </div>
      </section>

      <main className="container ui-content compact-top">
        <div className="ui-section-head">
          <div>
            <span className="ui-eyebrow dark">Incident register</span>
            <h2>Disaster records</h2>
            <p>Search, filter, and maintain event details.</p>
          </div>
          <span className="ui-badge blue">Operational data</span>
        </div>

        <div className="ui-toolbar">
          <label className="ui-search">
            <Icon name="search" size={16} />
            <input
              type="search"
              className="ui-input"
              data-table-search=""
              placeholder="Search disaster management..."
              aria-label="Search table"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </label>
          <select
            className="ui-select"
            data-status-filter=""
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            aria-label="Filter disasters by status"
          >
            <option value="">All statuses</option>
            <option value="Active">Active</option>
            <option value="Monitoring">Monitoring</option>
            <option value="Pending">Pending</option>
            <option value="Resolved">Resolved</option>
          </select>
          <Link to="/admin/add-disaster" className="ui-btn primary" data-add-new="">
            <Icon name="plus" size={15} /> Add New
          </Link>
        </div>

        <div className="ui-table-wrap">
          <table className="ui-table">
            <thead>
              <tr>
                <th>Disaster ID</th>
                <th>Disaster name</th>
                <th>Type</th>
                <th>Location</th>
                <th>Severity</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody data-table-body="">
              {filteredDisasters.length > 0 ? (
                filteredDisasters.map((item) => (
                  <tr key={item._id || item.id}>
                    <td><strong>{item.disasterId}</strong></td>
                    <td>{item.disasterName}</td>
                    <td>{item.type}</td>
                    <td>{item.location}</td>
                    <td>{item.severity}</td>
                    <td><span className={getBadgeClass(item.status)}>{item.status}</span></td>
                    <td>
                      <div>
                        <Link
                          to={`/admin/editdisaster/${item._id || item.id}`}
                          className="ui-btn ghost sm"
                          data-edit=""
                        >
                          <Icon name="edit" size={14} /> Edit
                        </Link>
                        <button
                          type="button"
                          className="ui-btn red sm"
                          data-delete=""
                          onClick={() => DeleteItem(item._id)}
                        >
                          <Icon name="trash" size={14} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="muted">No disaster records found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
};

export default Disaster;
