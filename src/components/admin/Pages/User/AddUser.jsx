import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { CustomerAdd } from '../../../../services/CustomerServices';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../user/Pages/Icon';

const AddUser = () => {
  const nav = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setpass] = useState('');

  function handleForm(e) {
    e.preventDefault();

    const payload = { name, email, phone: mobile, password };

    CustomerAdd(payload)
      .then((res) => {
        toast.success(res.data.message || 'User added successfully');
        handleReset();
        nav(-1);
      })
      .catch((err) => {
        const errorMessage = err.response?.data?.message || err.message || 'Failed to add user';
        toast.error(errorMessage);
      });
  }

  function handleReset() {
    setName('');
    setEmail('');
    setMobile('');
    setpass('');
  }

  return (
    <>
      <section className="ui-hero compact">
        <div className="container ui-hero-inner">
          <div className="ui-hero-copy">
            <span className="ui-eyebrow">Admin Console · Accounts</span>
            <h1>Add user</h1>
            <p>Register a new platform user profile.</p>
          </div>
          <div className="ui-hero-meta">
            <div>
              <Icon name="user" size={18} />
              <span>New account</span>
            </div>
            <div>
              <Icon name="shield" size={18} />
              <span>Access set after creation</span>
            </div>
          </div>
        </div>
      </section>

      <main className="container ui-content compact-top">
        <div className="ui-section-head">
          <div>
            <span className="ui-eyebrow dark">Registration</span>
            <h2>Account details</h2>
            <p>Complete the required fields to create a profile.</p>
          </div>
          <span className="ui-badge blue">New profile</span>
        </div>

        <div className="ui-split">
          <form onSubmit={handleForm} onReset={handleReset} data-demo-form="" className="ui-card">
            <div className="ui-card-head">
              <div>
                <h3>User information</h3>
                <p>Asterisk marks required fields.</p>
              </div>
              <span className="ui-badge">Step 1 of 1</span>
            </div>
            <div className="ui-card-body">
              <div className="ui-form-grid">
                <div className="ui-field">
                  <label className="ui-label" htmlFor="new-user-name">Full Name <span className="req">*</span></label>
                  <input
                    id="new-user-name"
                    className="ui-input"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    required
                    placeholder="e.g., John Doe"
                  />
                </div>

                <div className="ui-field">
                  <label className="ui-label" htmlFor="new-user-email">Email Address <span className="req">*</span></label>
                  <input
                    id="new-user-email"
                    type="email"
                    className="ui-input"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                    placeholder="e.g., john@example.com"
                  />
                </div>

                <div className="ui-field">
                  <label className="ui-label" htmlFor="new-user-mobile">Mobile Number <span className="req">*</span></label>
                  <input
                    id="new-user-mobile"
                    type="tel"
                    className="ui-input"
                    value={mobile}
                    onChange={(event) => setMobile(event.target.value)}
                    required
                    placeholder="e.g., 0123-456-789"
                  />
                </div>

                <div className="ui-field">
                  <label className="ui-label" htmlFor="new-user-password">Password <span className="req">*</span></label>
                  <input
                    id="new-user-password"
                    type="text"
                    className="ui-input"
                    value={password}
                    onChange={(event) => setpass(event.target.value)}
                    required
                    placeholder="e.g., 0123-456-789"
                  />
                  <span className="ui-hint">Share credentials securely after saving.</span>
                </div>
              </div>
            </div>
            <div className="ui-card-foot">
              <span className="ui-hint">Review details before saving.</span>
              <div>
                <button type="submit" className="ui-btn primary">
                  <Icon name="check" size={15} /> Save User
                </button>
                <button type="reset" className="ui-btn ghost">Reset</button>
              </div>
            </div>
          </form>

          <div>
            <div className="ui-card">
              <div className="ui-card-head">
                <h3>After registration</h3>
              </div>
              <div className="ui-card-body">
                <div className="ui-row">
                  <span className="ui-icon-tile tone-sky"><Icon name="user" size={18} /></span>
                  <div className="ui-row-main">
                    <span className="ui-row-title">Profile created</span>
                    <div className="ui-row-meta">
                      <span>Role and status assigned in Edit User</span>
                    </div>
                  </div>
                </div>
                <div className="ui-grid cols-2">
                  <div className="ui-callout amber">
                    <Icon name="info" size={17} />
                    <div>
                      <h4>Credentials</h4>
                      <p>Deliver the password through a secure channel.</p>
                    </div>
                  </div>
                  <div className="ui-callout green">
                    <Icon name="shield" size={17} />
                    <div>
                      <h4>Access</h4>
                      <p>Set role and status once the account is active.</p>
                    </div>
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

export default AddUser;
