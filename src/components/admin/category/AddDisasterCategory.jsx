import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AddDisasterCategoryService } from '../../../services/adminServices';
import toast from 'react-hot-toast';
import Icon from '../../user/Pages/Icon';

const AddDisasterCategory = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageIcon, setImageIcon] = useState('');
  const [status, setStatus] = useState('active');

  function handleForm(e) {
    e.preventDefault();

    const payload = {
      name: name,
      description: description,
      imageIcon: imageIcon,
      status: status,
    };

    AddDisasterCategoryService(payload)
      .then((res) => {
        toast.success(res.data.message || 'Disaster category added successfully');
        setName('');
        setDescription('');
        setImageIcon('');
        setStatus('active');
      })
      .catch((err) => {
        const errorMessage = err.response?.data?.message || err.message || 'Failed to add disaster category';
        toast.error(errorMessage);
      });
  }

  function handleReset() {
    setName('');
    setDescription('');
    setImageIcon('');
    setStatus('active');
  }

  return (
    <>
      <section className="ui-hero compact">
        <div className="container ui-hero-inner">
          <div className="ui-hero-copy">
            <span className="ui-eyebrow">Admin Console &middot; Reporting</span>
            <h1>Add Disaster Category</h1>
            <p>Create a new hazard type for emergency reports, alerts, and safety guidance.</p>
            <div className="ui-hero-actions">
              <Link to="/admin/categories" className="ui-btn ghost">
                <Icon name="arrowLeft" size={15} /> Back to categories
              </Link>
            </div>
          </div>
          <div className="ui-hero-meta">
            <div>
              <Icon name="layers" size={18} />
              <span>Reporting taxonomy</span>
            </div>
          </div>
        </div>
      </section>

      <main className="container ui-content compact-top">
        <div className="ui-card">
          <div className="ui-card-head">
            <div>
              <h2>Category details</h2>
              <p>Fields marked with an asterisk are required.</p>
            </div>
            <span className="ui-badge blue">New record</span>
          </div>
          <form onSubmit={handleForm}>
            <div className="ui-card-body">
              <div className="ui-form-grid">
                <div className="ui-field">
                  <label className="ui-label" htmlFor="new-category-name">
                    Category name <span className="req">*</span>
                  </label>
                  <input
                    id="new-category-name"
                    className="ui-input"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="e.g. Flood, Earthquake"
                  />
                  <span className="ui-hint">Use a short, recognisable hazard name.</span>
                </div>

                <div className="ui-field">
                  <label className="ui-label" htmlFor="new-category-status">Status</label>
                  <select
                    id="new-category-status"
                    className="ui-select"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                  <span className="ui-hint">Inactive categories remain saved but are not promoted.</span>
                </div>

                <div className="ui-field full">
                  <label className="ui-label" htmlFor="new-category-icon">
                    Image / icon path <span className="req">*</span>
                  </label>
                  <input
                    id="new-category-icon"
                    className="ui-input"
                    type="text"
                    value={imageIcon}
                    onChange={(e) => setImageIcon(e.target.value)}
                    required
                    placeholder="Enter an image URL or asset path"
                  />
                  <span className="ui-hint">Provide a URL or asset path used to render the category icon.</span>
                </div>

                <div className="ui-field full">
                  <label className="ui-label" htmlFor="new-category-description">
                    Description <span className="req">*</span>
                  </label>
                  <textarea
                    id="new-category-description"
                    className="ui-textarea"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    placeholder="Describe this disaster category in one or two sentences"
                  />
                </div>
              </div>

              <div className="ui-callout amber">
                <Icon name="info" size={18} />
                <div>
                  <h4>Before you save</h4>
                  <p>Category names must be unique. Check the directory first to avoid duplicates.</p>
                </div>
              </div>
            </div>
            <div className="ui-card-foot">
              <small>New categories appear in the management directory immediately.</small>
              <div className="ad-table-actions">
                <button type="reset" className="ui-btn ghost" onClick={handleReset}>
                  Reset
                </button>
                <button type="submit" className="ui-btn red">
                  <Icon name="plus" size={15} /> Save Category
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </>
  );
};

export default AddDisasterCategory;
