import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Modal from 'react-modal';
import { ResourceAll, ResourceRequestAdd } from '../../../services/adminServices';
import { getIsLogin } from '../../../services/AuthServices';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Icon from './Icon';
import './citizen-ui.css';

Modal.setAppElement('#root');

const TYPES = [
  { value: 'Shelter', heading: 'Shelters', icon: 'home', tone: 'tone-sky' },
  { value: 'Hospital', heading: 'Hospitals', icon: 'medical', tone: 'tone-rose' },
  { value: 'Rescue Center', heading: 'Rescue units', icon: 'ambulance', tone: 'tone-red' },
  { value: 'Emergency Support Center', heading: 'Emergency support centres', icon: 'shield', tone: 'tone-teal' },
];

const TYPE_VISUALS = Object.fromEntries(
  TYPES.map((type) => [type.value, { icon: type.icon, tone: type.tone }])
);

const visualFor = (type) => TYPE_VISUALS[type] || { icon: 'building', tone: 'tone-slate' };

const readIdentity = () => {
  try {
    const stored = JSON.parse(localStorage.getItem('user')) || {};
    return {
      name: stored.name || localStorage.getItem('name') || '',
      email: stored.email || localStorage.getItem('email') || '',
    };
  } catch {
    return { name: '', email: '' };
  }
};

const isAvailable = (status) => String(status || '').toLowerCase() === 'available';

