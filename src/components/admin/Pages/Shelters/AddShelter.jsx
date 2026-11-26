import React, { useState } from 'react';
import toast from 'react-hot-toast';
import Icon from '../../../user/Pages/Icon';
import { ShelterAdd } from "../../../../services/ShelterService";

const AddShelter = () => {
  const [resourceId, setResourceId] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [contact, setContact] = useState("");
  const [capacity, setCapacity] = useState("");
  const [status, setStatus] = useState("");

  function handleForm(e) {
    e.preventDefault();

    const payload = { resourceId, name, address, contact, capacity, status };

    ShelterAdd(payload)
      .then((res) => {
        toast.success(res.data.message || "Shelter added successfully");
        handleReset();
      })
      .catch((err) => {
        const errorMessage = err.response?.data?.message || err.message || "Failed to add shelter";
        toast.error(errorMessage);
      });
  }

  function handleReset() {
    setResourceId("");
    setName("");
    setAddress("");
    setContact("");
    setCapacity("");
    setStatus("");
  }

  return (
    <>
      <section className="ui-hero compact">
        <div className="container ui-hero-inner">
          <div className="ui-hero-copy">
            <span className="ui-eyebrow">Resource Directory · New Record</span>
            <h1>Add shelter</h1>
            <p>Register a new public shelter location and capacity.</p>
          </div>
          <div className="ui-hero-meta">
            <div>
              <Icon name="shield" size={19} />
              <span>Directory entry</span>
            </div>
            <div>
              <Icon name="phone" size={19} />
              <span>Contact required</span>
            </div>
          </div>
        </div>
      </section>

      <main className="container ui-content compact-top">
        <div className="ui-split">
          <form className="ui-card" onSubmit={handleForm} onReset={handleReset} data-demo-form="">
            <div className="ui-card-head">
              <div>
                <h2>Shelter details</h2>
                <p>Fields marked * are required.</p>
              </div>
              <span className="ui-badge blue">New record</span>
            </div>
            <div className="ui-card-body">
              <div className="ui-form-grid">
                <div className="ui-field">
                  <label className="ui-label" htmlFor="shelter-resource-id">Resource ID <span className="req">*</span></label>
                  <input
                    id="shelter-resource-id"
                    className="ui-input"
                    value={resourceId}
                    onChange={(e) => setResourceId(e.target.value)}
                    required
                    placeholder="e.g., SH-02"
                  />
                </div>

                <div className="ui-field">
                  <label className="ui-label" htmlFor="shelter-name">Shelter Name <span className="req">*</span></label>
                  <input
                    id="shelter-name"
                    className="ui-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="e.g., District Community Shelter"
                  />
                </div>

                <div className="ui-field">
                  <label className="ui-label" htmlFor="shelter-contact">Contact Number <span className="req">*</span></label>
                  <input
                    id="shelter-contact"
                    type="tel"
                    className="ui-input"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    required
                    placeholder="e.g., 0123-456-700"
                  />
                </div>

                <div className="ui-field">
                  <label className="ui-label" htmlFor="shelter-capacity">Capacity <span className="req">*</span></label>
                  <input
                    id="shelter-capacity"
                    type="number"
                    className="ui-input"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    required
                    placeholder="e.g., 250"
                  />
                </div>

                <div className="ui-field">
                  <label className="ui-label" htmlFor="shelter-status">Status <span className="req">*</span></label>
                  <select
                    id="shelter-status"
                    className="ui-select"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    required
                  >
                    <option value="">Select status</option>
                    <option value="Available">Available</option>
                    <option value="Active">Active</option>
                    <option value="Limited">Limited</option>
                    <option value="Pending">Pending</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>

                <div className="ui-field full">
                  <label className="ui-label" htmlFor="shelter-address">Address <span className="req">*</span></label>
                  <input
                    id="shelter-address"
                    className="ui-input"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    placeholder="Main Road, Central Ward"
                  />
                  <span className="ui-hint">Use a landmark that people can find quickly.</span>
                </div>
              </div>
            </div>
            <div className="ui-card-foot">
              <span className="ui-hint">Save to add this shelter to the directory.</span>
              <div>
                <button type="submit" className="ui-btn red">
                  <Icon name="plus" size={16} /> Save shelter
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
                    <h4>Capacity must be current</h4>
                    <p>Enter the number of people this shelter can accommodate now.</p>
                  </div>
                </div>
                <div className="ui-callout green">
                  <Icon name="phone" size={18} />
                  <div>
                    <h4>Working contact</h4>
                    <p>Use a number that staff can answer during an emergency.</p>
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

export default AddShelter;
