import React, { useState } from 'react';
import { CustomerAdd } from "../../../services/CustomerServices";
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Icon from './Icon';
import './citizen-ui.css';

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const nav = useNavigate();

  function handleForm(e) {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSubmitting(true);
    let payload = {
      name: name.trim(),
      email: email.trim(),
      password: password,
      phone: phone ? Number(phone) : undefined,
      userType: "citizen"
    };

    CustomerAdd(payload)
      .then((res) => {
        toast.success(res.data.message || "Account created successfully! Please login.");
        setTimeout(() => {
          nav("/login");
        }, 1200);
      })
      .catch((err) => {
        const errorMessage = err.response?.data?.message || err.message || "Registration failed";
        toast.error(errorMessage);
      })
      .finally(() => {
        setSubmitting(false);
      });
  }

  return (
    <div className="cit-page">
      <section className="ui-hero">
        <div className="container ui-hero-inner">
          <div className="ui-hero-copy">
            <span className="ui-eyebrow">Citizen Registration</span>
            <h1>Create your account</h1>
            <p>
              Register to submit emergency reports, receive local alerts and track the
              status of every request in one place.
            </p>
            <div className="ui-hero-actions">
              <Link to="/login" className="ui-btn ghost">
                <Icon name="arrowLeft" size={15} /> Back to sign in
              </Link>
            </div>
          </div>
          <div className="ui-hero-meta">
            <div>
              <Icon name="user" size={19} />
              <span>One profile for <strong>all reports</strong></span>
            </div>
            <div>
              <Icon name="shield" size={19} />
              <span>Citizen <strong>account access</strong></span>
            </div>
          </div>
        </div>
      </section>

      <main className="container ui-content">
        <form onSubmit={handleForm} className="ui-card">
          <div className="ui-card-head">
            <div>
              <h2>Your details</h2>
              <p>Fill in the fields below to create a citizen profile.</p>
            </div>
            <span className="ui-badge blue"><Icon name="user" size={13} /> Citizen</span>
          </div>

          <div className="ui-card-body">
            <div className="ui-form-grid">
              <div className="ui-field full">
                <label className="ui-label" htmlFor="register-name">Full Name <span className="req">*</span></label>
                <input
                  id="register-name"
                  className="ui-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="e.g. Rahul Sharma"
                />
              </div>

              <div className="ui-field full">
                <label className="ui-label" htmlFor="register-email">Email Address <span className="req">*</span></label>
                <input
                  id="register-email"
                  className="ui-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  required
                  placeholder="e.g. citizen@example.com"
                />
              </div>

              <div className="ui-field full">
                <label className="ui-label" htmlFor="register-phone">Mobile Number</label>
                <input
                  id="register-phone"
                  className="ui-input"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  inputMode="tel"
                  placeholder="e.g. 9812345678"
                />
                <span className="ui-hint">Optional — used only for emergency callback.</span>
              </div>

              <div className="ui-field full">
                <label className="ui-label" htmlFor="register-password">Password <span className="req">*</span></label>
                <input
                  id="register-password"
                  className="ui-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  required
                  minLength={4}
                  placeholder="Enter password"
                />
                <span className="ui-hint">Use at least 4 characters.</span>
              </div>
            </div>
          </div>

          <div className="ui-card-foot">
            <span className="ui-hint">Fields marked * are required.</span>
            <button type="submit" className="ui-btn primary" disabled={submitting}>
              <Icon name="check" size={16} />
              {submitting ? "Creating Account..." : "Create Account"}
            </button>
          </div>
        </form>

        <div className="ui-card">
          <div className="ui-card-body">
            <p className="ui-hint">
              Already have an account? <Link to="/login">Sign in here</Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Register;
