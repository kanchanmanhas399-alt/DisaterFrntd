import React, { useState } from 'react';
import toast from 'react-hot-toast';
import Icon from '../../../user/Pages/Icon';
import { HospitalAdd } from "../../../../services/HospitalService";

const AddHospital = () => {
  const [resourceId, setResourceId] = useState("");
  const [hospitalName, setHospitalName] = useState("");
  const [address, setAddress] = useState("");
  const [contact, setContact] = useState("");
  const [services, setServices] = useState("");
  const [status, setStatus] = useState("");

  function handleForm(e) {
    e.preventDefault();

    const payload = { resourceId, hospitalName, address, contact, services, status };

    HospitalAdd(payload)
      .then((res) => {
        toast.success(res.data.message || "Hospital added successfully");
        handleReset();
      })
      .catch((err) => {
        const errorMessage = err.response?.data?.message || err.message || "Failed to add hospital";
        toast.error(errorMessage);
      });
  }

  function handleReset() {
    setResourceId("");
    setHospitalName("");
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
            <h1>Add hospital</h1>
            <p>Register a new hospital contact and service profile.</p>
          </div>
          <div className="ui-hero-meta">
            <div>
              <Icon name="medical" size={19} />
              <span>Emergency care</span>
            </div>
            <div>
              <Icon name="ambulance" size={19} />
              <span>Response network</span>
            </div>
          </div>
        </div>
      </section>

      <main className="container ui-content compact-top">
        <div className="ui-split">
          <form className="ui-card" onSubmit={handleForm} onReset={handleReset} data-demo-form="">
            <div className="ui-card-head">
              <div>
                <h2>Hospital details</h2>
                <p>Fields marked * are required.</p>
              </div>
              <span className="ui-badge blue">New record</span>
            </div>
            <div className="ui-card-body">
              <div className="ui-form-grid">
                <div className="ui-field">
                  <label className="ui-label" htmlFor="hospital-resource-id">Resource ID <span className="req">*</span></label>
                  <input
                    id="hospital-resource-id"
                    className="ui-input"
                    value={resourceId}
                    onChange={(e) => setResourceId(e.target.value)}
                    required
                    placeholder="e.g., HO-02"
                  />
                </div>

                <div className="ui-field">
                  <label className="ui-label" htmlFor="hospital-name">Hospital Name <span className="req">*</span></label>
                  <input
                    id="hospital-name"
                    className="ui-input"
                    value={hospitalName}
                    onChange={(e) => setHospitalName(e.target.value)}
                    required
                    placeholder="e.g., City General Hospital"
                  />
                </div>

                <div className="ui-field">
                  <label className="ui-label" htmlFor="hospital-contact">Contact Number <span className="req">*</span></label>
                  <input
                    id="hospital-contact"
                    type="tel"
                    className="ui-input"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    required
                    placeholder="e.g., 0123-456-702"
                  />
                </div>

                <div className="ui-field">
                  <label className="ui-label" htmlFor="hospital-status">Status <span className="req">*</span></label>
                  <select
                    id="hospital-status"
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
                  <label className="ui-label" htmlFor="hospital-address">Address <span className="req">*</span></label>
                  <input
                    id="hospital-address"
                    className="ui-input"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    placeholder="Civil Lines, City Centre"
                  />
                  <span className="ui-hint">Use the address people can give to responders.</span>
                </div>

                <div className="ui-field full">
                  <label className="ui-label" htmlFor="hospital-services">Services Provided <span className="req">*</span></label>
                  <textarea
                    id="hospital-services"
                    className="ui-textarea"
                    value={services}
                    onChange={(e) => setServices(e.target.value)}
                    required
                    placeholder="e.g., Emergency, trauma, ICU"
                  />
                </div>
              </div>
            </div>
            <div className="ui-card-foot">
              <span className="ui-hint">Save to add this hospital to the directory.</span>
              <div>
                <button type="submit" className="ui-btn red">
                  <Icon name="plus" size={16} /> Save hospital
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
                    <h4>List available services</h4>
                    <p>Separate each service so responders can scan the record quickly.</p>
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

export default AddHospital;
