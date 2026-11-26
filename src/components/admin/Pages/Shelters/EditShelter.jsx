import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Icon from '../../../user/Pages/Icon';
import { ShelterUpdate, ShelterSingle } from "../../../../services/ShelterService";

const EditShelter = () => {
  const { id } = useParams();
  const nav = useNavigate();

  const [resourceId, setResourceId] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [contact, setContact] = useState("");
  const [capacity, setCapacity] = useState("");
  const [status, setStatus] = useState("Available");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      ShelterSingle(id)
        .then((res) => {
          const data = res.data.data;
          if (data) {
            setResourceId(data.resourceId || "");
            setName(data.name || "");
            setAddress(data.address || "");
            setContact(data.contact || "");
            setCapacity(data.capacity || "");
            setStatus(data.status || "Available");
          }
        })
        .catch(() => {
          toast.error("Failed to load shelter data");
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
      name,
      address,
      contact,
      capacity: parseInt(capacity, 10) || 0,
      status,
    };

    ShelterUpdate(payload)
      .then((res) => {
        toast.success(res.data.message || "Shelter updated successfully");
        nav("/admin/shelters");
      })
      .catch((err) => {
        const errorMessage = err.response?.data?.message || err.message || "Failed to update shelter";
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
              <h1>Edit shelter</h1>
              <p>Loading the current record&hellip;</p>
            </div>
          </div>
        </section>
        <main className="container ui-content compact-top">
          <div className="ui-state">
            <div className="ui-spinner" />
            <h3>Loading shelter information</h3>
            <p>Fetching the current shelter record&hellip;</p>
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
            <h1>Edit shelter</h1>
            <p>Modify existing public shelter location, capacity, and operational status.</p>
          </div>
          <div className="ui-hero-meta">
            <div>
              <Icon name="home" size={19} />
              <span><strong>{resourceId || '—'}</strong> shelter record</span>
            </div>
            <div>
              <Icon name="shield" size={19} />
              <span>Operational status</span>
            </div>
          </div>
        </div>
      </section>

      <main className="container ui-content compact-top">
        <div className="ui-split">
          <form className="ui-card" onSubmit={handleForm} data-demo-form="">
            <div className="ui-card-head">
              <div>
                <h2>Shelter details</h2>
                <p>Fields marked * are required.</p>
              </div>
              <span className="ui-badge blue">Editing record</span>
            </div>
            <div className="ui-card-body">
              <div className="ui-form-grid">
                <div className="ui-field">
                  <label className="ui-label" htmlFor="edit-shelter-resource-id">Resource ID <span className="req">*</span></label>
                  <input
                    id="edit-shelter-resource-id"
                    className="ui-input"
                    value={resourceId}
                    onChange={(e) => setResourceId(e.target.value)}
                    required
                    placeholder="e.g., SH-01"
                  />
                </div>

                <div className="ui-field">
                  <label className="ui-label" htmlFor="edit-shelter-name">Shelter Name <span className="req">*</span></label>
                  <input
                    id="edit-shelter-name"
                    className="ui-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="e.g., District Community Shelter"
                  />
                </div>

                <div className="ui-field">
                  <label className="ui-label" htmlFor="edit-shelter-contact">Contact Number <span className="req">*</span></label>
                  <input
                    id="edit-shelter-contact"
                    type="tel"
                    className="ui-input"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    required
                    placeholder="e.g., 0123-456-700"
                  />
                </div>

                <div className="ui-field">
                  <label className="ui-label" htmlFor="edit-shelter-capacity">Capacity <span className="req">*</span></label>
                  <input
                    id="edit-shelter-capacity"
                    type="number"
                    className="ui-input"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    required
                    placeholder="e.g., 250"
                  />
                </div>

                <div className="ui-field">
                  <label className="ui-label" htmlFor="edit-shelter-status">Operational Status <span className="req">*</span></label>
                  <select
                    id="edit-shelter-status"
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
                  <label className="ui-label" htmlFor="edit-shelter-address">Address <span className="req">*</span></label>
                  <input
                    id="edit-shelter-address"
                    className="ui-input"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    placeholder="Main Road, Central Ward"
                  />
                </div>
              </div>
            </div>
            <div className="ui-card-foot">
              <span className="ui-hint">Changes apply after you save.</span>
              <div>
                <button type="submit" className="ui-btn red">
                  <Icon name="check" size={16} /> Update shelter
                </button>
                <Link to="/admin/shelters" className="ui-btn ghost">
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
                  <span>Capacity</span>
                  <strong>{capacity || '—'}</strong>
                </div>
                <div className="ui-detail-cell">
                  <span>Contact</span>
                  <strong>{contact || '—'}</strong>
                </div>
              </div>
              <div className="ui-callout amber">
                <Icon name="info" size={18} />
                <div>
                  <h4>Keep details accurate</h4>
                  <p>Confirm capacity and contact before returning this shelter to service.</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
};

export default EditShelter;
