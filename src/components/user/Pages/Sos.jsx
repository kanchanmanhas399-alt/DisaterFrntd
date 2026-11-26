import React, { useState, useEffect } from 'react';
import { SubmitSOS, GetMyReports } from '../../../services/EmergencyReport';
import { getIsLogin } from '../../../services/AuthServices';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Icon from './Icon';
import './citizen-ui.css';

const Sos = () => {
  const [emergencyType, setEmergencyType] = useState('Immediate Life Hazard / Trapped');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [affectedPeople, setAffectedPeople] = useState(1);
  const [contactNumber, setContactNumber] = useState('');
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [activeSOS, setActiveSOS] = useState(null);

  const nav = useNavigate();
  const isLoggedIn = getIsLogin();

  const loadActiveSOS = async () => {
    if (isLoggedIn) {
      try {
        const res = await GetMyReports();
        const reports = res.data.data || [];
        const latestSOS = reports.find((r) => r.isSOS && r.status !== 'Resolved' && r.status !== 'Cancelled');
        setActiveSOS(latestSOS || null);
      } catch (err) {}
    }
  };

  useEffect(() => {
    loadActiveSOS();
  }, [isLoggedIn]);

  const detectLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser. Please enter location manually.");
      return;
    }
    setDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation(`GPS Lat: ${pos.coords.latitude.toFixed(5)}, Long: ${pos.coords.longitude.toFixed(5)}`);
        toast.success("Current GPS coordinates retrieved");
        setDetectingLocation(false);
      },
      (err) => {
        toast.error("Unable to access GPS location: " + err.message);
        setDetectingLocation(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleSOSSubmit = async (e) => {
    if (e) e.preventDefault();

    if (!isLoggedIn) {
      toast.error("Please login to log an SOS request in the response system");
      nav("/login");
      return;
    }

    if (!location.trim()) {
      toast.error("Please specify your current location or use GPS coordinates");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        emergencyType,
        location: location.trim(),
        description: description.trim() || `URGENT SOS: ${emergencyType} at ${location}`,
        affectedPeople: Math.max(1, parseInt(affectedPeople, 10) || 1),
        contactNumber: contactNumber.trim() || "See profile contact"
      };

      const res = await SubmitSOS(payload);
      toast.success("SOS Assistance Request Logged! Help request broadcasted to dispatchers.", { duration: 6000 });
      setActiveSOS(res.data.data);
      setDescription('');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to submit SOS";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickSOS = () => {
    if (!location) {
      detectLocation();
      toast("Location requested. Enter your location below and confirm SOS submission.", {
        icon: <Icon name="mapPin" size={16} />
      });
    } else {
      handleSOSSubmit();
    }
  };

  return (
    <div className="cit-page">
      <section className="ui-hero danger">
        <div className="container ui-hero-inner">
          <div className="ui-hero-copy">
            <span className="ui-eyebrow">Emergency Assistance &middot; Priority Response</span>
            <h1>SOS emergency assistance</h1>
            <p>
              If your life is in danger, dial 112 immediately. Use this form to alert
              dispatchers and log your location with the response team.
            </p>
          </div>
          <div className="ui-hero-meta">
            <div>
              <Icon name="phone" size={19} />
              <span>National helpline <strong>112</strong></span>
            </div>
            <div>
              <Icon name="clock" size={19} />
              <span>Dispatch <strong>24/7</strong></span>
            </div>
          </div>
        </div>
      </section>

      <main className="container ui-content">
        <div className="ui-grid">
          <div className="ui-callout red">
            <Icon name="alert" size={20} />
            <div>
              <h4>Immediate threat to life? Call 112.</h4>
              <p>
                Dial 112 directly from your phone. DisasterGuard broadcasts your location
                to responders and logs the incident, but it never replaces an emergency
                phone call when seconds count.
              </p>
            </div>
          </div>
        </div>

        <div className="ui-grid">
          {activeSOS && (
            <div className="ui-card">
              <div className="ui-card-head">
                <div>
                  <span className="ui-badge red">Active SOS #{activeSOS._id?.slice(-6)}</span>
                  <h2>{activeSOS.title}</h2>
                  <p>Logged at: {new Date(activeSOS.createdAt).toLocaleString()}</p>
                </div>
                <span className={`ui-badge ${activeSOS.status === 'Responding' ? 'blue' : activeSOS.status === 'Under Review' ? 'amber' : 'red'}`}>
                  <Icon name="activity" size={13} /> Current status: {activeSOS.status}
                </span>
              </div>

              <div className="ui-card-body">
                <div className="ui-detail-grid">
                  <div className="ui-detail-cell">
                    <span>Reference</span>
                    <strong>#{activeSOS._id?.slice(-6)}</strong>
                  </div>
                  <div className="ui-detail-cell">
                    <span>Logged at</span>
                    <strong>{new Date(activeSOS.createdAt).toLocaleString()}</strong>
                  </div>
                  <div className="ui-detail-cell">
                    <span>Location</span>
                    <strong>{activeSOS.location?.address || "GPS"}</strong>
                  </div>
                  <div className="ui-detail-cell">
                    <span>Status</span>
                    <strong>{activeSOS.status}</strong>
                  </div>
                </div>

                {activeSOS.responseInstructions && (
                  <div className="ui-callout green">
                    <Icon name="clipboard" size={18} />
                    <div>
                      <h4>Administrator response instructions</h4>
                      <p>{activeSOS.responseInstructions}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="ui-card-foot">
                <span className="ui-hint">Keep this reference for follow-up.</span>
                <div className="ui-row-meta">
                  <button type="button" className="ui-btn ghost sm" onClick={loadActiveSOS}>
                    <Icon name="refresh" size={14} /> Refresh SOS status
                  </button>
                  <Link to="/my-reports" className="ui-btn plain sm">
                    <Icon name="arrowRight" size={14} /> View in Report Tracking
                  </Link>
                </div>
              </div>
            </div>
          )}

          <div className="ui-card">
            <div className="ui-card-head">
              <div>
                <span className="ui-eyebrow dark">Critical distress signal</span>
                <h2>Request immediate assistance</h2>
                <p>Press SOS to prepare a high-priority request with your current location.</p>
              </div>
              <span className="ui-badge red">Priority</span>
            </div>
            <div className="ui-card-body">
              <div className="ui-grid cols-2">
                <button
                  type="button"
                  className="ui-btn red block lg"
                  onClick={handleQuickSOS}
                  disabled={submitting}
                >
                  <Icon name="siren" size={22} />
                  {submitting ? "SENDING..." : "SOS"}
                </button>
                <button
                  type="button"
                  className="ui-btn ghost block"
                  onClick={detectLocation}
                  disabled={detectingLocation}
                >
                  <Icon name="crosshair" size={18} />
                  {detectingLocation ? "Acquiring GPS..." : "Auto-detect my GPS coordinates"}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="ui-grid cols-2">
          <div className="ui-card">
            <div className="ui-card-head">
              <div>
                <h2>Verified emergency numbers</h2>
                <p>Call directly when life is in danger.</p>
              </div>
              <span className="ui-badge red"><Icon name="phone" size={13} /> 112</span>
            </div>
            <div className="ui-card-body">
              <div className="ui-detail-grid">
                <div className="ui-detail-cell">
                  <span>All-in-One National Emergency Helpline</span>
                  <strong>112</strong>
                </div>
                <div className="ui-detail-cell">
                  <span>National Disaster Response Force (NDRF)</span>
                  <strong>011-24363260</strong>
                </div>
                <div className="ui-detail-cell">
                  <span>Ambulance / Medical Response</span>
                  <strong>108 / 102</strong>
                </div>
                <div className="ui-detail-cell">
                  <span>Fire Service Helpline</span>
                  <strong>101</strong>
                </div>
              </div>
            </div>
          </div>

          <div className="ui-card">
            <div className="ui-card-head">
              <div>
                <h2>Transmit situation details</h2>
                <p>Give dispatchers the location and hazards you can see.</p>
              </div>
            </div>

            <form onSubmit={handleSOSSubmit}>
              <div className="ui-card-body">
                <div className="ui-form-grid">
                  <div className="ui-field full">
                    <label className="ui-label" htmlFor="sos-type">Emergency Type <span className="req">*</span></label>
                    <select
                      id="sos-type"
                      className="ui-select"
                      value={emergencyType}
                      onChange={(e) => setEmergencyType(e.target.value)}
                      required
                    >
                      <option value="Trapped by Rising Water / Flood">Trapped by Rising Water / Flood</option>
                      <option value="Building Collapse / Structural Debris">Building Collapse / Structural Debris</option>
                      <option value="Severe Fire & Smoke Hazard">Severe Fire & Smoke Hazard</option>
                      <option value="Medical Trauma / Critical Casualty">Medical Trauma / Critical Casualty</option>
                      <option value="Landslide / Mudflow Cut-off">Landslide / Mudflow Cut-off</option>
                      <option value="Immediate Life Hazard">Other Immediate Life Hazard</option>
                    </select>
                  </div>

                  <div className="ui-field full">
                    <label className="ui-label" htmlFor="sos-location">Current Incident Location <span className="req">*</span></label>
                    <div className="ui-grid cols-2">
                      <div className="ui-search">
                        <Icon name="mapPin" size={16} />
                        <input
                          id="sos-location"
                          className="ui-input"
                          type="text"
                          required
                          placeholder="Enter street, landmark, GPS or area"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                        />
                      </div>
                      <button
                        type="button"
                        className="ui-btn ghost"
                        onClick={detectLocation}
                        title="Get GPS location"
                      >
                        <Icon name="crosshair" size={15} /> GPS
                      </button>
                    </div>
                  </div>

                  <div className="ui-field">
                    <label className="ui-label" htmlFor="sos-people">People Needing Help</label>
                    <input
                      id="sos-people"
                      className="ui-input"
                      type="number"
                      min={1}
                      value={affectedPeople}
                      onChange={(e) => setAffectedPeople(e.target.value)}
                      required
                    />
                  </div>

                  <div className="ui-field">
                    <label className="ui-label" htmlFor="sos-contact">Emergency Callback Mobile</label>
                    <input
                      id="sos-contact"
                      className="ui-input"
                      type="tel"
                      placeholder="Mobile number for dispatch"
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value)}
                    />
                  </div>

                  <div className="ui-field full">
                    <label className="ui-label" htmlFor="sos-description">Emergency Description / Immediate Hazards</label>
                    <textarea
                      id="sos-description"
                      className="ui-textarea"
                      rows={3}
                      placeholder="Describe your situation (e.g. 3 people trapped on roof, water 5ft high, power lines down)..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="ui-card-foot">
                <span className="ui-hint">Fields marked * are required.</span>
                <button type="submit" className="ui-btn red" disabled={submitting}>
                  <Icon name="siren" size={16} />
                  {submitting ? "Transmitting SOS..." : "Broadcast Urgent SOS Distress Signal"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Sos;
