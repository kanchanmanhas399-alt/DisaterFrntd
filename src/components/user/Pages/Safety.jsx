import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { SafetyAll } from '../../../services/adminServices';
import toast from 'react-hot-toast';
import './Safety.css';

/* ---------------------------------------------------------------- Icons */
const ICONS = {
  droplet: <><path d="M12 3s6 6.2 6 10.2a6 6 0 0 1-12 0C6 9.2 12 3 12 3Z" /></>,
  activity: <><path d="M2 12h4l3-8 5 16 3-8h5" /></>,
  flame: <><path d="M12 22c4 0 7-2.8 7-6.5 0-3.7-2.6-5.8-3.1-8.5-1.9 1-2.9 2.8-2.9 4.5-1.7-1-2.7-2.7-2.7-4.5C8.2 9.5 5 12.3 5 15.5 5 19.2 8 22 12 22Z" /></>,
  mountain: <><path d="m2 20 7-12 4 6 2-3 7 9H2Z" /><path d="m7.5 11 1.5 2 2-1" /></>,
  wind: <><path d="M3 8h11a3 3 0 1 0-3-3" /><path d="M3 12h15a3 3 0 1 1-3 3" /><path d="M3 16h8" /></>,
  storm: <><path d="M6.5 16a4 4 0 0 1 .4-8A5.4 5.4 0 0 1 17 9a3.5 3.5 0 0 1 0 7h-3" /><path d="m12 12-2 4h3l-1 4 4-5h-3l1-3Z" /></>,
  shield: <><path d="M12 2 4 5v6c0 5 3.4 9.2 8 11 4.6-1.8 8-6 8-11V5l-8-3Z" /></>,
  shieldCheck: <><path d="M12 2 4 5v6c0 5 3.4 9.2 8 11 4.6-1.8 8-6 8-11V5l-8-3Z" /><path d="m9 12 2 2 4-4" /></>,
  bag: <><path d="M6 8h12l1 13H5L6 8Z" /><path d="M9 8V5a3 3 0 0 1 6 0v3" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.5 2" /></>,
  alert: <><path d="M12 3 2.5 20h19L12 3Z" /><path d="M12 9v5" /><path d="M12 17.5h.01" /></>,
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
  plus: <><path d="M12 5v14M5 12h14" /></>,
  check: <><path d="m5 12 4 4L19 6" /></>,
  reset: <><path d="M3.5 12a8.5 8.5 0 1 0 2.6-6.1" /><path d="M3 4v5h5" /></>,
  print: <><path d="M6 9V3h12v6" /><path d="M6 18H4.5A2.5 2.5 0 0 1 2 15.5v-4A2.5 2.5 0 0 1 4.5 9h15a2.5 2.5 0 0 1 2.5 2.5v4a2.5 2.5 0 0 1-2.5 2.5H18" /><path d="M6 14h12v7H6z" /></>,
  file: <><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9l-6-6Z" /><path d="M14 3v6h6M8 13h8M8 17h5" /></>,
  zap: <><path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" /></>,
  medical: <><rect x="3" y="7" width="18" height="14" rx="2" /><path d="M9 7V4h6v3M12 11v6M9 14h6" /></>,
  layers: <><path d="m12 3 9 5-9 5-9-5 9-5Z" /><path d="m3 13 9 5 9-5" /></>,
  x: <><path d="M6 6 18 18M18 6 6 18" /></>,
};

const Icon = ({ name, size = 18, className = '' }) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {ICONS[name] || ICONS.shield}
  </svg>
);

