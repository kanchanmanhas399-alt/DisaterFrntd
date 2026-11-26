import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import toast from 'react-hot-toast';
import { RecipientAll, RecipientAdd, RecipientUpdate, RecipientDelete } from '../../../services/adminServices';
import '../admin-ui.css';

if (typeof document !== 'undefined') {
  Modal.setAppElement('#root');
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const MODAL_STYLES = {
  overlay: {
    backgroundColor: 'rgba(16, 37, 58, 0.55)',
    zIndex: 1050,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px',
  },
  content: {
    position: 'static',
    inset: 'auto',
    width: '100%',
    maxWidth: '460px',
    borderRadius: '14px',
    border: '1px solid #e2e8ee',
    padding: '24px',
    boxShadow: '0 20px 45px rgba(16, 37, 58, 0.22)',
  },
};

export default function DisasterEmailRecipients() {
  const [items, setItems] = useState([]);
  const [email, setEmail] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [editEmail, setEditEmail] = useState('');
  const [deletingItem, setDeletingItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await RecipientAll();
      setItems(res.data.data || []);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Unable to load email recipients');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleAdd = async (event) => {
    event.preventDefault();
    const normalized = email.trim().toLowerCase();
    if (!EMAIL_REGEX.test(normalized)) {
      toast.error('Enter a valid email address');
      return;
    }
    setSaving(true);
    try {
      const res = await RecipientAdd({ email: normalized });
      toast.success(res.data.message || 'Recipient added');
      setEmail('');
      await load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Unable to add recipient');
    } finally {
      setSaving(false);
    }
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setEditEmail(item.email || '');
  };

  const closeEditModal = () => {
    if (updating) return;
    setEditingItem(null);
    setEditEmail('');
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    if (!editingItem) return;
    const normalized = editEmail.trim().toLowerCase();
    if (!EMAIL_REGEX.test(normalized)) {
      toast.error('Enter a valid email address');
      return;
    }
    setUpdating(true);
    try {
      const res = await RecipientUpdate(editingItem._id, { email: normalized });
      toast.success(res.data.message || 'Recipient updated');
      setEditingItem(null);
      setEditEmail('');
      await load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Unable to update recipient');
    } finally {
      setUpdating(false);
    }
  };

  const openDeleteModal = (item) => {
    setDeletingItem(item);
  };

  const closeDeleteModal = () => {
    if (deletingId) return;
    setDeletingItem(null);
  };

  const confirmDelete = async () => {
    if (!deletingItem) return;
    setDeletingId(deletingItem._id);
    try {
      const res = await RecipientDelete(deletingItem._id);
      toast.success(res.data.message || 'Recipient deleted');
      setDeletingItem(null);
      await load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Unable to delete recipient');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <span className="ui-eyebrow dark">Notification settings</span>
          <h1 className="h3 mb-1">Disaster Email Recipients</h1>
          <p className="text-muted mb-0">Manage the addresses notified when a citizen submits a disaster report.</p>
        </div>
      </div>

      <section className="ui-card mb-4">
        <div className="ui-card-head">
          <h2 className="h5 mb-0">Add email recipient</h2>
        </div>
        <div className="ui-card-body">
          <form className="row g-3 align-items-end" onSubmit={handleAdd}>
            <div className="col-12 col-md-8">
              <label className="form-label" htmlFor="recipient-email">Email address</label>
              <input
                id="recipient-email"
                className="form-control"
                type="email"
                required
                maxLength={254}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
              />
            </div>
            <div className="col-12 col-md-4 d-flex gap-2">
              <button className="btn btn-primary" type="submit" disabled={saving}>
                {saving ? 'Adding…' : 'Add Email'}
              </button>
            </div>
          </form>
        </div>
      </section>

      <section className="ui-card">
        <div className="ui-card-head d-flex justify-content-between align-items-center">
          <h2 className="h5 mb-0">Configured recipients</h2>
          <span className="badge text-bg-secondary">{items.length}</span>
        </div>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead>
              <tr>
                <th>Email address</th>
                <th>Added</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="3" className="text-center py-4">Loading recipients…</td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center text-muted py-4">No email recipients configured yet.</td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item._id}>
                    <td className="fw-semibold">{item.email}</td>
                    <td>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '—'}</td>
                    <td className="text-end">
                      <div className="d-inline-flex align-items-center gap-2">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => openEditModal(item)}
                          type="button"
                          disabled={deletingId === item._id}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => openDeleteModal(item)}
                          type="button"
                          disabled={deletingId === item._id}
                        >
                          {deletingId === item._id ? 'Deleting…' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <Modal
        isOpen={Boolean(editingItem)}
        onRequestClose={closeEditModal}
        style={MODAL_STYLES}
        contentLabel="Edit Email Recipient"
      >
        <h2 className="h5 mb-2">Edit Email Recipient</h2>
        <p className="text-muted small mb-3">Update the email address that receives disaster alert notifications.</p>
        <form onSubmit={handleUpdate}>
          <div className="mb-4">
            <label className="form-label" htmlFor="edit-recipient-email">Email address</label>
            <input
              id="edit-recipient-email"
              className="form-control"
              type="email"
              required
              maxLength={254}
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
              placeholder="name@example.com"
              autoFocus
            />
          </div>
          <div className="d-flex justify-content-end gap-3">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={closeEditModal}
              disabled={updating}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={updating}
            >
              {updating ? 'Updating…' : 'Update Email'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={Boolean(deletingItem)}
        onRequestClose={closeDeleteModal}
        style={MODAL_STYLES}
        contentLabel="Delete Email Recipient"
      >
        <h2 className="h5 mb-2">Delete Email Recipient</h2>
        <p className="text-muted mb-4">
          Are you sure you want to remove <strong>{deletingItem?.email}</strong> from disaster alert notifications?
        </p>
        <div className="d-flex justify-content-end gap-3">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={closeDeleteModal}
            disabled={Boolean(deletingId)}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={confirmDelete}
            disabled={Boolean(deletingId)}
          >
            {deletingId ? 'Deleting…' : 'Delete Email'}
          </button>
        </div>
      </Modal>
    </div>
  );
}
