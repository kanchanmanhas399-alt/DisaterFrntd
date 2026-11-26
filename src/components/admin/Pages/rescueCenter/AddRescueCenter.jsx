import React, { useState } from 'react';
import { RescueCenterAdd } from "../../../../services/RescueCenterService";
import toast from 'react-hot-toast';
import Icon from '../../../user/Pages/Icon';

const AddRescueCenter = () => {
  const [resourceId, setResourceId] = useState("");
  const [centerName, setCenterName] = useState("");
  const [address, setAddress] = useState("");
  const [contact, setContact] = useState("");
  const [services, setServices] = useState("");
  const [status, setStatus] = useState("");

  function handleForm(e) {
    e.preventDefault();

    const payload = { resourceId, centerName, address, contact, services, status };

    RescueCenterAdd(payload)
      .then((res) => {
        toast.success(res.data.message || "Rescue center added successfully");
        handleReset();
      })
      .catch((err) => {
        const errorMessage = err.response?.data?.message || err.message || "Failed to add rescue center";
        toast.error(errorMessage);
      });
  }

  function handleReset() {
    setResourceId("");
    setCenterName("");
    setAddress("");
    setContact("");
    setServices("");
    setStatus("");
  }

  return (
    <>
      <section className="ui-hero compact">
        <div className="container ui-hero-inner">
          <div className="ui-hero-copy">
            <span className="ui-eyebrow">Resource Directory · New Record</span>
            <h1>Add rescue center</h1>
            <p>Register a new rescue team or response facility.</p>
          </div>
          <div className="ui-hero-meta">
            <div>
              <Icon name="siren" size={19} />
              <span>Rapid response</span>
            </div>
            <div>
              <Icon name="ambulance" size={19} />
              <span>Deployment ready</span>
            </div>
          </div>
        </div>
      </section>

      <main className="container ui-content compact-top">
        <div className="ui-split">
          <form className="ui-card" onSubmit={handleForm} onReset={handleReset} data-demo-form="">
            <div className="ui-card-head">
              <div>
                <h2>Rescue center details</h2>
                <p>Fields marked * are required.</p>
              </div>
              <span className="ui-badge blue">New record</span>
            </div>
            <div className="ui-card-body">
              <div className="ui-form-grid">
                <div className="ui-field">
                  <label className="ui-label" htmlFor="rescue-resource-id">Resource ID <span className="req">*</span></label>
                  <input
                    id="rescue-resource-id"
                    className="ui-input"
                    value={resourceId}
                    onChange={(e) => setResourceId(e.target.value)}
                    required
                    placeholder="e.g., RC-02"
                  />
                </div>

                <div className="ui-field">
                  <label className="ui-label" htmlFor="rescue-center-name">Center Name <span className="req">*</span></label>
                  <input
                    id="rescue-center-name"
                    className="ui-input"
                    value={centerName}
                    onChange={(e) => setCenterName(e.target.value)}
                    required
                    placeholder="e.g., Regional Rescue Unit"
                  />
                </div>

                <div className="ui-field">
                  <label className="ui-label" htmlFor="rescue-contact">Contact Number <span className="req">*</span></label>
                  <input
                    id="rescue-contact"
                    type="tel"
                    className="ui-input"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    required
                    placeholder="e.g., 0123-456-702"
                  />
                </div>

                <div className="ui-field">
                  <label className="ui-label" htmlFor="rescue-status">Status <span className="req">*</span></label>
                  <select
                    id="rescue-status"
                    className="ui-select"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    required
                  >
                    <option value="">Select status</option>
                    <option value="Active">Active</option>
                    <option value="Available">Available</option>
                    <option value="Limited">Limited</option>
                    <option value="Pending">Pending</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>

                <div className="ui-field full">
                  <label className="ui-label" htmlFor="rescue-address">Address <span className="req">*</span></label>
                  <input
                    id="rescue-address"
                    className="ui-input"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    placeholder="Area, zone, landmark"
                  />
                  <span className="ui-hint">Use a landmark crews can reach quickly.</span>
                </div>

                <div className="ui-field full">
                  <label className="ui-label" htmlFor="rescue-services">Services Provided <span className="req">*</span></label>
                  <textarea
                    id="rescue-services"
                    className="ui-textarea"
                    value={services}
                    onChange={(e) => setServices(e.target.value)}
                    required
                    placeholder="e.g., Evacuation, medical aid, search and rescue"
                  />
                </div>
              </div>
            </div>
            <div className="ui-card-foot">
              <span className="ui-hint">Save to add this center to the directory.</span>
              <div>
                <button type="submit" className="ui-btn red">
                  <Icon name="plus" size={16} /> Save rescue center
                </button>
                <button type="reset" className="ui-btn ghost">Reset</button>
              </div>
            </div>
          </form>

          <aside className="ui-card">
            <div className="ui-card-head">
              <h2>Registration notes</h2>
            </div>
            <div className="ui-card-body">
              <div className="ui-grid">
                <div className="ui-callout amber">
                  <Icon name="info" size={18} />
                  <div>
                    <h4>List core capabilities</h4>
                    <p>Include evacuation, medical aid, and search and rescue where applicable.</p>
                  </div>
                </div>
                <div className="ui-callout green">
                  <Icon name="phone" size={18} />
                  <div>
                    <h4>Working contact</h4>
                    <p>Use a number that crews can reach during a deployment.</p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
};

export default AddRescueCenter;