/* ---------------------------------------------------------- Categories */
const CATEGORY_RULES = [
  { id: 'water', label: 'Water & Food', icon: 'droplet', tone: 'sky', terms: ['water', 'food', 'canned', 'drinking', 'ration', 'stove', 'cooking', 'cooler'] },
  { id: 'docs', label: 'Documents & Money', icon: 'file', tone: 'violet', terms: ['document', 'identification', 'id', 'cash', 'money', 'record', 'passport', 'insurance', 'contact', 'paper', 'certificate'] },
  { id: 'power', label: 'Light & Power', icon: 'zap', tone: 'amber', terms: ['radio', 'flashlight', 'torch', 'lantern', 'light', 'battery', 'batteries', 'power bank', 'charger', 'matches', 'lighter', 'candle'] },
  { id: 'health', label: 'Health & Hygiene', icon: 'medical', tone: 'rose', terms: ['aid', 'medical', 'medication', 'medicine', 'prescription', 'hygiene', 'sanitizer', 'sanitiser', 'mask', 'soap', 'towel', 'toilet', 'bandage', 'thermometer'] },
  { id: 'gear', label: 'Safety Gear & Tools', icon: 'shield', tone: 'teal', terms: ['glove', 'helmet', 'boot', 'shoe', 'whistle', 'blanket', 'escape', 'tool', 'wrench', 'rope', 'jacket', 'goggles', 'cloth'] },
];

const CATEGORIES = [
  ...CATEGORY_RULES,
  { id: 'other', label: 'Other Essentials', icon: 'layers', tone: 'slate', terms: [] },
];

