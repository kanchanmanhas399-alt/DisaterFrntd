import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AlertAll } from '../../../services/adminServices';
import toast from 'react-hot-toast';
import Icon from './Icon';
import './citizen-ui.css';

/* ------------------------------------------------------------- Severities */
const SEVERITIES = {
  critical: { label: 'Critical', rank: 0 },
  high: { label: 'High', rank: 1 },
  warning: { label: 'Warning', rank: 1 },
  medium: { label: 'Medium', rank: 2 },
  low: { label: 'Low', rank: 3 },
};

const getSeverity = (value) =>
  SEVERITIES[String(value || 'medium').toLowerCase()] || {
    label: String(value || 'Unrated'),
    rank: 4,
  };

const SEVERITY_FILTERS = [
  { rank: null, label: 'All', tone: '' },
  { rank: 0, label: 'Critical', tone: 'red' },
  { rank: 1, label: 'High', tone: 'amber' },
  { rank: 2, label: 'Medium', tone: 'blue' },
  { rank: 3, label: 'Low', tone: 'green' },
];

const badgeTone = (rank) => {
  if (rank === 0) return 'red';
  if (rank === 1) return 'amber';
  if (rank === 2) return 'blue';
  if (rank === 3) return 'green';
  return '';
};

const badgeClass = (rank) => {
  const tone = badgeTone(rank);
  return tone ? `ui-badge ${tone}` : 'ui-badge';
};

const tileTone = (rank) => {
  if (rank === 0) return 'tone-red';
  if (rank === 1) return 'tone-amber';
  if (rank === 2) return 'tone-sky';
  if (rank === 3) return 'tone-green';
  return 'tone-slate';
};

const DISASTER_ICONS = {
  flood: 'droplet',
  earthquake: 'activity',
  fire: 'flame',
  landslide: 'mountain',
  cyclone: 'wind',
  storm: 'storm',
};

/* ---------------------------------------------------------------- Helpers */
const toDate = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const formatDate = (value) => {
  const date = toDate(value);
  return date ? date.toLocaleString() : 'Not specified';
};

const timeAgo = (value) => {
  const date = toDate(value);
  if (!date) return '';
  const seconds = Math.round((Date.now() - date.getTime()) / 1000);
  const future = seconds < 0;
  const absolute = Math.abs(seconds);
  const units = [[86400, 'day'], [3600, 'hour'], [60, 'minute']];
  for (const [size, label] of units) {
    if (absolute >= size) {
      const amount = Math.floor(absolute / size);
      const text = `${amount} ${label}${amount > 1 ? 's' : ''}`;
      return future ? `in ${text}` : `${text} ago`;
    }
  }
  return future ? 'in a moment' : 'just now';
};

const byDateDesc = (a, b) =>
  (toDate(b.dateTime || b.createdAt)?.getTime() || 0) -
  (toDate(a.dateTime || a.createdAt)?.getTime() || 0);

const normalize = (value) => String(value || '').trim().toLowerCase();

const groupKey = (alert) =>
  [alert.title, alert.affectedArea, alert.description].map(normalize).join('|');

