import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import Icon from '../../user/Pages/Icon';
import {
  DisasterCategoryAdminGetAll,
  DisasterCategoryAdminUpdate,
  DisasterCategoryAdminRemove,
  DisasterCategoryAdminSoftDelete,
} from '../../../services/adminServices';

const formatDate = (value) => {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString();
};

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const loadCategories = useCallback(() => {
    setLoading(true);
    DisasterCategoryAdminGetAll()
      .then((res) => setCategories(res.data.data || []))
      .catch((err) => {
        toast.error(err.response?.data?.message || 'Failed to load disaster categories');
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const activeCount = categories.filter((item) => (item.status || 'active') === 'active').length;
  const inactiveCount = categories.length - activeCount;

  const filteredCategories = useMemo(() => {
    const term = query.trim().toLowerCase();
    return categories.filter((item) => {
      const matchesSearch =
        (item.name || '').toLowerCase().includes(term) ||
        (item.description || '').toLowerCase().includes(term);
      const matchesStatus = statusFilter === 'all' || (item.status || 'active') === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [categories, query, statusFilter]);

  const openEditor = (category) => {
    setEditing({
      _id: category._id,
      name: category.name || '',
      description: category.description || '',
      imageIcon: category.imageIcon || '',
      status: category.status || 'active',
    });
  };

  const handleSave = (event) => {
    event.preventDefault();
    if (!editing) return;
    setSaving(true);
    DisasterCategoryAdminUpdate(editing)
      .then((res) => {
        toast.success(res.data.message || 'Disaster category updated');
        setEditing(null);
        loadCategories();
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || 'Failed to update disaster category');
      })
      .finally(() => setSaving(false));
  };

  const handleDelete = (category) => {
    Swal.fire({
      title: 'Remove this category?',
      text: `"${category.name}" can be disabled or deleted permanently.`,
      icon: 'warning',
      showCancelButton: true,
      showDenyButton: true,
      confirmButtonColor: '#d97706',
      denyButtonColor: '#c0392b',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Disable',
      denyButtonText: 'Delete permanently',
    }).then((result) => {
      if (!result.isConfirmed && !result.isDenied) return;

      const request = result.isDenied
        ? DisasterCategoryAdminRemove(category._id)
        : DisasterCategoryAdminSoftDelete(category._id);

      request
        .then((res) => {
          if (result.isDenied) {
            Swal.fire({
              title: 'Deleted!',
              text: res.data.message || 'Disaster category deleted permanently.',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false,
            });
          } else {
            toast.success(res.data.message || 'Disaster category disabled');
          }
          loadCategories();
        })
        .catch((err) => {
          Swal.fire({
            title: 'Error!',
            text: err.response?.data?.message || 'Failed to update disaster category.',
            icon: 'error',
          });
        });
    });
  };

  const clearFilters = () => {
    setQuery('');
    setStatusFilter('all');
  };

  return (
    <>
      <section className="ui-hero compact">
        <div className="container ui-hero-inner">
          <div className="ui-hero-copy">
            <span className="ui-eyebrow">Admin Console &middot; Reporting</span>
            <h1>Disaster Categories</h1>
            <p>Manage the hazard types used across emergency reports, alerts, and safety guidance.</p>
            <div className="ui-hero-actions">
              <Link to="/admin/addcategory" className="ui-btn red">
                <Icon name="plus" size={15} /> Add category
              </Link>
              <button type="button" className="ui-btn ghost" onClick={loadCategories}>
                <Icon name="refresh" size={15} /> Refresh
              </button>
            </div>
          </div>
          <div className="ui-hero-meta">
            <div>
              <Icon name="layers" size={18} />
              <span><strong>{categories.length}</strong> total</span>
            </div>
            <div>
              <Icon name="check" size={18} />
              <span><strong>{activeCount}</strong> active</span>
            </div>
            <div>
              <Icon name="alert" size={18} />
              <span><strong>{inactiveCount}</strong> inactive</span>
            </div>
          </div>
        </div>
      </section>

      <main className="container ui-content compact-top">
        <div className="ui-toolbar">
          <label className="ui-search">
            <Icon name="search" size={16} />
            <input
              type="search"
              className="ui-input"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by name or description"
              aria-label="Search disaster categories"
            />
          </label>
          <select
            className="ui-select"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            aria-label="Filter by status"
          >
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <button type="button" className="ui-btn ghost" onClick={loadCategories}>
            <Icon name="refresh" size={15} /> Refresh
          </button>
        </div>

        <div className="ui-grid cols-3">
          <div className="ui-stat-card tone-sky">
            <span className="ui-stat-icon"><Icon name="layers" size={20} /></span>
            <div>
              <span className="ui-stat-value">{categories.length}</span>
              <span className="ui-stat-label">Total categories</span>
            </div>
          </div>
          <div className="ui-stat-card tone-green">
            <span className="ui-stat-icon"><Icon name="check" size={20} /></span>
            <div>
              <span className="ui-stat-value">{activeCount}</span>
              <span className="ui-stat-label">Active</span>
            </div>
          </div>
          <div className="ui-stat-card tone-amber">
            <span className="ui-stat-icon"><Icon name="alert" size={20} /></span>
            <div>
              <span className="ui-stat-value">{inactiveCount}</span>
              <span className="ui-stat-label">Inactive</span>
            </div>
          </div>
        </div>

        <div className="ui-section-head">
          <div>
            <h2>Category directory</h2>
            <p>{filteredCategories.length} of {categories.length} categories shown</p>
          </div>
        </div>

        <div className="ui-card">
          <div className="ui-card-head">
            <h3>Registered categories</h3>
            <span className="ui-badge blue">{filteredCategories.length} listed</span>
          </div>
          <div className="ui-card-body">
            {loading ? (
              <div className="ui-state">
                <div className="ui-spinner" />
                <h3>Loading categories</h3>
                <p>Fetching the latest disaster categories&hellip;</p>
              </div>
            ) : filteredCategories.length === 0 ? (
              <div className="ui-state">
                <div className="state-icon"><Icon name="search" size={24} /></div>
                <h3>No categories found</h3>
                <p>Adjust your filters or create a new disaster category.</p>
                <button type="button" className="ui-btn ghost" onClick={clearFilters}>
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="ui-table-wrap">
                <table className="ui-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Description</th>
                      <th>Status</th>
                      <th>Created</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCategories.map((category) => {
                      const isActive = (category.status || 'active') === 'active';
                      return (
                        <tr key={category._id}>
                          <td><strong>{category.name}</strong></td>
                          <td className="muted">{category.description || '—'}</td>
                          <td>
                            <span className={`ui-badge ${isActive ? 'green' : 'amber'}`}>
                              {isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="muted">{formatDate(category.createdAt)}</td>
                          <td>
                            <div className="ad-table-actions">
                              <button
                                type="button"
                                className="ui-btn ghost sm"
                                onClick={() => openEditor(category)}
                              >
                                <Icon name="edit" size={14} /> Edit
                              </button>
                              <button
                                type="button"
                                className="ui-btn red sm"
                                onClick={() => handleDelete(category)}
                              >
                                <Icon name="trash" size={14} /> Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          <div className="ui-card-foot">
            <small>Disable keeps the category on record; permanent delete cannot be undone.</small>
            <button type="button" className="ui-btn plain sm" onClick={loadCategories}>
              <Icon name="refresh" size={14} /> Refresh list
            </button>
          </div>
        </div>
      </main>

      {editing && (
        <div className="ui-backdrop">
          <div className="ui-modal">
            <form onSubmit={handleSave}>
              <div className="ui-modal-top">
                <div>
                  <span className="eyebrow">Edit Disaster Category</span>
                  <h2>{editing.name}</h2>
                </div>
                <button
                  type="button"
                  className="ui-modal-close"
                  aria-label="Close edit dialog"
                  onClick={() => setEditing(null)}
                >
                  <Icon name="x" size={16} />
                </button>
              </div>
              <div className="ui-modal-body">
                <div className="ui-form-grid">
                  <div className="ui-field">
                    <label className="ui-label" htmlFor="category-name">
                      Category name <span className="req">*</span>
                    </label>
                    <input
                      id="category-name"
                      className="ui-input"
                      type="text"
                      value={editing.name}
                      onChange={(event) => setEditing({ ...editing, name: event.target.value })}
                      required
                    />
                  </div>
                  <div className="ui-field">
                    <label className="ui-label" htmlFor="category-status">Status</label>
                    <select
                      id="category-status"
                      className="ui-select"
                      value={editing.status}
                      onChange={(event) => setEditing({ ...editing, status: event.target.value })}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                    <span className="ui-hint">Inactive categories stay on record.</span>
                  </div>
                  <div className="ui-field full">
                    <label className="ui-label" htmlFor="category-icon">
                      Image / icon path <span className="req">*</span>
                    </label>
                    <input
                      id="category-icon"
                      className="ui-input"
                      type="text"
                      value={editing.imageIcon}
                      onChange={(event) => setEditing({ ...editing, imageIcon: event.target.value })}
                      required
                    />
                  </div>
                  <div className="ui-field full">
                    <label className="ui-label" htmlFor="category-description">
                      Description <span className="req">*</span>
                    </label>
                    <textarea
                      id="category-description"
                      className="ui-textarea"
                      value={editing.description}
                      onChange={(event) => setEditing({ ...editing, description: event.target.value })}
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="ui-modal-foot">
                <small>Changes apply across reports and safety guidance.</small>
                <div>
                  <button
                    type="button"
                    className="ui-btn ghost"
                    onClick={() => setEditing(null)}
                    disabled={saving}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="ui-btn primary" disabled={saving}>
                    <Icon name="check" size={15} /> {saving ? 'Saving...' : 'Save changes'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Categories;
