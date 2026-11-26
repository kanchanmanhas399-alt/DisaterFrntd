import React, { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import Icon from '../../../user/Pages/Icon';
import { ShelterAll, ShelterDelete } from '../../../../services/ShelterService';

const Shelters = () => {
  const [shelters, setShelters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchShelters = useCallback(() => {
    setLoading(true);
    ShelterAll()
      .then((res) => {
        setShelters(res.data.data || []);
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || "Failed to load shelters");
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchShelters();
  }, [fetchShelters]);

  const filteredShelters = shelters.filter((item) => {
    const matchesSearch =
      (item.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.resourceId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.address || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter ? item.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  const handleDeletePrompt = (item) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `Are you sure you want to delete "${item.name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        ShelterDelete(item._id)
          .then(() => {
            Swal.fire({
              title: 'Deleted!',
              text: 'Shelter deleted successfully.',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
            });
            fetchShelters();
          })
          .catch((err) => {
            Swal.fire({
              title: 'Error!',
              text: err.response?.data?.message || 'Failed to delete shelter.',
              icon: 'error'
            });
          });
      }
    });
  };

  const getBadgeTone = (status) => {
    switch (status) {
      case 'Available':
      case 'Active':
        return 'green';
      case 'Full':
      case 'Limited':
        return 'amber';
      case 'Temporarily Closed':
        return 'red';
      default:
        return 'slate';
    }
  };

  const readyCount = shelters.filter(
    (item) => item.status === 'Available' || item.status === 'Active'
  ).length;

  return (
    <>
      <section className="ui-hero compact">
        <div className="container ui-hero-inner">
          <div className="ui-hero-copy">
            <span className="ui-eyebrow">Resource Directory · Administration</span>
            <h1>Shelter management</h1>
            <p>Maintain public emergency shelter locations, contacts, and capacity.</p>
            <div className="ui-hero-actions">
              <Link to="/admin/addshelter" className="ui-btn red">
                <Icon name="plus" size={16} /> Add new shelter
              </Link>
            </div>
          </div>
          <div className="ui-hero-meta">
            <div>
              <Icon name="home" size={19} />
              <span><strong>{shelters.length}</strong> registered shelters</span>
            </div>
            <div>
              <Icon name="shield" size={19} />
              <span><strong>{readyCount}</strong> ready to receive people</span>
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
              placeholder="Search shelter records..."
              aria-label="Search table"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </label>
          <select
            className="ui-select"
            aria-label="Filter by status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All statuses</option>
            <option value="Available">Available</option>
            <option value="Full">Full</option>
            <option value="Limited">Limited</option>
            <option value="Temporarily Closed">Temporarily Closed</option>
            <option value="Active">Active</option>
          </select>
          <button type="button" className="ui-btn ghost" onClick={fetchShelters}>
            <Icon name="refresh" size={16} /> Refresh
          </button>
        </div>

        <div className="ui-section-head">
          <div>
            <h2>Shelter records</h2>
            <p>Showing {filteredShelters.length} of {shelters.length} locations</p>
          </div>
          <span className="ui-badge blue">{statusFilter || 'All statuses'}</span>
        </div>

        {loading ? (
          <div className="ui-state">
            <div className="ui-spinner" />
            <h3>Loading shelters</h3>
            <p>Fetching the latest shelter records&hellip;</p>
          </div>
        ) : filteredShelters.length > 0 ? (
          <div className="ui-table-wrap">
            <table className="ui-table">
              <thead>
                <tr>
                  <th>Resource ID</th>
                  <th>Shelter Name</th>
                  <th>Address</th>
                  <th>Contact</th>
                  <th>Capacity</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredShelters.map((item) => (
                  <tr key={item._id}>
                    <td><strong>{item.resourceId}</strong></td>
                    <td>{item.name}</td>
                    <td>{item.address}</td>
                    <td>{item.contact}</td>
                    <td>{item.capacity}</td>
                    <td>
                      <span className={`ui-badge ${getBadgeTone(item.status)}`}>{item.status}</span>
                    </td>
                    <td>
                      <div>
                        <Link
                          to={`/admin/shelteredit/${item._id}`}
                          className="ui-btn ghost sm"
                          title="Edit"
                        >
                          <Icon name="edit" size={14} /> Edit
                        </Link>
                        <button
                          type="button"
                          className="ui-btn red sm"
                          onClick={() => handleDeletePrompt(item)}
                          title="Delete"
                        >
                          <Icon name="trash" size={14} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="ui-state">
            <div className="state-icon"><Icon name="home" size={24} /></div>
            <h3>No shelter records found</h3>
            <p>Try a different search term or status filter.</p>
          </div>
        )}
      </main>
    </>
  );
};

export default Shelters;
