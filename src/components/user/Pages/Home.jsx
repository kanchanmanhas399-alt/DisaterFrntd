import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertAll } from '../../../services/adminServices';
import Icon from './Icon';
import './citizen-ui.css';

const QUICK_ACTIONS = [
  { number: '01', title: 'Check active notices', text: 'See what is happening in your area right now.', to: '/alerts' },
  { number: '02', title: 'Pack your go-bag', text: 'Work through the checklist for the hazards you face.', to: '/safety' },
  { number: '03', title: 'Locate help', text: 'Find shelters, hospitals and rescue units that are open.', to: '/resources' },
];

const QUICK_VISUALS = [
  { icon: 'bell', tone: 'tone-sky' },
  { icon: 'bag', tone: 'tone-amber' },
  { icon: 'mapPin', tone: 'tone-teal' },
];

const STEPS = [
  {
    number: '01',
    icon: 'bell',
    tone: 'tone-sky',
    title: 'Read the notice',
    text: 'Check the affected area and follow the instructions from local authorities.',
  },
  {
    number: '02',
    icon: 'file',
    tone: 'tone-violet',
    title: 'File a report',
    text: 'Describe what you can see, where it is and how many people are affected.',
  },
  {
    number: '03',
    icon: 'mapPin',
    tone: 'tone-teal',
    title: 'Find assistance',
    text: 'Review the suggested response guidance and contact an open facility.',
  },
];

const HAZARDS = [
  { name: 'Flood', note: 'Move to higher ground; do not drive into standing water.', icon: 'droplet', tone: 'tone-sky', to: '/safety' },
  { name: 'Earthquake', note: 'Drop, cover and hold on until the shaking stops.', icon: 'activity', tone: 'tone-amber', to: '/safety' },
  { name: 'Fire', note: 'Crawl low under smoke and leave by the nearest safe exit.', icon: 'flame', tone: 'tone-rose', to: '/safety' },
  { name: 'Landslide', note: 'Move sideways off the slide path, not uphill or downhill.', icon: 'mountain', tone: 'tone-slate', to: '/safety' },
  { name: 'Cyclone', note: 'Shelter in an interior room away from windows.', icon: 'wind', tone: 'tone-teal', to: '/safety' },
  { name: 'Storm', note: 'Go indoors; avoid lone trees, metal fences and open ground.', icon: 'storm', tone: 'tone-violet', to: '/safety' },
  { name: 'Hospitals & rescue', note: 'Trauma centres, ambulance access and search teams.', icon: 'medical', tone: 'tone-green', to: '/resources' },
  { name: 'SOS beacon', note: 'Send your location when life is in immediate danger.', icon: 'alert', tone: 'tone-red', to: '/sos' },
];

const severityTag = (severity) => {
  const value = String(severity || '').toLowerCase();
  if (value === 'critical') return 'ui-badge red';
  if (value === 'high' || value === 'warning') return 'ui-badge amber';
  return 'ui-badge';
};

const publishedAt = (alert) => {
  const date = new Date(alert.dateTime || alert.createdAt);
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString();
};

