import React from 'react';
import Icon from '../../user/Pages/Icon';

const Profile = () => {
  return (
    <>
      <section className="ui-hero compact">
        <div className="container ui-hero-inner">
          <div className="ui-hero-copy">
            <span className="ui-eyebrow">Account</span>
            <h1>Admin profile</h1>
            <p>Review the signed-in administrator account details.</p>
          </div>
          <div className="ui-hero-meta">
            <div>
              <Icon name="shield" size={19} />
              <span><strong>Super Admin</strong> access</span>
            </div>
          </div>
        </div>
      </section>

      <main className="container ui-content compact-top">
        <div className="ui-card">
          <div className="ui-card-head">
            <div>
              <h2>Account details</h2>
              <p>Demo profile &mdash; changes are not sent to a server.</p>
            </div>
          </div>
          <form data-demo-form="" className="ui-card-body ui-form-grid">
            <div className="ui-field">
              <label className="ui-label" htmlFor="admin-name">Name</label>
              <input id="admin-name" className="ui-input" defaultValue="Administrator" />
            </div>
            <div className="ui-field">
              <label className="ui-label" htmlFor="admin-email">Email</label>
              <input id="admin-email" className="ui-input" type="email" defaultValue="admin@disasterguard.demo" />
            </div>
            <div className="ui-field">
              <label className="ui-label" htmlFor="admin-role">Role</label>
              <input id="admin-role" className="ui-input" defaultValue="Super Admin" disabled="" />
            </div>
            <div className="ui-field full">
              <button type="submit" className="ui-btn primary">
                <Icon name="check" size={15} /> Save demo profile
              </button>
            </div>
          </form>
        </div>
        <div data-toast="" className="toast hidden" />
      </main>
    </>
  );
};

export default Profile;
