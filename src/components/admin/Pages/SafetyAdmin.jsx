import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import Icon from '../../user/Pages/Icon';
import { UploadImage } from '../../../services/EmergencyReport';
import { BASEURL } from '../../../endpoints';
import {
  SafetyAdminGetAll,
  SafetyAdminAdd,
  SafetyAdminUpdate,
  SafetyAdminRemove,
  SafetyAdminSingle
} from '../../../services/adminServices';

const SafetyAdmin = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGuide, setEditingGuide] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [guideToDelete, setGuideToDelete] = useState(null);

  // Form states
  const [disasterType, setDisasterType] = useState('Flood');
  const [title, setTitle] = useState('');
  const [shortIntro, setShortIntro] = useState('');
  const [beforePrecautions, setBeforePrecautions] = useState('');
  const [duringInstructions, setDuringInstructions] = useState('');
  const [afterPrecautions, setAfterPrecautions] = useState('');
  const [emergencyChecklist, setEmergencyChecklist] = useState('');
  const [preventiveMeasures, setPreventiveMeasures] = useState('');
  const [isPublished, setIsPublished] = useState(true);
  const [image, setImage] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const loadGuides = useCallback(() => {
    setLoading(true);
    SafetyAdminGetAll()
      .then((res) => {
        setGuides(res.data.data || []);
      })
      .catch((err) => toast.error(err.response?.data?.message || "Failed to load safety guidelines"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadGuides();
  }, [loadGuides]);

  useEffect(() => {
    if (id) {
      openEditModal({ _id: id });
    } else if (location.pathname.endsWith('/add')) {
      openAddModal();
    }
  }, [id, location.pathname]);

  const openAddModal = () => {
    setEditingGuide(null);
    setDisasterType('Flood');
    setTitle('');
    setShortIntro('');
    setBeforePrecautions('');
    setDuringInstructions('');
    setAfterPrecautions('');
    setEmergencyChecklist('');
    setPreventiveMeasures('');
    setIsPublished(true);
    setImage('');
    setImageFile(null);
    setIsModalOpen(true);
  };

  const openEditModal = async (guide) => {
    try {
      const response = await SafetyAdminSingle(guide._id);
      const current = response.data.data;
      if (!current) throw new Error("Guideline not found");
      setEditingGuide(current);
      setDisasterType(current.disasterType || 'Flood');
      setTitle(current.title || '');
      setShortIntro(current.shortIntro || '');
      setBeforePrecautions(current.beforePrecautions?.join('\n') || '');
      setDuringInstructions(current.duringInstructions?.join('\n') || '');
      setAfterPrecautions(current.afterPrecautions?.join('\n') || '');
      setEmergencyChecklist(current.emergencyChecklist?.join('\n') || '');
      setPreventiveMeasures(current.preventiveMeasures?.join('\n') || '');
      setIsPublished(current.isPublished !== undefined ? current.isPublished : true);
      setImage(current.image || '');
      setImageFile(null);
      setIsModalOpen(true);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Failed to load guideline");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (saving) return;
    setSaving(true);

    let imageUrl = image;
    try {
      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);
        const uploadResponse = await UploadImage(formData);
        imageUrl = uploadResponse.data.url?.startsWith("http")
          ? uploadResponse.data.url
          : `${BASEURL.replace(/\/$/, "")}${uploadResponse.data.url}`;
      }
    } catch (uploadError) {
      toast.error(uploadError.response?.data?.message || "Guideline image upload failed");
      setSaving(false);
      return;
    }

    const payload = {
      disasterType,
      title,
      shortIntro,
      beforePrecautions: beforePrecautions.split('\n').map(s => s.trim()).filter(Boolean),
      duringInstructions: duringInstructions.split('\n').map(s => s.trim()).filter(Boolean),
      afterPrecautions: afterPrecautions.split('\n').map(s => s.trim()).filter(Boolean),
      emergencyChecklist: emergencyChecklist.split('\n').map(s => s.trim()).filter(Boolean),
      preventiveMeasures: preventiveMeasures.split('\n').map(s => s.trim()).filter(Boolean),
      image: imageUrl,
      isPublished
    };

    try {
      if (editingGuide) {
        payload._id = editingGuide._id;
        const response = await SafetyAdminUpdate(payload);
        toast.success(response.data.message || "Safety guideline updated successfully");
      } else {
        const response = await SafetyAdminAdd(payload);
        toast.success(response.data.message || "Safety guideline published successfully");
      }
      setIsModalOpen(false);
      if (id || location.pathname.endsWith('/add')) {
        navigate('/admin/safety');
      } else {
        await loadGuides();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save safety guideline");
    } finally {
      setSaving(false);
    }
  };

  const togglePublish = (guide) => {
    SafetyAdminUpdate({ _id: guide._id, isPublished: !guide.isPublished })
      .then(() => {
        toast.success(`Guideline ${guide.isPublished ? 'Unpublished' : 'Published'}`);
        loadGuides();
      })
      .catch((err) => toast.error(err.response?.data?.message || "Failed to update publish state"));
  };

  const confirmDelete = () => {
    if (!guideToDelete) return;
    SafetyAdminRemove(guideToDelete._id)
      .then(() => {
        toast.success("Safety guideline deleted");
        setIsDeleteOpen(false);
        setGuideToDelete(null);
        loadGuides();
      })
      .catch((err) => toast.error(err.response?.data?.message || "Failed to delete guideline"));
  };

  const publishedCount = guides.filter((guide) => guide.isPublished).length;
  const draftCount = guides.length - publishedCount;
  const checklistCount = guides.reduce((total, guide) => total + (guide.emergencyChecklist?.length || 0), 0);

  return (
    <>
      <section className="ui-hero compact">
        <div className="container ui-hero-inner">
          <div className="ui-hero-copy">
            <span className="ui-eyebrow">Operations &middot; Public guidance</span>
            <h1>Safety guidelines</h1>
            <p>Maintain verified hazard instructions, checklists and precautions for the public portal.</p>
            <div className="ui-hero-actions">
              <Link to="/admin/safety/add" className="ui-btn red">
                <Icon name="plus" size={16} /> Add guideline
              </Link>
              <button type="button" className="ui-btn ghost" onClick={loadGuides}>
                <Icon name="refresh" size={16} /> Refresh
              </button>
            </div>
          </div>
          <div className="ui-hero-meta">
            <div>
              <Icon name="shield" size={18} />
              <span><strong>{guides.length || '—'}</strong> guidelines</span>
            </div>
            <div>
              <Icon name="check" size={18} />
              <span><strong>{publishedCount}</strong> published</span>
            </div>
          </div>
        </div>
      </section>

      <main className="container ui-content compact-top">
        <div className="ui-stat-grid">
          <div className="ui-stat-card tone-slate">
            <div className="ui-stat-icon"><Icon name="shield" size={20} /></div>
            <div>
              <span className="ui-stat-value">{guides.length}</span>
              <span className="ui-stat-label">Total guidelines</span>
            </div>
          </div>
          <div className="ui-stat-card tone-green">
            <div className="ui-stat-icon"><Icon name="check" size={20} /></div>
            <div>
              <span className="ui-stat-value">{publishedCount}</span>
              <span className="ui-stat-label">Published</span>
            </div>
          </div>
          <div className="ui-stat-card tone-amber">
            <div className="ui-stat-icon"><Icon name="file" size={20} /></div>
            <div>
              <span className="ui-stat-value">{draftCount}</span>
              <span className="ui-stat-label">Drafts</span>
            </div>
          </div>
          <div className="ui-stat-card tone-sky">
            <div className="ui-stat-icon"><Icon name="clipboard" size={20} /></div>
            <div>
              <span className="ui-stat-value">{checklistCount}</span>
              <span className="ui-stat-label">Checklist items</span>
            </div>
          </div>
        </div>

        <div className="ui-card">
          <div className="ui-card-head">
            <div>
              <h2>Guideline library</h2>
              <p>Review, publish and maintain hazard-specific instructions.</p>
            </div>
            <span className="ui-badge">{guides.length} guidelines</span>
          </div>
          <div className="ui-card-body">
            {loading ? (
              <div className="ui-state">
                <div className="ui-spinner" />
                <h3>Loading safety guidelines</h3>
                <p>Fetching the latest official guidance...</p>
              </div>
            ) : guides.length === 0 ? (
              <div className="ui-state">
                <div className="state-icon"><Icon name="shield" size={24} /></div>
                <h3>No guidelines found</h3>
                <p>Add a guideline to publish hazard instructions.</p>
                <Link to="/admin/safety/add" className="ui-btn red">
                  <Icon name="plus" size={16} /> Add guideline
                </Link>
              </div>
            ) : (
              <div className="ui-table-wrap">
                <table className="ui-table">
                  <thead>
                    <tr>
                      <th>Disaster Type</th>
                      <th>Guideline Title</th>
                      <th>Precautions Count</th>
                      <th>Checklist Items</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {guides.map((item) => (
                      <tr key={item._id}>
                        <td><strong>{item.disasterType}</strong></td>
                        <td>{item.title}</td>
                        <td>
                          {(item.beforePrecautions?.length || 0) + (item.duringInstructions?.length || 0) + (item.afterPrecautions?.length || 0)} instructions
                        </td>
                        <td>{item.emergencyChecklist?.length || 0} items</td>
                        <td>
                          <span className={`ui-badge ${item.isPublished ? 'green' : 'amber'}`}>
                            {item.isPublished ? 'Published' : 'Draft / Unpublished'}
                          </span>
                        </td>
                        <td>
                          <div className="ad-table-actions">
                            <button
                              type="button"
                              className="ui-btn sm ghost"
                              onClick={() => togglePublish(item)}
                            >
                              {item.isPublished ? 'Unpublish' : 'Publish'}
                            </button>
                            <Link
                              to={`/admin/safety/edit/${item._id}`}
                              className="ui-btn sm ghost"
                              title="Edit"
                              aria-label={`Edit ${item.disasterType} guideline`}
                            >
                              <Icon name="edit" size={14} />
                            </Link>
                            <button
                              type="button"
                              className="ui-btn sm red"
                              onClick={() => {
                                setGuideToDelete(item);
                                setIsDeleteOpen(true);
                              }}
                              title="Delete"
                              aria-label={`Delete ${item.disasterType} guideline`}
                            >
                              <Icon name="trash" size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Add / Edit Modal */}
        {isModalOpen && (
          <div className="ui-backdrop">
            <div className="ui-modal" role="dialog" aria-modal="true" aria-labelledby="safety-modal-title">
              <div className="ui-modal-top">
                <div>
                  <span className="eyebrow">Guideline editor</span>
                  <h2 id="safety-modal-title">{editingGuide ? "Edit safety guideline" : "Add safety guideline"}</h2>
                </div>
                <button
                  type="button"
                  className="ui-modal-close"
                  aria-label="Close"
                  onClick={() => (id || location.pathname.endsWith('/add')) ? navigate('/admin/safety') : setIsModalOpen(false)}
                >
                  <Icon name="x" size={16} />
                </button>
              </div>
              <form onSubmit={handleSave}>
                <div className="ui-modal-body">
                  <div className="ui-callout">
                    <Icon name="info" size={18} />
                    <div>
                      <h4>Instruction format</h4>
                      <p>Enter one instruction or checklist item per line. Empty lines are ignored.</p>
                    </div>
                  </div>
                  <div className="ui-form-grid">
                    <div className="ui-field">
                      <label className="ui-label" htmlFor="guide-type">Disaster Type <span className="req">*</span></label>
                      <select id="guide-type" className="ui-select" value={disasterType} onChange={(e) => setDisasterType(e.target.value)} required>
                        <option value="Flood">Flood</option>
                        <option value="Earthquake">Earthquake</option>
                        <option value="Fire">Fire</option>
                        <option value="Landslide">Landslide</option>
                        <option value="Cyclone">Cyclone</option>
                        <option value="Storm">Storm</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="ui-field">
                      <label className="ui-label" htmlFor="guide-title">Guideline Title <span className="req">*</span></label>
                      <input
                        id="guide-title"
                        type="text"
                        required
                        className="ui-input"
                        placeholder="e.g. Flood Safety & Preparedness Guidelines"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </div>
                    <div className="ui-field full">
                      <label className="ui-label" htmlFor="guide-intro">Short Introduction / Context</label>
                      <textarea
                        id="guide-intro"
                        rows={2}
                        className="ui-textarea"
                        placeholder="Summary of hazard characteristics..."
                        value={shortIntro}
                        onChange={(e) => setShortIntro(e.target.value)}
                      />
                    </div>
                    <div className="ui-field full">
                      <label className="ui-label" htmlFor="guide-before">Before Disaster Precautions</label>
                      <textarea
                        id="guide-before"
                        rows={3}
                        className="ui-textarea"
                        placeholder={'Keep emergency kit ready\nTurn off main valves'}
                        value={beforePrecautions}
                        onChange={(e) => setBeforePrecautions(e.target.value)}
                      />
                      <span className="ui-hint">One precaution per line.</span>
                    </div>
                    <div className="ui-field full">
                      <label className="ui-label" htmlFor="guide-during">During Disaster Instructions</label>
                      <textarea
                        id="guide-during"
                        rows={3}
                        className="ui-textarea"
                        placeholder={'Move to higher ground\nNever walk or drive in water'}
                        value={duringInstructions}
                        onChange={(e) => setDuringInstructions(e.target.value)}
                      />
                      <span className="ui-hint">One instruction per line.</span>
                    </div>
                    <div className="ui-field full">
                      <label className="ui-label" htmlFor="guide-after">After Disaster Precautions</label>
                      <textarea
                        id="guide-after"
                        rows={3}
                        className="ui-textarea"
                        placeholder={'Boil tap water\nWait for official clearance'}
                        value={afterPrecautions}
                        onChange={(e) => setAfterPrecautions(e.target.value)}
                      />
                      <span className="ui-hint">One precaution per line.</span>
                    </div>
                    <div className="ui-field full">
                      <label className="ui-label" htmlFor="guide-checklist">Emergency Checklist Items</label>
                      <textarea
                        id="guide-checklist"
                        rows={3}
                        className="ui-textarea"
                        placeholder={'3-day water supply\nWaterproof document pouch\nFlashlight'}
                        value={emergencyChecklist}
                        onChange={(e) => setEmergencyChecklist(e.target.value)}
                      />
                      <span className="ui-hint">One item per line.</span>
                    </div>
                    <div className="ui-field full">
                      <label className="ui-label" htmlFor="guide-measures">Preventive Measures</label>
                      <textarea
                        id="guide-measures"
                        rows={2}
                        className="ui-textarea"
                        placeholder="Clear community storm drains"
                        value={preventiveMeasures}
                        onChange={(e) => setPreventiveMeasures(e.target.value)}
                      />
                      <span className="ui-hint">One measure per line.</span>
                    </div>
                    <div className="ui-field full">
                      <label className="ui-label" htmlFor="guide-image">Optional Guideline Image</label>
                      <input
                        id="guide-image"
                        type="file"
                        accept="image/*"
                        className="ui-input"
                        onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                      />
                      {image && <span className="ui-hint">Current image saved. Select a new file to replace it.</span>}
                      {imageFile && <span className="ui-hint">Selected: {imageFile.name}</span>}
                    </div>
                    <div className="ui-field full">
                      <label className="ui-label" htmlFor="isPub">Publish to public portal immediately</label>
                      <input
                        id="isPub"
                        type="checkbox"
                        checked={isPublished}
                        onChange={(e) => setIsPublished(e.target.checked)}
                      />
                      <span className="ui-hint">Published guidelines appear on the citizen safety page.</span>
                    </div>
                  </div>
                </div>
                <div className="ui-modal-foot">
                  <small>Fields marked * are required.</small>
                  <div>
                    <button
                      type="button"
                      className="ui-btn ghost"
                      onClick={() => (id || location.pathname.endsWith('/add')) ? navigate('/admin/safety') : setIsModalOpen(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className={`ui-btn red ${saving ? 'spinning' : ''}`} disabled={saving}>
                      <Icon name="check" size={16} />
                      {saving ? "Saving..." : editingGuide ? "Update Guideline" : "Save Guideline"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {isDeleteOpen && (
          <div className="ui-backdrop">
            <div className="ui-modal" role="alertdialog" aria-modal="true" aria-labelledby="delete-guide-title">
              <div className="ui-modal-top red">
                <div>
                  <span className="eyebrow">Confirm deletion</span>
                  <h2 id="delete-guide-title">Delete safety guideline</h2>
                </div>
                <button
                  type="button"
                  className="ui-modal-close"
                  aria-label="Close"
                  onClick={() => setIsDeleteOpen(false)}
                >
                  <Icon name="x" size={16} />
                </button>
              </div>
              <div className="ui-modal-body">
                <div className="ui-callout red">
                  <Icon name="alert" size={18} />
                  <div>
                    <h4>This cannot be undone</h4>
                    <p>Delete guidelines for <strong>{guideToDelete?.disasterType}</strong>?</p>
                  </div>
                </div>
              </div>
              <div className="ui-modal-foot">
                <small>Removes the guideline from the public portal.</small>
                <div>
                  <button type="button" className="ui-btn ghost" onClick={() => setIsDeleteOpen(false)}>
                    Cancel
                  </button>
                  <button type="button" className="ui-btn red" onClick={confirmDelete}>
                    <Icon name="trash" size={16} /> Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default SafetyAdmin;
