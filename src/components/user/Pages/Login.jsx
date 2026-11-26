import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { CustomerLogin, setData } from "../../../services/AuthServices";
import { Link, useNavigate } from 'react-router-dom';
import Icon from './Icon';
import './citizen-ui.css';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const nav = useNavigate();

  const handleForm = (e) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      toast.error("Please enter both email and password");
      return;
    }

    setSubmitting(true);
    let payload = {
      email: email.trim(),
      password: password
    };

    CustomerLogin(payload)
      .then((res) => {
        toast.success(res.data.message || "Login successful");
        setData(res.data);

        const role = res.data.data?.userType || res.data.data?.role;
        if (role === "admin") {
          nav("/admin");
        } else {
          nav("/userdashboard");
        }
      })
      .catch((err) => {
        const errorMsg = err.response?.data?.message || err.message || "Invalid credentials";
        toast.error(errorMsg);
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <div className="cit-page">
      <section className="ui-hero">
        <div className="container ui-hero-inner">
          <div className="ui-hero-copy">
            <span className="ui-eyebrow">Citizen Account Access</span>
            <h1>Sign in to DisasterGuard</h1>
            <p>
              Use your registered account to report emergencies, check local alerts and
              follow the status of your requests.
            </p>
            <div className="ui-hero-actions">
              <Link to="/register" className="ui-btn ghost">
                <Icon name="user" size={15} /> Create citizen account
              </Link>
            </div>
          </div>
          <div className="ui-hero-meta">
            <div>
              <Icon name="shield" size={19} />
              <span><strong>Secure</strong> account sign-in</span>
            </div>
            <div>
              <Icon name="clock" size={19} />
              <span>Access <strong>24/7</strong></span>
            </div>
          </div>
        </div>
      </section>

      <main className="container ui-content">
        <form onSubmit={handleForm} className="ui-card">
          <div className="ui-card-head">
            <div>
              <h2>Account sign in</h2>
              <p>Enter the email and password used for your account.</p>
            </div>
            <span className="ui-badge blue"><Icon name="shield" size={13} /> Verified access</span>
          </div>

          <div className="ui-card-body">
            <div className="ui-form-grid">
              <div className="ui-field full">
                <label className="ui-label" htmlFor="login-email">Email Address <span className="req">*</span></label>
                <input
                  id="login-email"
                  className="ui-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  required
                  placeholder="e.g. citizen@gmail.com or admin@gmail.com"
                />
              </div>

              <div className="ui-field full">
                <label className="ui-label" htmlFor="login-password">Password <span className="req">*</span></label>
                <input
                  id="login-password"
                  className="ui-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  required
                  placeholder="Enter your password"
                />
              </div>

              <div className="ui-field full">
                <div className="ui-callout amber">
                  <Icon name="info" size={18} />
                  {/* <div>
                    <h4>Demo login credentials</h4>
                    <p>
                      Administrator: <code>admin@gmail.com</code> / <code>123</code>
                      <br />
                      Citizen: <code>citizen@gmail.com</code> / <code>123</code>
                    </p>
                  </div> */}
                </div>
              </div>
            </div>
          </div>

          <div className="ui-card-foot">
            <span className="ui-hint">Fields marked * are required.</span>
            <button type="submit" className="ui-btn primary" disabled={submitting}>
              <Icon name="arrowRight" size={16} />
              {submitting ? "Signing in..." : "Sign In to DisasterGuard"}
            </button>
          </div>
        </form>

        <div className="ui-card">
          <div className="ui-card-body">
            <p className="ui-hint">
              Don't have an account yet? <Link to="/register">Register as a Citizen</Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