const statusTag = (status) => {
  const value = String(status || '').toLowerCase();
  if (value === 'available') return 'ui-badge green';
  if (value === 'full') return 'ui-badge amber';
  if (value.includes('closed')) return 'ui-badge red';
  return 'ui-badge';
};

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('');
  const [search, setSearch] = useState('');
  const [availableOnly, setAvailableOnly] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [userName, setUserName] = useState(() => readIdentity().name);
  const [userEmail, setUserEmail] = useState(() => readIdentity().email);
  const [userPhone, setUserPhone] = useState('');
  const [otherDetail, setOtherDetail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const nav = useNavigate();

  const loadResources = useCallback(() => {
    setLoading(true);
    ResourceAll()
      .then((res) => setResources(res.data.data || []))
      .catch((err) => {
        toast.error(err.response?.data?.message || 'Failed to load emergency resources');
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadResources();
  }, [loadResources]);

  const facilities = useMemo(() => {
    const seen = new Map();
    [...resources]
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .forEach((resource) => {
        const key = [resource.name, resource.address, resource.contact].join('|').toLowerCase();
        if (seen.has(key)) {
          seen.get(key).records += 1;
        } else {
          seen.set(key, { ...resource, records: 1 });
        }
      });
    return Array.from(seen.values()).sort(
      (a, b) =>
        Number(isAvailable(b.status)) - Number(isAvailable(a.status)) ||
        String(a.name || '').localeCompare(String(b.name || ''))
    );
  }, [resources]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return facilities.filter((item) => {
      const matchesSearch =
        !term ||
        [item.name, item.address, item.services, item.contact, item.type, item.resourceId]
          .some((value) => String(value || '').toLowerCase().includes(term));
      const matchesType = !typeFilter || item.type === typeFilter;
      const matchesAvailability = !availableOnly || isAvailable(item.status);
      return matchesSearch && matchesType && matchesAvailability;
    });
  }, [facilities, search, typeFilter, availableOnly]);

  const availableCount = facilities.filter((item) => isAvailable(item.status)).length;

  const groups = useMemo(() => {
    const headings = [...TYPES];
    facilities.forEach((item) => {
      if (item.type && !headings.some((group) => group.value === item.type)) {
        headings.push({ value: item.type, heading: `${item.type}s`, ...visualFor(item.type) });
      }
    });
    return headings
      .map((group) => ({ ...group, items: filtered.filter((item) => item.type === group.value) }))
      .filter((group) => group.items.length > 0);
  }, [facilities, filtered]);

  const handleModalSubmit = async (event) => {
    event.preventDefault();
    if (!getIsLogin()) {
      toast.error('Please log in first to record a resource connect request');
      nav('/login');
      return;
    }

    setSubmitting(true);
    try {
      await ResourceRequestAdd({
        resourceId: selectedResource?._id,
        resourceName: selectedResource?.name,
        resourceType: selectedResource?.type || 'Shelter',
        resourceReference: selectedResource?.resourceId || '',
        resourceAddress: selectedResource?.address || selectedResource?.location || '',
        resourceContact: selectedResource?.contact || '',
        userName,
        userEmail,
        userPhone,
        notes: otherDetail
      });
      toast.success(`Request recorded for "${selectedResource?.name}"! You can track status in your Dashboard.`);
      setSelectedResource(null);
      setOtherDetail('');
      setUserPhone('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit request');
    } finally {
      setSubmitting(false);
    }
  };

  const openRow = (item) => setSelectedResource(item);

  const onRowKeyDown = (event, item) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openRow(item);
    }
  };

  return (
    <div className="cit-page">
      <section className="ui-hero">
        <div className="container ui-hero-inner">
          <div className="ui-hero-copy">
            <span className="ui-eyebrow">Public directory</span>
            <h1>Emergency resources</h1>
            <p>
              Shelters, hospitals, rescue units and support centres on record. Check the
              status and call ahead before travelling &mdash; capacity can change without notice.
            </p>
          </div>
          <div className="ui-hero-meta">
            <div>
              <Icon name="phone" size={19} />
              <span><strong>112</strong> for life-threatening emergencies</span>
            </div>
            <div>
              <Icon name="info" size={19} />
              <span>Planning and non-dispatch assistance only</span>
            </div>
          </div>
        </div>
      </section>

      <main className="container ui-content">
        <div className="ui-tabs" role="tablist" aria-label="Resource type">
          <button
            type="button"
            role="tab"
            aria-selected={!typeFilter}
            className={`ui-tab ui-btn ${!typeFilter ? 'active' : ''}`}
            onClick={() => setTypeFilter('')}
          >
            <Icon name="layers" size={16} />
            All types
            <span className="tab-count">{facilities.length}</span>
          </button>
          {TYPES.map((type) => (
            <button
              key={type.value}
              type="button"
              role="tab"
              aria-selected={typeFilter === type.value}
              className={`ui-tab ui-btn ${typeFilter === type.value ? 'active' : ''}`}
              onClick={() => setTypeFilter(type.value)}
            >
              <Icon name={type.icon} size={16} />
              {type.heading}
              <span className="tab-count">
                {facilities.filter((item) => item.type === type.value).length}
              </span>
            </button>
          ))}
        </div>

        <div className="ui-toolbar">
          <label className="ui-search">
            <Icon name="search" size={16} />
            <input
              className="ui-input"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search facility, area, service or phone number"
              aria-label="Search resources"
            />
          </label>
          <label className="ui-btn ghost">
            <input
              type="checkbox"
              checked={availableOnly}
              onChange={(event) => setAvailableOnly(event.target.checked)}
            />
            Accepting only
          </label>
          <button type="button" className="ui-btn ghost" onClick={loadResources} disabled={loading}>
            <Icon name="refresh" size={15} /> Refresh
          </button>
        </div>

        <div className="ui-stat-grid">
          <div className="ui-stat-card">
            <span className="ui-stat-icon tone-slate"><Icon name="layers" size={19} /></span>
            <span>
              <span className="ui-stat-value">{facilities.length}</span>
              <span className="ui-stat-label">Facilities on record</span>
            </span>
          </div>
          <div className="ui-stat-card">
            <span className="ui-stat-icon tone-green"><Icon name="check" size={19} /></span>
            <span>
              <span className="ui-stat-value">{availableCount}</span>
              <span className="ui-stat-label">Accepting</span>
            </span>
          </div>
          <div className="ui-stat-card">
            <span className="ui-stat-icon tone-amber"><Icon name="alert" size={19} /></span>
            <span>
              <span className="ui-stat-value">{facilities.length - availableCount}</span>
              <span className="ui-stat-label">At capacity or closed</span>
            </span>
          </div>
          <div className="ui-stat-card">
            <span className="ui-stat-icon tone-sky"><Icon name="search" size={19} /></span>
            <span>
              <span className="ui-stat-value">{filtered.length}</span>
              <span className="ui-stat-label">Showing now</span>
            </span>
          </div>
        </div>

        {loading ? (
          <div className="ui-state">
            <div className="ui-spinner" />
            <p>Loading the facility directory&hellip;</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="ui-state">
            <div className="state-icon"><Icon name="search" size={24} /></div>
            <h3>No facilities found</h3>
            <p>Adjust the search or clear the type and availability filters.</p>
            <button
              type="button"
              className="ui-btn ghost"
              onClick={() => { setSearch(''); setTypeFilter(''); setAvailableOnly(false); }}
            >
              Clear filters
            </button>
          </div>
        ) : (
          groups.map((group) => {
            const visual = visualFor(group.value);
            return (
              <section className="ui-card" key={group.value}>
                <div className="ui-card-head">
                  <span className={`ui-icon-tile sm ${visual.tone}`}>
                    <Icon name={visual.icon} size={16} />
                  </span>
                  <h2>{group.heading}</h2>
                  <span className="ui-badge blue">{String(group.items.length).padStart(2, '0')} listed</span>
                </div>
                <div className="ui-card-body">
                  {group.items.map((item) => (
                    <div
                      role="button"
                      tabIndex={0}
                      key={item._id}
                      className="ui-row"
                      onClick={() => openRow(item)}
                      onKeyDown={(event) => onRowKeyDown(event, item)}
                    >
                      <span className={`ui-icon-tile sm ${visual.tone}`}>
                        <Icon name={visual.icon} size={15} />
                      </span>
                      <span className="ui-row-main">
                        <span className="ui-row-title">
                          {item.name}
                          {item.records > 1 && (
                            <span className="ui-badge blue">{item.records} records</span>
                          )}
                        </span>
                        <span className="ui-row-meta">
                          <span><Icon name="mapPin" size={13} />{item.address || item.location || 'Address not on record'}</span>
                          <span><Icon name="phone" size={13} />{item.contact || 'No phone listed'}</span>
                        </span>
                        <span className="ui-row-desc">
                          {item.services || item.description || 'General emergency assistance'}
                        </span>
                      </span>
                      <span className="ui-row-side">
                        <span className={statusTag(item.status)}>{item.status || 'Unlisted'}</span>
                        <span className="ui-hint">
                          {item.capacity > 0 ? `Capacity ${item.capacity}` : 'Capacity n/a'}
                        </span>
                        <span className="ui-btn plain sm">
                          Request / details <Icon name="arrowRight" size={13} />
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            );
          })
        )}
      </main>

      <Modal
        isOpen={Boolean(selectedResource)}
        onRequestClose={() => setSelectedResource(null)}
        overlayClassName="ui-backdrop"
        className="ui-modal"
        parentSelector={() => document.querySelector('.cit-page') || document.body}
        contentLabel="Facility request"
      >
        {selectedResource && (
          <>
            <div className="ui-modal-top">
              <div>
                <span className="eyebrow">Request / connect</span>
                <h2>{selectedResource.name}</h2>
              </div>
              <span
                role="button"
                tabIndex={0}
                className="ui-modal-close"
                aria-label="Close"
                onClick={() => setSelectedResource(null)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    setSelectedResource(null);
                  }
                }}
              >
                <Icon name="x" size={16} />
              </span>
            </div>
            <form onSubmit={handleModalSubmit}>
              <div className="ui-modal-body">
                <div className="ui-callout amber">
                  <Icon name="info" size={17} />
                  <p>
                    Send your details to the relief coordinator. This does not reserve a place;
                    confirm by phone before you travel.
                  </p>
                </div>
                <div className="ui-detail-grid">
                  <div className="ui-detail-cell">
                    <span>Reference</span>
                    <strong>{selectedResource.resourceId || '—'}</strong>
                  </div>
                  <div className="ui-detail-cell">
                    <span>Status</span>
                    <strong>{selectedResource.status || 'Unlisted'}</strong>
                  </div>
                  <div className="ui-detail-cell">
                    <span>Address</span>
                    <strong>{selectedResource.address || selectedResource.location || 'Not on record'}</strong>
                  </div>
                  <div className="ui-detail-cell">
                    <span>Direct helpline</span>
                    <strong>{selectedResource.contact || 'Not listed'}</strong>
                  </div>
                </div>
                <div className="ui-form-grid">
                  <div className="ui-field">
                    <label className="ui-label" htmlFor="res-name">Your name</label>
                    <input
                      id="res-name"
                      className="ui-input"
                      value={userName}
                      onChange={(event) => setUserName(event.target.value)}
                      required
                    />
                  </div>
                  <div className="ui-field">
                    <label className="ui-label" htmlFor="res-email">Email address</label>
                    <input
                      id="res-email"
                      className="ui-input"
                      type="email"
                      value={userEmail}
                      onChange={(event) => setUserEmail(event.target.value)}
                      required
                    />
                  </div>
                  <div className="ui-field full">
                    <label className="ui-label" htmlFor="res-phone">Phone number (optional)</label>
                    <input
                      id="res-phone"
                      className="ui-input"
                      type="tel"
                      value={userPhone}
                      onChange={(event) => setUserPhone(event.target.value)}
                      placeholder="e.g. +91 98765 43210"
                    />
                  </div>
                  <div className="ui-field full">
                    <label className="ui-label" htmlFor="res-notes">
                      Anything the coordinator should know
                    </label>
                    <textarea
                      id="res-notes"
                      className="ui-textarea"
                      value={otherDetail}
                      onChange={(event) => setOtherDetail(event.target.value)}
                      placeholder="For example: mobility needs, number of people, time of arrival"
                    />
                  </div>
                </div>
              </div>
              <div className="ui-modal-foot">
                <button type="button" className="ui-btn ghost" onClick={() => setSelectedResource(null)}>
                  Cancel
                </button>
                <button type="submit" className="ui-btn primary" disabled={submitting}>
                  {submitting ? 'Recording...' : 'Record request'}
                </button>
              </div>
            </form>
          </>
        )}
      </Modal>
    </div>
  );
};

export default Resources;
