import React from 'react';
import { Link } from 'react-router-dom';
import Icon from './Icon';
import './citizen-ui.css';

const CAN = [
  'Show current public notices and the areas they cover',
  'Explain what to do before, during and after common hazards',
  'Collect an incident report and return basic guidance',
  'List shelters, hospitals and rescue units on record',
];

const CANNOT = [
  'Contact emergency services or dispatch responders',
  'Replace instructions from civil authorities',
  'Guarantee a place at any listed facility',
  'Verify every detail in a report before it is published',
];

const FLOW = [
  {
    num: '01',
    icon: 'bell',
    tone: 'tone-sky',
    title: 'Notice is published',
    text: 'An administrator records an active alert with a severity and affected area.',
  },
  {
    num: '02',
    icon: 'shield',
    tone: 'tone-teal',
    title: 'Public reads guidance',
    text: 'Residents check the alert feed and the matching safety protocol.',
  },
  {
    num: '03',
    icon: 'file',
    tone: 'tone-violet',
    title: 'Incident is reported',
    text: 'A person submits what they can see; the system produces initial guidance.',
  },
  {
    num: '04',
    icon: 'mapPin',
    tone: 'tone-green',
    title: 'Facilities are listed',
    text: 'The resource directory shows open shelters, hospitals and rescue units.',
  },
];

const About = () => {
  return (
    <div className="cit-page">
      <section className="ui-hero">
        <div className="container ui-hero-inner">
          <div className="ui-hero-copy">
            <span className="ui-eyebrow">About the service</span>
            <h1>A single place for public hazard information.</h1>
            <p>
              DisasterGuard brings notices, practical safety steps, incident reporting
              and a facility directory into one public register. It is built to make the
              next few minutes easier to navigate.
            </p>
          </div>
          <div className="ui-hero-meta">
            <div>
              <Icon name="info" size={19} />
              <span><strong>Prototype</strong> demonstration platform</span>
            </div>
            <div>
              <Icon name="alert" size={19} />
              <span>Not an official emergency channel</span>
            </div>
          </div>
        </div>
      </section>

      <main className="container ui-content">
        <div className="ui-split">
          <div>
            <section className="ui-card">
              <div className="ui-card-head">
                <div>
                  <span className="ui-eyebrow dark">Why it exists</span>
                  <h2>Information scattered across pages costs time.</h2>
                </div>
              </div>
              <div className="ui-card-body">
                <p>
                  During a flood, storm or landslide, people usually need the same few things:
                  what is happening nearby, what to do right now, and where help is located.
                  Those answers tend to sit in separate places. This service puts them on one
                  public page with plain language and no account needed to read them.
                </p>
                <p>
                  The design is deliberately restrained. Large type, visible rules and a
                  predictable order make the important details easy to find under stress or
                  on a slow connection. There are no auto-playing elements or decorative
                  graphics competing with the notices themselves.
                </p>
              </div>
            </section>

            <section className="ui-card">
              <div className="ui-card-head">
                <div>
                  <span className="ui-eyebrow dark">How it is organised</span>
                  <h2>Four parts, each with one job.</h2>
                </div>
              </div>
              <div className="ui-card-body">
                <p>
                  The <strong>alert feed</strong> carries active notices and earlier updates on
                  the same incident. The <strong>safety section</strong> holds hazard protocols
                  and a go-bag checklist that stays on your device. The <strong>report form</strong>
                  collects what a witness can see and returns initial guidance. The{' '}
                  <strong>resource directory</strong> lists facilities with their status and
                  contact number.
                </p>
                <p>
                  Reports are stored with the details you enter. Only the information needed
                  to produce guidance is asked for, and no personal contact field is required
                  to submit an incident.
                </p>
              </div>
            </section>

            <div className="ui-section-head">
              <div>
                <h2>The path through the service</h2>
                <p>Four steps, from notice to assistance</p>
              </div>
            </div>
            <div className="ui-grid cols-4">
              {FLOW.map((step) => (
                <div key={step.num}>
                  <section className="ui-card">
                    <div className="ui-card-head">
                      <span className={`ui-icon-tile sm ${step.tone}`}>
                        <Icon name={step.icon} size={16} />
                      </span>
                      <h3>{step.title}</h3>
                      <span className="ui-badge blue">{step.num}</span>
                    </div>
                    <div className="ui-card-body">
                      <p>{step.text}</p>
                    </div>
                  </section>
                </div>
              ))}
            </div>

            <div className="ui-grid">
              <div className="ui-callout">
                <Icon name="info" size={18} />
                <p>DisasterGuard / public information prototype &middot; Emergency line: 112</p>
              </div>
            </div>
          </div>

          <aside aria-label="Scope of the service">
            <section className="ui-card">
              <div className="ui-card-head">
                <div>
                  <span className="ui-eyebrow dark">What this service does</span>
                  <h3>Within its scope</h3>
                </div>
              </div>
              <div className="ui-card-body">
                <ul className="ui-check-list">
                  {CAN.map((item) => (
                    <li key={item}>
                      <Icon name="check" size={15} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <section className="ui-card">
              <div className="ui-card-head">
                <div>
                  <span className="ui-eyebrow dark">What it does not do</span>
                  <h3>Known limits</h3>
                </div>
              </div>
              <div className="ui-card-body">
                <ul className="ui-list tone-rose">
                  {CANNOT.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </section>

            <section className="ui-card">
              <div className="ui-card-head">
                <div>
                  <span className="ui-eyebrow dark">In an actual emergency</span>
                  <h3>Call first, check second.</h3>
                </div>
              </div>
              <div className="ui-card-body">
                <div className="ui-grid">
                  <div className="ui-callout red">
                    <Icon name="phone" size={17} />
                    <p>Dial 112 for a life-threatening situation. Do not wait for this site to update.</p>
                  </div>
                  <div className="ui-callout green">
                    <Icon name="shield" size={17} />
                    <p>Follow instructions from local authorities over anything shown here.</p>
                  </div>
                </div>
              </div>
              <div className="ui-card-foot">
                <Link className="ui-btn primary sm" to="/alerts">View active notices</Link>
                <Link className="ui-btn ghost sm" to="/safety">Safety guidance</Link>
              </div>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default About;
