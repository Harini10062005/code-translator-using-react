import { useState } from "react";
import { Link } from "react-router-dom";

export default function LoginPage() {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  return (
    <div className="auth-page">
      <div className="auth-card">

        <div className="auth-avatar">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="36" height="36">
            <circle cx="12" cy="8" r="4" fill="white" opacity="0.9"/>
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.9"/>
          </svg>
        </div>

        <h2 className="auth-title">Login</h2>

        <div className="auth-form">
          <div className="form-group">
            <div className="form-label-row">
              <label>Email</label>
              <a href="#" className="forgot-link">Forgot password?</a>
            </div>
            <div className="input-wrap">
              <span className="input-icon">✉</span>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="input-wrap">
              <span className="input-icon">🔒</span>
              <input
                type={showPass ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="form-input"
              />
              <span
                className="input-icon-right"
                onClick={() => setShowPass(!showPass)}
              >
                {showPass ? "🙈" : "👁"}
              </span>
            </div>
          </div>

          <button className="auth-btn login-btn">Log In</button>

          <div className="auth-divider"><span>or continue with</span></div>

          <div className="social-btns">
            <button className="social-btn">
              <img src="https://www.google.com/favicon.ico" width="16" alt="G" />
              Google
            </button>
            <button className="social-btn">
              <span className="fb-icon">f</span>
              Facebook
            </button>
          </div>

          <p className="auth-switch">
            Not registered yet?{" "}
            <Link to="/signup" className="auth-link">Sign Up &gt;</Link>
          </p>
        </div>
      </div>
    </div>
  );
}