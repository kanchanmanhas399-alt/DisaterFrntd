import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Icon from '../../../user/Pages/Icon';
import { RescueCenterSingle, RescueCenterUpdate } from "../../../../services/RescueCenterService";

const EditRescueCenter = () => {
  const { id } = useParams();
  const nav = useNavigate();

  const [resourceId, setResourceId] = useState("");
  const [centerName, setCenterName] = useState("");
  const [address, setAddress] = useState("");
  const [contact, setContact] = useState("");
  const [services, setServices] = useState("");
  const [status, setStatus] = useState("Available");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      setLoading(true);
      RescueCenterSingle(id)
        .then((res) => {
          const data = res.data.data;
          if (data) {
            setResourceId(data.resourceId || "");
            setCenterName(data.centerName || "");
            setAddress(data.address || "");
            setContact(data.contact || "");
            setServices(data.services || "");
            setStatus(data.status || "Available");
          }
        })
        .catch((err) => {
          const msg = err.response?.data?.message || "Failed to load rescue center details";
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
      resourceId,
      centerName,
      address,
      contact,
      services,
      status,
    };

    RescueCenterUpdate(payload)
      .then((res) => {
        toast.success(res.data.message || "Rescue center updated successfully");
        nav("/admin/rescuecenters");
      })
      .catch((err) => {
        const errorMessage = err.response?.data?.message || err.message || "Failed to update rescue center";
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
              <h1>Edit rescue center</h1>
              <p>Loading the current record&hellip;</p>
            </div>
          </div>
        </section>
        <main className="container ui-content compact-top">
          <div className="ui-state">
            <div className="ui-spinner" />
            <h3>Loading rescue center details</h3>
            <p>Fetching the current center record&hellip;</p>
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
            <h1>Edit rescue center</h1>
            <p>Modify existing rapid rescue team and base facility details.</p>
          </div>
          <div className="ui-hero-meta">
            <div>
              <Icon name="siren" size={19} />
              <span><strong>{resourceId || '—'}</strong> center record</span>
            </div>
            <div>
              <Icon name="ambulance" size={19} />
              <span>Response readiness</span>
            </div>
          </div>
        </div>
      </section>

      <main className="container ui-content compact-top">
        <div className="ui-split">
          <form className="ui-card" onSubmit={handleForm} data-demo-form="">
            <div className="ui-card-head">
              <div>
                <h2>Rescue center details</h2>
                <p>Fields marked * are required.</p>
              </div>
              <span className="ui-badge blue">Editing record</span>
            </div>
            <div className="ui-card-body">
              <div className="ui-form-grid">
                <div className="ui-field">
                  <label className="ui-label" htmlFor="edit-rescue-resource-id">Resource ID <span className="req">*</span></label>
                  <input
                    id="edit-rescue-resource-id"
                    className="ui-input"
                    value={resourceId}
                    onChange={(e) => setResourceId(e.target.value)}
                    required
                    placeholder="e.g., RC-02"
                  />
                </div>

                <div className="ui-field">
                  <label className="ui-label" htmlFor="edit-rescue-center-name">Center Name <span className="req">*</span></label>
                  <input
                    id="edit-rescue-center-name"
                    className="ui-input"
                    value={centerName}
                    onChange={(e) => setCenterName(e.target.value)}
                    required
                    placeholder="e.g., Regional Rescue Unit"
                  />
                </div>

                <div className="ui-field">
                  <label className="ui-label" htmlFor="edit-rescue-contact">Contact Number <span className="req">*</span></label>
                  <input
                    id="edit-rescue-contact"
                    type="tel"
                    className="ui-input"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    required
                    placeholder="e.g., 0123-456-702"
                  />
                </div>

                <div className="ui-field">
                  <label className="ui-label" htmlFor="edit-rescue-status">Status <span className="req">*</span></label>
                  <select
                    id="edit-rescue-status"
                    className="ui-select"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    required
                  >
                    <option value="Available">Available</option>
                    <option value="Active">Active</option>
                    <option value="Full">Full</option>
                    <option value="Limited">Limited</option>
                    <option value="Temporarily Closed">Temporarily Closed</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>

                <div className="ui-field full">
                  <label className="ui-label" htmlFor="edit-rescue-address">Address <span className="req">*</span></label>
                  <input
                    id="edit-rescue-address"
                    className="ui-input"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    placeholder="Area, zone, landmark"
                  />
                </div>

                <div className="ui-field full">
                  <label className="ui-label" htmlFor="edit-rescue-services">Services Provided <span className="req">*</span></label>
                  <textarea
                    id="edit-rescue-services"
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
              <span className="ui-hint">Changes apply after you save.</span>
              <div>
                <button type="submit" className="ui-btn red">
                  <Icon name="check" size={16} /> Update rescue center
                </button>
                <Link to="/admin/rescuecenters" className="ui-btn ghost">
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
                  <h4>Keep readiness current</h4>
                  <p>Confirm contact and services before marking this center active.</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
};

export default EditRescueCenter;