/* --------------------------------------------------------------- Component */
const Alert = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState(null);
  const [typeFilter, setTypeFilter] = useState('');
  const [expanded, setExpanded] = useState({});
  const [selectedAlert, setSelectedAlert] = useState(null);

  const loadAlerts = useCallback(() => {
    setLoading(true);
    // Public user route returns only active alerts.
    AlertAll()
      .then((res) => {
        const raw = res.data.data || [];
        setAlerts(raw.filter((alert) => alert.status === 'Active' || !alert.status));
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || 'Unable to load active disaster alerts');
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadAlerts();
  }, [loadAlerts]);

  useEffect(() => {
    if (!selectedAlert) return undefined;
    const handleKey = (event) => {
      if (event.key === 'Escape') setSelectedAlert(null);
    };
    window.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [selectedAlert]);

  const groups = useMemo(() => {
    const buckets = new Map();
    [...alerts].sort(byDateDesc).forEach((alert) => {
      const key = groupKey(alert);
      if (!buckets.has(key)) buckets.set(key, []);
      buckets.get(key).push(alert);
    });
    return Array.from(buckets.values()).map((items) => ({
      id: items[0]._id,
      latest: items[0],
      updates: items.slice(1),
    }));
  }, [alerts]);

  const filteredGroups = useMemo(() => {
    const term = search.trim().toLowerCase();
    return groups
      .filter(({ latest }) => {
        const matchesSearch =
          !term ||
          [latest.title, latest.disasterType, latest.affectedArea, latest.description]
            .some((value) => normalize(value).includes(term));
        const matchesSeverity =
          severityFilter === null || getSeverity(latest.severity).rank === severityFilter;
        const matchesType = !typeFilter || latest.disasterType === typeFilter;
        return matchesSearch && matchesSeverity && matchesType;
      })
      .sort(
        (a, b) =>
          getSeverity(a.latest.severity).rank - getSeverity(b.latest.severity).rank ||
          byDateDesc(a.latest, b.latest)
      );
  }, [groups, search, severityFilter, typeFilter]);

  const stats = useMemo(
    () => ({
      total: alerts.length,
      critical: alerts.filter((alert) => getSeverity(alert.severity).rank === 0).length,
      high: alerts.filter((alert) => getSeverity(alert.severity).rank === 1).length,
      areas: new Set(alerts.map((alert) => alert.affectedArea).filter(Boolean)).size,
    }),
    [alerts]
  );

  const typeOptions = useMemo(
    () => Array.from(new Set(alerts.map((alert) => alert.disasterType).filter(Boolean))).sort(),
    [alerts]
  );

  const topCritical = useMemo(
    () => alerts.filter((alert) => getSeverity(alert.severity).rank === 0).sort(byDateDesc)[0],
    [alerts]
  );

  const isFiltered = Boolean(search || severityFilter !== null || typeFilter);

  return (
    <div className="cit-page">
      <section className="ui-hero">
        <div className="container ui-hero-inner">
          <div className="ui-hero-copy">
            <span className="ui-eyebrow">Civil Protection &middot; Live Alert Feed</span>
            <h1>Active Disaster Alerts</h1>
            <p>
              Official emergency notices and advisories for affected regions. Review the
              latest guidance, check your area, and follow instructions from local authorities.
            </p>
          </div>
          <div className="ui-hero-meta">
            <div>
              <Icon name="bell" size={19} />
              <span><strong>{stats.total}</strong> active notices</span>
            </div>
            <div>
              <Icon name="clock" size={19} />
              <span>Live status updates</span>
            </div>
          </div>
        </div>
      </section>

      <main className="container ui-content">
        <div className="ui-grid">
          {topCritical && (
            <div
              className="ui-callout red"
              role="button"
              tabIndex={0}
              aria-label={`View details for ${topCritical.title}`}
              onClick={() => setSelectedAlert(topCritical)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  setSelectedAlert(topCritical);
                }
              }}
            >
              <Icon name="alert" size={18} />
              <div>
                <h4>Critical alert in effect &mdash; {topCritical.disasterType}</h4>
                <p>{topCritical.title} &bull; {topCritical.affectedArea}</p>
                <span className="ui-btn plain sm">
                  View details <Icon name="arrowRight" size={14} />
                </span>
              </div>
            </div>
          )}

          <div className="ui-toolbar">
            <label className="ui-search">
              <Icon name="search" size={16} />
              <input
                type="search"
                className="ui-input"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by title, region, hazard, or description…"
                aria-label="Search alerts"
              />
            </label>
            <select
              className="ui-select"
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value)}
              aria-label="Filter by disaster type"
            >
              <option value="">All disaster types</option>
              {typeOptions.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <button
              type="button"
              className={`ui-btn primary ${loading ? 'spinning' : ''}`}
              onClick={loadAlerts}
              disabled={loading}
            >
              <Icon name="refresh" size={15} />
              {loading ? 'Refreshing…' : 'Refresh'}
            </button>
          </div>

          <div className="ui-tabs" role="tablist" aria-label="Filter by severity">
            {SEVERITY_FILTERS.map((filter) => {
              const count =
                filter.rank === null
                  ? alerts.length
                  : alerts.filter((alert) => getSeverity(alert.severity).rank === filter.rank).length;
              return (
                <button
                  key={filter.label}
                  type="button"
                  role="tab"
                  aria-selected={severityFilter === filter.rank}
                  className={`ui-tab ${severityFilter === filter.rank ? 'active' : ''}`}
                  onClick={() => setSeverityFilter(filter.rank)}
                >
                  <span className={filter.tone ? `ui-badge ${filter.tone}` : 'ui-badge'} aria-hidden="true" />
                  {filter.label}
                  <span className="tab-count">{count}</span>
                </button>
              );
            })}
          </div>

          <div className="ui-stat-grid">
            <div className="ui-stat-card">
              <span className="ui-stat-icon tone-sky"><Icon name="bell" size={19} /></span>
              <div>
                <span className="ui-stat-value">{stats.total}</span>
                <span className="ui-stat-label">Active notices</span>
              </div>
            </div>
            <div className="ui-stat-card">
              <span className="ui-stat-icon tone-red"><Icon name="alert" size={19} /></span>
              <div>
                <span className="ui-stat-value">{stats.critical}</span>
                <span className="ui-stat-label">Critical</span>
              </div>
            </div>
            <div className="ui-stat-card">
              <span className="ui-stat-icon tone-amber"><Icon name="flame" size={19} /></span>
              <div>
                <span className="ui-stat-value">{stats.high}</span>
                <span className="ui-stat-label">High priority</span>
              </div>
            </div>
            <div className="ui-stat-card">
              <span className="ui-stat-icon tone-green"><Icon name="mapPin" size={19} /></span>
              <div>
                <span className="ui-stat-value">{stats.areas}</span>
                <span className="ui-stat-label">Affected regions</span>
              </div>
            </div>
          </div>
        </div>

        <p className="ui-hint">
          Showing <strong>{filteredGroups.length}</strong> of {groups.length} active incidents
        </p>

        {loading ? (
          <div className="ui-state">
            <div className="ui-spinner" />
            <h3>Loading active alerts</h3>
            <p>Checking the latest official civil protection notices&hellip;</p>
          </div>
        ) : filteredGroups.length === 0 ? (
          <div className="ui-state">
            <div className="state-icon"><Icon name="search" size={24} /></div>
            <h3>{isFiltered ? 'No alerts match your filters' : 'No active alerts right now'}</h3>
            <p>
              {isFiltered
                ? 'Try a different search term, severity, or disaster type.'
                : 'There are currently no active disaster notices. Check back for updates.'}
            </p>
            {isFiltered && (
              <button
                type="button"
                className="ui-btn ghost"
                onClick={() => { setSearch(''); setSeverityFilter(null); setTypeFilter(''); }}
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="ui-section-head">
              <div>
                <h2>Priority notices &amp; advisories</h2>
              </div>
            </div>
            <div className="ui-grid">
              {filteredGroups.map((group) => {
                const alert = group.latest;
                const severity = getSeverity(alert.severity);
                const isOpen = Boolean(expanded[group.id]);
                return (
                  <div key={group.id}>
                    <article
                      className="ui-card"
                      role="button"
                      tabIndex={0}
                      aria-label={`View details for ${alert.title}`}
                      onClick={() => setSelectedAlert(alert)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault();
                          setSelectedAlert(alert);
                        }
                      }}
                    >
                      <div className="ui-card-head">
                        <span className={`ui-icon-tile ${tileTone(severity.rank)}`}>
                          <Icon name={DISASTER_ICONS[normalize(alert.disasterType)] || 'shield'} size={21} />
                        </span>
                        <div>
                          <h3>{alert.title}</h3>
                          <div className="ui-row-meta">
                            <span><Icon name="layers" size={13} /><b>{alert.disasterType || 'General'}</b></span>
                            <span><Icon name="mapPin" size={13} />{alert.affectedArea || 'All zones'}</span>
                            <span><Icon name="clock" size={13} />{timeAgo(alert.dateTime || alert.createdAt)}</span>
                          </div>
                        </div>
                        <span className={badgeClass(severity.rank)}>{severity.label} severity</span>
                      </div>

                      <div className="ui-card-body">
                        <p>{alert.description}</p>

                        {isOpen && group.updates.length > 0 && (
                          <div className="ui-grid">
                            <p>Earlier updates for this incident</p>
                            {group.updates.map((update) => (
                              <button
                                key={update._id}
                                type="button"
                                className="ui-row"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  setSelectedAlert(update);
                                }}
                              >
                                <Icon name="clock" size={13} />
                                <strong>{formatDate(update.dateTime || update.createdAt)}</strong>
                                <span>&bull; View details</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="ui-card-foot">
                        <span className="ui-btn plain sm">
                          View full details <Icon name="arrowRight" size={14} />
                        </span>
                        <div>
                          {alert.image && (
                            <span className="ui-badge blue">
                              <Icon name="image" size={12} /> Image attached
                            </span>
                          )}
                          {group.updates.length > 0 && (
                            <button
                              type="button"
                              className="ui-btn ghost sm"
                              aria-expanded={isOpen}
                              onClick={(event) => {
                                event.stopPropagation();
                                setExpanded((current) => ({ ...current, [group.id]: !current[group.id] }));
                              }}
                            >
                              {group.updates.length} earlier update{group.updates.length > 1 ? 's' : ''}
                              <Icon name={isOpen ? 'chevronUp' : 'chevronDown'} size={13} />
                            </button>
                          )}
                          <span>Issued {formatDate(alert.dateTime || alert.createdAt)}</span>
                        </div>
                      </div>
                    </article>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </main>

      {selectedAlert && (
        <div
          className="ui-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedAlert(null);
          }}
        >
          <div
            className="ui-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="incident-modal-title"
          >
            <div className={`ui-modal-top ${getSeverity(selectedAlert.severity).rank === 0 ? 'red' : ''}`}>
              <div>
                <span className="eyebrow">Official emergency notice</span>
                <h2 id="incident-modal-title">
                  <Icon name={DISASTER_ICONS[normalize(selectedAlert.disasterType)] || 'shield'} size={19} />{' '}
                  {selectedAlert.title}
                </h2>
              </div>
              <button
                type="button"
                className="ui-modal-close"
                aria-label="Close alert details"
                onClick={() => setSelectedAlert(null)}
              >
                <Icon name="x" size={16} />
              </button>
            </div>

            <div className="ui-modal-body">
              <div className="ui-row-meta">
                <span className={badgeClass(getSeverity(selectedAlert.severity).rank)}>
                  {getSeverity(selectedAlert.severity).label} severity
                </span>
                <span>
                  Issued {formatDate(selectedAlert.dateTime || selectedAlert.createdAt)}
                </span>
              </div>

              <div className="ui-detail-grid">
                <div className="ui-detail-cell">
                  <span>Disaster type</span>
                  <strong>{selectedAlert.disasterType || 'General'}</strong>
                </div>
                <div className="ui-detail-cell">
                  <span>Affected region</span>
                  <strong>{selectedAlert.affectedArea || 'All zones'}</strong>
                </div>
                <div className="ui-detail-cell">
                  <span>Current status</span>
                  <strong>{selectedAlert.status || 'Active'}</strong>
                </div>
                <div className="ui-detail-cell">
                  <span>Last updated</span>
                  <strong>{timeAgo(selectedAlert.updatedAt || selectedAlert.dateTime)}</strong>
                </div>
              </div>

              <div className="ui-callout">
                <Icon name="info" size={17} />
                <div>
                  <h4>Official incident details &amp; guidance</h4>
                  <p>{selectedAlert.description}</p>
                </div>
              </div>

              {selectedAlert.image && (
                <div className="ui-card">
                  <div className="ui-card-body">
                    <img src={selectedAlert.image} alt={selectedAlert.title} width="100%" />
                  </div>
                </div>
              )}

              <div className="ui-callout amber">
                <Icon name="alert" size={17} />
                <p>
                  <strong>Public safety notice:</strong> Follow local emergency broadcast
                  instructions. In case of immediate life-threatening danger, dial{' '}
                  <strong>112</strong> directly.
                </p>
              </div>
            </div>

            <div className="ui-modal-foot">
              <button type="button" className="ui-btn ghost" onClick={() => setSelectedAlert(null)}>
                Back to alerts
              </button>
              <small>DisasterGuard Civil Protection</small>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Alert;
