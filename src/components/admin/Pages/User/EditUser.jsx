import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { CustomerSingle, CustomerUpdate } from '../../../../services/CustomerServices';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Icon from '../../../user/Pages/Icon';

const capitalize = (value) => {
  const text = String(value || '');
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : '';
};

const EditUser = () => {
  const { id } = useParams();
  const nav = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [userType, setUserType] = useState('citizen');
  const [status, setStatus] = useState('active');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      setLoading(true);
      CustomerSingle(id)
        .then((res) => {
          const data = res.data.data;
          if (data) {
            setName(data.name || '');
            setEmail(data.email || '');
            setMobile(data.phone || data.mobile || '');
            setUserType(data.userType || 'citizen');
            setStatus(data.status || 'active');
          }
        })
        .catch((err) => {
          const msg = err.response?.data?.message || 'Failed to load user details';
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
      name,
      email,
      phone: mobile,
      userType,
      status
    };

    CustomerUpdate(payload)
      .then((res) => {
        toast.success(res.data.message || 'User updated successfully');
        nav('/admin/users');
      })
      .catch((err) => {
        const errorMessage = err.response?.data?.message || err.message || 'Failed to update user';
        toast.error(errorMessage);
      });
  }

  return (
    <>
      <section className="ui-hero compact">
        <div className="container ui-hero-inner">
          <div className="ui-hero-copy">
            <span className="ui-eyebrow">Admin Console · Accounts</span>
            <h1>Edit user</h1>
            <p>Modify existing user profile details.</p>
          </div>
          <div className="ui-hero-meta">
            <div>
              <Icon name="user" size={18} />
              <span>{name || 'Account record'}</span>
            </div>
            <div>
              <Icon name="shield" size={18} />
              <span>Role and access controls</span>
            </div>
          </div>
        </div>
      </section>

      <main className="container ui-content compact-top">
        {loading ? (
          <div className="ui-state">
            <div className="ui-spinner" />
            <h3>Loading user details...</h3>
            <p>Fetching the account record.</p>
          </div>
        ) : (
          <>
            <div className="ui-section-head">
              <div>
                <span className="ui-eyebrow dark">Account record</span>
                <h2>Edit profile</h2>
                <p>Update contact details, role, and account status.</p>
              </div>
              <Link to="/admin/users" className="ui-btn ghost">
                <Icon name="arrowLeft" size={15} /> Back to users
              </Link>
            </div>

            <div className="ui-split">
              <form onSubmit={handleForm} data-demo-form="" className="ui-card">
                <div className="ui-card-head">
                  <div>
                    <h3>User information</h3>
                    <p>Asterisk marks required fields.</p>
                  </div>
                  <span className="ui-badge blue">Editing</span>
                </div>
                <div className="ui-card-body">
                  <div className="ui-form-grid">
                    <div className="ui-field">
                      <label className="ui-label" htmlFor="edit-user-name">Full Name <span className="req">*</span></label>
                      <input
                        id="edit-user-name"
                        className="ui-input"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        required
                        placeholder="e.g., John Doe"
                      />
                    </div>

                    <div className="ui-field">
                      <label className="ui-label" htmlFor="edit-user-email">Email Address <span className="req">*</span></label>
                      <input
                        id="edit-user-email"
                        type="email"
                        className="ui-input"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        required
                        placeholder="e.g., john@example.com"
                      />
                    </div>

                    <div className="ui-field">
                      <label className="ui-label" htmlFor="edit-user-mobile">Mobile Number <span className="req">*</span></label>
                      <input
                        id="edit-user-mobile"
                        type="tel"
                        className="ui-input"
                        value={mobile}
                        onChange={(event) => setMobile(event.target.value)}
                        required
                        placeholder="e.g., 0123-456-789"
                      />
                    </div>

                    <div className="ui-field">
                      <label className="ui-label" htmlFor="edit-user-role">Role</label>
                      <select
                        id="edit-user-role"
                        className="ui-select"
                        value={userType}
                        onChange={(event) => setUserType(event.target.value)}
                      >
                        <option value="citizen">Citizen</option>
                        <option value="responder">Responder</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>

                    <div className="ui-field">
                      <label className="ui-label" htmlFor="edit-user-status">Status</label>
                      <select
                        id="edit-user-status"
                        className="ui-select"
                        value={status}
                        onChange={(event) => setStatus(event.target.value)}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="suspended">Suspended</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="ui-card-foot">
                  <span className="ui-hint">Changes apply after saving.</span>
                  <div>
                    <button type="submit" className="ui-btn red">
                      <Icon name="check" size={15} /> Update User
                    </button>
                    <Link to="/admin/users" className="ui-btn ghost">Cancel</Link>
                  </div>
                </div>
              </form>

              <div>
                <div className="ui-card">
                  <div className="ui-card-head">
                    <h3>Current access</h3>
                  </div>
                  <div className="ui-card-body">
                    <div className="ui-detail-grid">
                      <div className="ui-detail-cell">
                        <span>Role</span>
                        <strong>{capitalize(userType)}</strong>
                      </div>
                      <div className="ui-detail-cell">
                        <span>Status</span>
                        <strong>{capitalize(status)}</strong>
                      </div>
                    </div>
                    <div className="ui-callout amber">
                      <Icon name="info" size={17} />
                      <div>
                        <h4>Access changes</h4>
                        <p>Role and status updates take effect after save.</p>
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

export default EditUser;