const hasTerm = (text, term) =>
  new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?=s?\\b)`, 'i').test(text);

const categorize = (text) => {
  const value = String(text || '');
  return CATEGORY_RULES.find((category) => category.terms.some((term) => hasTerm(value, term)))?.id || 'other';
};

const DISASTER_ICONS = {
  flood: 'droplet',
  earthquake: 'activity',
  fire: 'flame',
  landslide: 'mountain',
  cyclone: 'wind',
  storm: 'storm',
};

const PHASES = [
  { key: 'beforePrecautions', label: 'Before', sub: 'Prepare and reduce the risk', icon: 'clock', color: '#17324D', soft: '#edf2f7' },
  { key: 'duringInstructions', label: 'During', sub: 'Act fast, protect lives', icon: 'alert', color: '#C0392B', soft: '#fdecea' },
  { key: 'afterPrecautions', label: 'After', sub: 'Recover and stay safe', icon: 'shieldCheck', color: '#27845A', soft: '#eaf6ef' },
];

/* -------------------------------------------------------------- Storage */
const readStorage = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const writeStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable — checklist still works for this session */
  }
};

const normalize = (text) => String(text || '').trim().toLowerCase();

/* --------------------------------------------------------------- Component */
const Safety = () => {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('Flood');
  const [checked, setChecked] = useState({});
  const [customItems, setCustomItems] = useState({});
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [showAdd, setShowAdd] = useState(false);
  const [draft, setDraft] = useState('');

  const loadGuides = useCallback(() => {
    setLoading(true);
    SafetyAll()
      .then((res) => {
        const data = res.data.data || [];
        setGuides(data);
        setSelectedType((current) =>
          data.some((guide) => guide.disasterType?.toLowerCase() === current.toLowerCase())
            ? current
            : data[0]?.disasterType || current
        );
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || 'Failed to load safety guidelines');
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadGuides();
  }, [loadGuides]);

  const typeKey = normalize(selectedType).replace(/\s+/g, '-');
  const checkedKey = `dg.gobag.checked.${typeKey}`;
  const customKey = `dg.gobag.custom.${typeKey}`;

  useEffect(() => {
    setChecked(readStorage(checkedKey, {}));
    setCustomItems((current) => ({ ...current, [typeKey]: readStorage(customKey, []) }));
    setQuery('');
    setActiveCategory('all');
    setShowAdd(false);
    setDraft('');
  }, [typeKey, checkedKey, customKey]);

  const currentGuide = useMemo(
    () => guides.find((guide) => normalize(guide.disasterType) === normalize(selectedType)) || guides[0],
    [guides, selectedType]
  );

  const items = useMemo(() => {
    const official = (currentGuide?.emergencyChecklist || []).map((text, index) => ({
      id: `official-${index}`,
      key: normalize(text),
      text,
      category: categorize(text),
      custom: false,
    }));
    const personal = (customItems[typeKey] || []).map((entry) => ({
      id: entry.id,
      key: normalize(entry.text),
      text: entry.text,
      category: categorize(entry.text),
      custom: true,
    }));
    return [...official, ...personal];
  }, [currentGuide, customItems, typeKey]);

  const doneCount = items.filter((item) => checked[item.key]).length;
  const progress = items.length ? Math.round((doneCount / items.length) * 100) : 0;

  const filteredItems = useMemo(() => {
    const term = query.trim().toLowerCase();
    return items.filter(
      (item) =>
        (activeCategory === 'all' || item.category === activeCategory) &&
        (!term || item.text.toLowerCase().includes(term))
    );
  }, [items, activeCategory, query]);

  const groups = useMemo(
    () =>
      CATEGORIES.map((category) => {
        const categoryItems = items.filter((item) => item.category === category.id);
        return {
          ...category,
          items: filteredItems.filter((item) => item.category === category.id),
          total: categoryItems.length,
          done: categoryItems.filter((item) => checked[item.key]).length,
        };
      }).filter((category) => category.total > 0),
    [items, filteredItems, checked]
  );

  const toggleCheck = (key) => {
    const next = { ...checked, [key]: !checked[key] };
    setChecked(next);
    writeStorage(checkedKey, next);
  };

  const markAll = () => {
    const next = { ...checked };
    items.forEach((item) => { next[item.key] = true; });
    setChecked(next);
    writeStorage(checkedKey, next);
    toast.success('All items marked as packed');
  };

  const resetChecklist = () => {
    setChecked({});
    writeStorage(checkedKey, {});
    toast.success('Checklist reset');
  };

  const addItem = (event) => {
    event.preventDefault();
    const text = draft.trim();
    if (!text) {
      toast.error('Enter an item to add');
      return;
    }
    if (items.some((item) => item.key === normalize(text))) {
      toast.error('That item is already on your checklist');
      return;
    }
    const next = [...(customItems[typeKey] || []), { id: `custom-${Date.now()}`, text }];
    setCustomItems((current) => ({ ...current, [typeKey]: next }));
    writeStorage(customKey, next);
    setDraft('');
    setShowAdd(false);
    setActiveCategory('all');
    setQuery('');
    toast.success('Item added to your go-bag');
  };

  const removeCustomItem = (item) => {
    const next = (customItems[typeKey] || []).filter((entry) => entry.id !== item.id);
    setCustomItems((current) => ({ ...current, [typeKey]: next }));
    writeStorage(customKey, next);
    const nextChecked = { ...checked };
    delete nextChecked[item.key];
    setChecked(nextChecked);
    writeStorage(checkedKey, nextChecked);
  };

  return (
    <div className="safety-page">
      <section className="safety-hero">
        <div className="container safety-hero-inner">
          <div>
            <span className="safety-eyebrow">Emergency Preparedness &middot; Official Guidance</span>
            <h1>Stay ready. Stay safe.</h1>
            <p>
              Verified disaster protocols and a practical go-bag checklist you can tick off
              as you pack. Choose a hazard below to see exactly what to do and what to carry.
            </p>
          </div>
          <div className="safety-hero-meta">
            <div>
              <Icon name="shieldCheck" size={19} />
              <span><strong>{guides.length || '—'}</strong> verified protocols</span>
            </div>
            <div>
              <Icon name="clock" size={19} />
              <span>Maintained by civil defense</span>
            </div>
          </div>
        </div>
      </section>

      <main className="container safety-content">
        <div className="safety-tabs" role="tablist" aria-label="Disaster type">
          {guides.map((guide) => {
            const active = normalize(guide.disasterType) === normalize(selectedType);
            return (
              <button
                key={guide._id}
                type="button"
                role="tab"
                aria-selected={active}
                className={`safety-tab ${active ? 'active' : ''}`}
                onClick={() => setSelectedType(guide.disasterType)}
              >
                <Icon name={DISASTER_ICONS[normalize(guide.disasterType)] || 'shield'} size={16} />
                {guide.disasterType}
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="safety-state">
            <div className="dg-spinner" />
            <h3>Loading safety guidelines</h3>
            <p>Fetching the latest official preparedness guidance&hellip;</p>
          </div>
        ) : guides.length === 0 ? (
          <div className="safety-state">
            <div className="state-icon"><Icon name="shield" size={24} /></div>
            <h3>No safety guidelines available</h3>
            <p>Check back shortly for updated civil defense guidance.</p>
          </div>
        ) : currentGuide && (
          <>
            <section className="safety-protocol">
              <div className="safety-protocol-top">
                <div>
                  <span className="eyebrow">{currentGuide.disasterType} Emergency Protocol</span>
                  <h2>{currentGuide.title}</h2>
                  <p>{currentGuide.shortIntro}</p>
                </div>
                <span className="dg-verified"><Icon name="shieldCheck" size={14} /> Verified public guidance</span>
              </div>
            </section>

            <section className="safety-phases" aria-label="Emergency phases">
              {PHASES.map((phase) => (
                <article
                  key={phase.key}
                  className="phase-card"
                  style={{ '--phase-color': phase.color, '--phase-soft': phase.soft }}
                >
                  <div className="phase-head">
                    <span className="phase-icon"><Icon name={phase.icon} size={18} /></span>
                    <h3 className="phase-label">{phase.label}</h3>
                  </div>
                  <p className="phase-sub">{phase.sub}</p>
                  {currentGuide[phase.key]?.length > 0 ? (
                    <ol className="phase-list">
                      {currentGuide[phase.key].map((step, index) => (
                        <li key={index}>{step}</li>
                      ))}
                    </ol>
                  ) : (
                    <p className="phase-empty">No specific instructions listed.</p>
                  )}
                </article>
              ))}
            </section>

            <section className="gobag" id="go-bag">
              <div className="gobag-heading">
                <span className="gobag-heading-icon"><Icon name="bag" size={23} /></span>
                <div>
                  <h2>Interactive Emergency Go-Bag Checklist</h2>
                  <p>Tap an item as you pack it. Your progress is saved automatically on this device.</p>
                </div>
                <span className={`dg-status ${progress === 100 ? 'complete' : ''}`}>
                  <Icon name={progress === 100 ? 'check' : 'alert'} size={13} />
                  {progress === 100 ? 'Go-bag ready' : `${items.length - doneCount} left to pack`}
                </span>
              </div>

              <div className="gobag-layout">
                <aside className="gobag-aside">
                  <div
                    className="progress-ring"
                    style={{ '--pct': `${progress}%` }}
                    role="progressbar"
                    aria-valuenow={progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label="Go-bag readiness"
                  >
                    <div className="progress-ring-inner">
                      <strong>{progress}%</strong>
                      <span>Packed</span>
                    </div>
                  </div>
                  <p className="progress-caption">
                    <strong>{doneCount} of {items.length}</strong> items ready for {currentGuide.disasterType.toLowerCase()}
                  </p>

                  <p className="aside-label">Filter by category</p>
                  <div className="filter-list">
                    <button
                      type="button"
                      className={`filter-chip tone-slate ${activeCategory === 'all' ? 'active' : ''}`}
                      onClick={() => setActiveCategory('all')}
                    >
                      <span className="chip-icon"><Icon name="layers" size={14} /></span>
                      All items
                      <span className="chip-count">{items.length}</span>
                    </button>
                    {groups.map((category) => (
                      <button
                        key={category.id}
                        type="button"
                        className={`filter-chip ${category.tone} ${activeCategory === category.id ? 'active' : ''}`}
                        onClick={() => setActiveCategory(category.id)}
                      >
                        <span className="chip-icon"><Icon name={category.icon} size={14} /></span>
                        {category.label}
                        <span className="chip-count">{category.done}/{category.total}</span>
                      </button>
                    ))}
                  </div>

                  <div className="tip-card">
                    <Icon name="alert" size={17} />
                    <p><strong>Emergency hotline</strong>Call <b>112</b> immediately if life is in danger. Keep your phone charged.</p>
                  </div>
                </aside>

                <div className="gobag-main">
                  <div className="gobag-toolbar">
                    <label className="dg-search">
                      <Icon name="search" size={16} />
                      <input
                        type="search"
                        className="dg-input"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Search checklist items…"
                        aria-label="Search checklist items"
                      />
                    </label>
                    <button
                      type="button"
                      className="dg-btn primary"
                      onClick={() => setShowAdd((open) => !open)}
                    >
                      <Icon name="plus" size={15} /> Add item
                    </button>
                    <button type="button" className="dg-btn ghost" onClick={markAll}>
                      <Icon name="check" size={15} /> Check all
                    </button>
                    <button type="button" className="dg-btn ghost" onClick={resetChecklist}>
                      <Icon name="reset" size={15} /> Reset
                    </button>
                    <button
                      type="button"
                      className="dg-btn plain"
                      title="Print checklist"
                      aria-label="Print checklist"
                      onClick={() => window.print()}
                    >
                      <Icon name="print" size={16} />
                    </button>
                  </div>

                  {showAdd && (
                    <form className="gobag-add" onSubmit={addItem}>
                      <input
                        className="dg-input"
                        value={draft}
                        onChange={(event) => setDraft(event.target.value)}
                        placeholder="e.g. Portable phone charger"
                        aria-label="New checklist item"
                        autoFocus
                      />
                      <button type="submit" className="dg-btn red"><Icon name="plus" size={15} /> Add</button>
                      <button
                        type="button"
                        className="dg-btn plain"
                        aria-label="Cancel adding item"
                        onClick={() => { setShowAdd(false); setDraft(''); }}
                      >
                        <Icon name="x" size={16} />
                      </button>
                    </form>
                  )}

                  {groups.length === 0 ? (
                    <div className="gobag-empty">
                      <Icon name="search" size={28} />
                      <p>No checklist items match your search.</p>
                      <button
                        type="button"
                        className="dg-btn ghost"
                        onClick={() => { setQuery(''); setActiveCategory('all'); }}
                      >
                        Clear filters
                      </button>
                    </div>
                  ) : (
                    groups.map((category) => (
                      <div className={`check-group ${category.tone}`} key={category.id}>
                        <div className="check-group-head">
                          <span className="group-icon"><Icon name={category.icon} size={16} /></span>
                          <span className="group-title">{category.label}</span>
                          <span className="group-count">{category.done} / {category.total} packed</span>
                        </div>
                        <div className="group-bar">
                          <span style={{ width: `${(category.done / category.total) * 100}%` }} />
                        </div>
                        <div className="check-list">
                          {category.items.map((item) => {
                            const isChecked = Boolean(checked[item.key]);
                            return (
                              <div
                                key={item.id}
                                role="checkbox"
                                aria-checked={isChecked}
                                tabIndex={0}
                                className={`check-row ${isChecked ? 'checked' : ''}`}
                                onClick={() => toggleCheck(item.key)}
                                onKeyDown={(event) => {
                                  if (event.key === 'Enter' || event.key === ' ') {
                                    event.preventDefault();
                                    toggleCheck(item.key);
                                  }
                                }}
                              >
                                <span className="check-box"><Icon name="check" size={14} /></span>
                                <span className="check-text">
                                  {item.text}
                                  {item.custom && <span className="mini-tag">Added by you</span>}
                                </span>
                                {item.custom && (
                                  <button
                                    type="button"
                                    className="dg-remove"
                                    title="Remove item"
                                    aria-label={`Remove ${item.text}`}
                                    onClick={(event) => { event.stopPropagation(); removeCustomItem(item); }}
                                  >
                                    <Icon name="x" size={14} />
                                  </button>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))
                  )}

                  <div className="gobag-footer">
                    <span><strong>{items.length}</strong> items in this go-bag &middot; saved automatically</span>
                    <span>Tip: review and repack your bag every 6 months.</span>
                  </div>
                </div>
              </div>
            </section>

            {currentGuide.preventiveMeasures?.length > 0 && (
              <section className="safety-mitigation">
                <span className="mitigation-icon"><Icon name="shieldCheck" size={19} /></span>
                <div>
                  <h3>Long-Term Mitigation &amp; Preventive Measures</h3>
                  <ul className="mitigation-list">
                    {currentGuide.preventiveMeasures.map((measure, index) => (
                      <li key={index}>
                        <Icon name="check" size={14} />
                        <span>{measure}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Safety;
