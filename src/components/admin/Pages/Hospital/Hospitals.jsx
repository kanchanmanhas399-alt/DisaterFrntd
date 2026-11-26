import React, { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import Icon from '../../../user/Pages/Icon';
import { HospitalAll, HospitalDelete } from '../../../../services/HospitalService';

const Hospitals = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchHospitals = useCallback(() => {
    setLoading(true);
    HospitalAll()
      .then((res) => {
        setHospitals(res.data.data || []);
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || "Failed to load hospitals");
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchHospitals();
  }, [fetchHospitals]);

  const filteredHospitals = hospitals.filter((item) => {
    const matchesSearch =
      (item.hospitalName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.resourceId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.address || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.services || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter ? item.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  const handleDeletePrompt = (hospital) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `Are you sure you want to delete "${hospital.hospitalName}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        HospitalDelete(hospital._id)
          .then(() => {
            Swal.fire({
              title: 'Deleted!',
              text: 'Hospital record deleted successfully.',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
            });
            fetchHospitals();
          })
          .catch((err) => {
            Swal.fire({
              title: 'Error!',
              text: err.response?.data?.message || 'Failed to delete hospital record.',
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

  const readyCount = hospitals.filter(
    (item) => item.status === 'Available' || item.status === 'Active'
  ).length;

  return (
    <>
      <section className="ui-hero compact">
        <div className="container ui-hero-inner">
          <div className="ui-hero-copy">
            <span className="ui-eyebrow">Resource Directory · Administration</span>
            <h1>Hospital management</h1>
            <p>Maintain emergency medical centers, trauma units, contacts, and available services.</p>
            <div className="ui-hero-actions">
              <Link to="/admin/addhospital" className="ui-btn red">
                <Icon name="plus" size={16} /> Add new hospital
              </Link>
            </div>
          </div>
          <div className="ui-hero-meta">
            <div>
              <Icon name="medical" size={19} />
              <span><strong>{hospitals.length}</strong> registered hospitals</span>
            </div>
            <div>
              <Icon name="ambulance" size={19} />
              <span><strong>{readyCount}</strong> accepting patients</span>
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
              placeholder="Search hospital name, services, location..."
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
          <button type="button" className="ui-btn ghost" onClick={fetchHospitals}>
            <Icon name="refresh" size={16} /> Refresh
          </button>
        </div>

        <div className="ui-section-head">
          <div>
            <h2>Hospital records</h2>
            <p>Showing {filteredHospitals.length} of {hospitals.length} facilities</p>
          </div>
          <span className="ui-badge blue">{statusFilter || 'All statuses'}</span>
        </div>

        {loading ? (
          <div className="ui-state">
            <div className="ui-spinner" />
            <h3>Loading hospitals</h3>
            <p>Fetching the latest hospital records&hellip;</p>
          </div>
        ) : filteredHospitals.length > 0 ? (
          <div className="ui-table-wrap">
            <table className="ui-table">
              <thead>
                <tr>
                  <th>Resource ID</th>
                  <th>Hospital</th>
                  <th>Address</th>
                  <th>Contact</th>
                  <th>Services</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredHospitals.map((item) => (
                  <tr key={item._id}>
                    <td><strong>{item.resourceId}</strong></td>
                    <td>{item.hospitalName}</td>
                    <td>{item.address}</td>
                    <td>{item.contact}</td>
                    <td>{item.services}</td>
                    <td>
                      <span className={`ui-badge ${getBadgeTone(item.status)}`}>{item.status}</span>
                    </td>
                    <td>
                      <div>
                        <Link
                          to={`/admin/edithospital/${item._id}`}
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
            <div className="state-icon"><Icon name="medical" size={24} /></div>
            <h3>No hospital records found</h3>
            <p>Try a different search term or status filter.</p>
          </div>
        )}
      </main>
    </>
  );
};

export default Hospitals;