const Home = () => {
  const [alerts, setAlerts] = useState([]);

  const fetchAlerts = useCallback(() => {
    AlertAll({ status: 'Active' })
      .then((res) => setAlerts(res.data.data || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  const notices = useMemo(() => {
    const seen = new Set();
    return [...alerts]
      .sort((a, b) => new Date(b.dateTime || b.createdAt) - new Date(a.dateTime || a.createdAt))
      .filter((alert) => {
        const key = [alert.title, alert.affectedArea, alert.description].join('|').toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .slice(0, 4);
  }, [alerts]);

  const leadNotice = notices[0];

  return (
    <div className="cit-page">
      <section className="ui-hero">
        <div className="container ui-hero-inner">
          <div className="ui-hero-copy">
            <span className="ui-eyebrow">Public safety / rapid response</span>
            <h1>Know what's happening. Know what to do.</h1>
            <p>
              Current hazard notices, a way to report an incident, and a directory of
              shelters and rescue services. No searching through separate pages when
              minutes matter.
            </p>
            <div className="ui-hero-actions">
              <Link className="ui-btn red" to="/emergency">
                Report an incident <Icon name="arrowRight" size={15} />
              </Link>
              <Link className="ui-btn ghost" to="/safety">Safety guidance</Link>
              <Link className="ui-btn ghost" to="/sos">
                <Icon name="alert" size={15} /> SOS beacon
              </Link>
            </div>
          </div>
          <div className="ui-hero-meta">
            <div>
              <Icon name="bell" size={19} />
              <span><strong>{alerts.length}</strong> active notices</span>
            </div>
            <div>
              <Icon name="phone" size={19} />
              <span><strong>112</strong> emergency line</span>
            </div>
            <div>
              <Icon name="shield" size={19} />
              <span><strong>6</strong> hazard guides</span>
            </div>
          </div>
        </div>
      </section>

      <main className="container ui-content">
        <div className="ui-grid">
          {leadNotice && (
            <div className="ui-callout red">
              <Icon name="alert" size={18} />
              <div>
                <h4>Latest notice &middot; issued {publishedAt(leadNotice)}</h4>
                <p>
                  <b>{leadNotice.title}</b> &mdash; {leadNotice.affectedArea || 'All zones'} &middot;{' '}
                  {leadNotice.severity || 'Unrated'} severity
                </p>
                <Link className="ui-btn plain sm" to="/alerts">
                  All notices <Icon name="arrowRight" size={13} />
                </Link>
              </div>
            </div>
          )}

        <div className="ui-split">
          <section className="ui-card">
            <div className="ui-card-head">
              <div>
                <h2>Current notices</h2>
                <p>Latest published advisories, newest first</p>
              </div>
              <Link className="ui-btn plain sm" to="/alerts">
                View all alerts <Icon name="arrowRight" size={14} />
              </Link>
            </div>
            <div className="ui-card-body">
              {notices.length === 0 ? (
                <div className="ui-state">
                  <div className="state-icon"><Icon name="bell" size={24} /></div>
                  <h3>No active notices</h3>
                  <p>There is nothing published for the public right now.</p>
                </div>
              ) : (
                notices.map((alert) => (
                  <Link className="ui-row" to="/alerts" key={alert._id}>
                    <span className="ui-row-main">
                      <span className="ui-row-title">{alert.title}</span>
                      <span className="ui-row-meta">
                        <span><Icon name="mapPin" size={13} />{alert.affectedArea || 'All zones'}</span>
                        <span><Icon name="clock" size={13} />{publishedAt(alert)}</span>
                      </span>
                    </span>
                    <span className="ui-row-side">
                      <span className={severityTag(alert.severity)}>{alert.severity || 'Unrated'}</span>
                      <Icon name="chevronRight" size={15} />
                    </span>
                  </Link>
                ))
              )}
            </div>
          </section>

          <aside aria-label="Quick actions">
            <div className="ui-grid">
              <section className="ui-card">
                <div className="ui-card-head">
                  <div>
                    <h2>If you only do three things</h2>
                    <p>Quick actions</p>
                  </div>
                </div>
                <div className="ui-card-body">
                  {QUICK_ACTIONS.map((action, index) => {
                    const visual = QUICK_VISUALS[index];
                    return (
                      <Link className="ui-row" to={action.to} key={action.number}>
                        <span className={`ui-icon-tile sm ${visual.tone}`}>
                          <Icon name={visual.icon} size={15} />
                        </span>
                        <span className="ui-row-main">
                          <span className="ui-row-title">{action.title}</span>
                          <span className="ui-row-desc">{action.text}</span>
                        </span>
                        <Icon name="chevronRight" size={15} />
                      </Link>
                    );
                  })}
                </div>
              </section>
              <div className="ui-callout amber">
                <Icon name="phone" size={16} />
                <p><b>Call 112 first</b> for a life-threatening emergency.</p>
              </div>
            </div>
          </aside>
        </div>
        </div>

        <div className="ui-section-head">
          <div>
            <h2>How to use this service</h2>
            <p>Three steps, from notice to assistance</p>
          </div>
        </div>
        <div className="ui-grid cols-3">
          {STEPS.map((step) => (
            <div key={step.number}>
              <section className="ui-card">
                <div className="ui-card-head">
                  <span className={`ui-icon-tile sm ${step.tone}`}><Icon name={step.icon} size={16} /></span>
                  <h3>{step.title}</h3>
                  <span className="ui-badge blue">{step.number}</span>
                </div>
                <div className="ui-card-body">
                  <p>{step.text}</p>
                </div>
              </section>
            </div>
          ))}
        </div>

        <div className="ui-section-head">
          <div>
            <h2>Hazard guidance index</h2>
            <p>One practical action to remember per hazard</p>
          </div>
          <Link className="ui-btn plain sm" to="/safety">
            Full protocols <Icon name="arrowRight" size={14} />
          </Link>
        </div>
        <div className="ui-grid">
          <section className="ui-card">
            <div className="ui-card-body">
              <div className="ui-grid cols-2">
                {HAZARDS.map((hazard) => (
                  <div key={hazard.name}>
                    <Link className="ui-row" to={hazard.to}>
                      <span className={`ui-icon-tile sm ${hazard.tone}`}>
                        <Icon name={hazard.icon} size={15} />
                      </span>
                      <span className="ui-row-main">
                        <span className="ui-row-title">{hazard.name}</span>
                        <span className="ui-row-desc">{hazard.note}</span>
                      </span>
                      <Icon name="chevronRight" size={14} />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </section>
          <div className="ui-callout">
            <Icon name="info" size={18} />
            <div>
              <p>
                DisasterGuard is a public information and coordination prototype. It does not
                replace emergency services or official instructions from civil authorities.
              </p>
              <Link className="ui-btn primary sm" to="/emergency">
                Submit an incident report <Icon name="arrowRight" size={13} />
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
