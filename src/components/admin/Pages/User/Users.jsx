import React, { useEffect, useState, useCallback } from 'react';
import { CustomerAll, CustomerDelete } from '../../../../services/CustomerServices';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import Icon from '../../../user/Pages/Icon';

const capitalize = (value) => {
  const text = String(value || '');
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : '';
};

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchUsers = useCallback(() => {
    setLoading(true);
    CustomerAll()
      .then((res) => {
        setUsers(res.data.data || []);
      })
      .catch((err) => {
        const errorMessage = err.response?.data?.message || err.message || 'Failed to load users';
        toast.error(errorMessage);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = users.filter((user) => {
    const userName = (user.name || '').toLowerCase();
    const email = (user.email || '').toLowerCase();
    const mobile = String(user.phone || user.mobile || '').toLowerCase();
    const role = (user.userType || 'citizen').toLowerCase();
    const status = (user.status || 'Active').toLowerCase();

    const matchesSearch =
      userName.includes(search.toLowerCase()) ||
      email.includes(search.toLowerCase()) ||
      mobile.includes(search.toLowerCase()) ||
      role.includes(search.toLowerCase());

    const matchesStatus = !statusFilter || status === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const handleDeletePrompt = (user) => {
    Swal.fire({
      title: 'Confirm Deletion',
      text: `Are you sure you want to permanently delete user account "${user.name}" (${user.email})?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete user!'
    }).then((result) => {
      if (result.isConfirmed) {
        CustomerDelete(user._id)
          .then(() => {
            Swal.fire({
              title: 'Deleted!',
              text: 'User account deleted successfully.',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
            });
            fetchUsers();
          })
          .catch((err) => {
            Swal.fire({
              title: 'Error!',
              text: err.response?.data?.message || 'Failed to delete user.',
              icon: 'error'
            });
          });
      }
    });
  };

  const getBadgeClass = (status = 'Active') => {
    const val = status.toLowerCase();
    if (val === 'active') return 'ui-badge green';
    if (val === 'suspended' || val === 'inactive') return 'ui-badge red';
    return 'ui-badge';
  };

  return (
    <>
      <section className="ui-hero compact">
        <div className="container ui-hero-inner">
          <div className="ui-hero-copy">
            <span className="ui-eyebrow">Admin Console · Accounts</span>
            <h1>User management</h1>
            <p>Review registered citizens, responders, and administrative accounts.</p>
            <div className="ui-hero-actions">
              <Link to="/admin/adduser" className="ui-btn red">
                <Icon name="plus" size={15} /> Add user
              </Link>
            </div>
          </div>
          <div className="ui-hero-meta">
            <div>
              <Icon name="users" size={18} />
              <span><strong>{users.length}</strong> accounts</span>
            </div>
            <div>
              <Icon name="shield" size={18} />
              <span><strong>{filteredUsers.length}</strong> shown</span>
            </div>
          </div>
        </div>
      </section>

      <main className="container ui-content compact-top">
        <div className="ui-section-head">
          <div>
            <span className="ui-eyebrow dark">Directory</span>
            <h2>Registered users</h2>
            <p>Search, filter, and manage account access.</p>
          </div>
          <button type="button" className="ui-btn ghost" onClick={fetchUsers}>
            <Icon name="refresh" size={15} /> Refresh
          </button>
        </div>

        <div className="ui-toolbar">
          <label className="ui-search">
            <Icon name="search" size={16} />
            <input
              type="search"
              className="ui-input"
              placeholder="Search users by name, email, phone, role..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Search users"
            />
          </label>
          <select
            className="ui-select"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            aria-label="Filter users by status"
          >
            <option value="">All statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>

        {loading ? (
          <div className="ui-state">
            <div className="ui-spinner" />
            <h3>Loading registered users...</h3>
            <p>Fetching the account directory.</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="ui-state">
            <div className="state-icon"><Icon name="users" size={24} /></div>
            <h3>No users found</h3>
            <p>No users found matching search criteria.</p>
          </div>
        ) : (
          <div className="ui-table-wrap">
            <table className="ui-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Contact Phone</th>
                  <th>Registration Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user._id}>
                    <td><strong>{user.name}</strong></td>
                    <td className="muted">{user.email}</td>
                    <td>
                      <span className={`ui-badge ${user.userType === 'admin' ? 'red' : 'green'}`}>
                        {capitalize(user.userType || 'Citizen')}
                      </span>
                    </td>
                    <td>{user.phone || '—'}</td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>
                      <span className={getBadgeClass(user.status)}>
                        {capitalize(user.status || 'Active')}
                      </span>
                    </td>
                    <td>
                      <div>
                        <Link
                          to={'/admin/edituser/' + user._id}
                          className="ui-btn ghost sm"
                          aria-label={`Edit ${user.name}`}
                        >
                          <Icon name="edit" size={14} /> Edit
                        </Link>
                        {user.email !== 'admin@gmail.com' && (
                          <button
                            type="button"
                            className="ui-btn red sm"
                            aria-label={`Delete ${user.name}`}
                            onClick={() => handleDeletePrompt(user)}
                          >
                            <Icon name="trash" size={14} /> Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="ui-callout amber">
          <Icon name="info" size={18} />
          <div>
            <h4>Protected account</h4>
            <p>The default admin address cannot be deleted from this list.</p>
          </div>
        </div>
      </main>
    </>
  );
};

export default Users;
