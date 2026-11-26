import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Icon from '../../../user/Pages/Icon';
import { HospitalUpdate, HospitalSingle } from "../../../../services/HospitalService";

const EditHospital = () => {
  const { id } = useParams();
  const nav = useNavigate();

  const [resourceId, setResourceId] = useState("");
  const [hospitalName, setHospitalName] = useState("");
  const [address, setAddress] = useState("");
  const [contact, setContact] = useState("");
  const [services, setServices] = useState("");
  const [status, setStatus] = useState("Available");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      HospitalSingle(id)
        .then((res) => {
          const data = res.data.data;
          if (data) {
            setResourceId(data.resourceId || "");
            setHospitalName(data.hospitalName || "");
            setAddress(data.address || "");
            setContact(data.contact || "");
            setServices(data.services || "");
            setStatus(data.status || "Available");
          }
        })
        .catch(() => {
          toast.error("Failed to load hospital data");
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
      resourceId,
      hospitalName,
      address,
      contact,
      services,
      status,
    };

    HospitalUpdate(payload)
      .then((res) => {
        toast.success(res.data.message || "Hospital updated successfully");
        nav("/admin/hospitals");
      })
      .catch((err) => {
        const errorMessage = err.response?.data?.message || err.message || "Failed to update hospital";
        toast.error(errorMessage);
      });
  }

  if (loading) {
    return (
      <>
        <section className="ui-hero compact">
          <div className="container ui-hero-inner">
            <div className="ui-hero-copy">
              <span className="ui-eyebrow">Resource Directory · Editing</span>
              <h1>Edit hospital</h1>
              <p>Loading the current record&hellip;</p>
            </div>
          </div>
        </section>
        <main className="container ui-content compact-top">
          <div className="ui-state">
            <div className="ui-spinner" />
            <h3>Loading hospital details</h3>
            <p>Fetching the current hospital record&hellip;</p>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <section className="ui-hero compact">
        <div className="container ui-hero-inner">
          <div className="ui-hero-copy">
            <span className="ui-eyebrow">Resource Directory · Editing</span>
            <h1>Edit hospital</h1>
            <p>Modify existing hospital contact, services, and operational status.</p>
          </div>
          <div className="ui-hero-meta">
            <div>
              <Icon name="medical" size={19} />
              <span><strong>{resourceId || '—'}</strong> hospital record</span>
            </div>
            <div>
              <Icon name="ambulance" size={19} />
              <span>Emergency care network</span>
            </div>
          </div>
        </div>
      </section>

      <main className="container ui-content compact-top">
        <div className="ui-split">
          <form className="ui-card" onSubmit={handleForm} data-demo-form="">
            <div className="ui-card-head">
              <div>
                <h2>Hospital details</h2>
                <p>Fields marked * are required.</p>
              </div>
              <span className="ui-badge blue">Editing record</span>
            </div>
            <div className="ui-card-body">
              <div className="ui-form-grid">
                <div className="ui-field">
                  <label className="ui-label" htmlFor="edit-hospital-resource-id">Resource ID <span className="req">*</span></label>
                  <input
                    id="edit-hospital-resource-id"
                    className="ui-input"
                    value={resourceId}
                    onChange={(e) => setResourceId(e.target.value)}
                    required
                    placeholder="e.g., HO-01"
                  />
                </div>

                <div className="ui-field">
                  <label className="ui-label" htmlFor="edit-hospital-name">Hospital Name <span className="req">*</span></label>
                  <input
                    id="edit-hospital-name"
                    className="ui-input"
                    value={hospitalName}
                    onChange={(e) => setHospitalName(e.target.value)}
                    required
                    placeholder="e.g., City General Hospital"
                  />
                </div>

                <div className="ui-field">
                  <label className="ui-label" htmlFor="edit-hospital-contact">Contact Number <span className="req">*</span></label>
                  <input
                    id="edit-hospital-contact"
                    type="tel"
                    className="ui-input"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    required
                    placeholder="e.g., 0123-456-701"
                  />
                </div>

                <div className="ui-field">
                  <label className="ui-label" htmlFor="edit-hospital-status">Operational Status <span className="req">*</span></label>
                  <select
                    id="edit-hospital-status"
                    className="ui-select"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    required
                  >
                    <option value="Available">Available</option>
                    <option value="Full">Full</option>
                    <option value="Limited">Limited</option>
                    <option value="Temporarily Closed">Temporarily Closed</option>
                    <option value="Unavailable">Unavailable</option>
                  </select>
                </div>

                <div className="ui-field full">
                  <label className="ui-label" htmlFor="edit-hospital-address">Address <span className="req">*</span></label>
                  <input
                    id="edit-hospital-address"
                    className="ui-input"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    placeholder="Civil Lines, City Centre"
                  />
                </div>

                <div className="ui-field full">
                  <label className="ui-label" htmlFor="edit-hospital-services">Services Provided <span className="req">*</span></label>
                  <textarea
                    id="edit-hospital-services"
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
              <span className="ui-hint">Changes apply after you save.</span>
              <div>
                <button type="submit" className="ui-btn red">
                  <Icon name="check" size={16} /> Update hospital
                </button>
                <Link to="/admin/hospitals" className="ui-btn ghost">
                  <Icon name="arrowLeft" size={16} /> Cancel
                </Link>
              </div>
            </div>
          </form>

          <aside className="ui-card">
            <div className="ui-card-head">
              <h2>Current record</h2>
            </div>
            <div className="ui-card-body">
              <div className="ui-detail-grid">
                <div className="ui-detail-cell">
                  <span>Resource ID</span>
                  <strong>{resourceId || '—'}</strong>
                </div>
                <div className="ui-detail-cell">
                  <span>Status</span>
                  <strong>{status || '—'}</strong>
                </div>
                <div className="ui-detail-cell">
                  <span>Contact</span>
                  <strong>{contact || '—'}</strong>
                </div>
              </div>
              <div className="ui-callout amber">
                <Icon name="info" size={18} />
                <div>
                  <h4>Keep services current</h4>
                  <p>List only services the hospital can provide right now.</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
};

export default EditHospital;
