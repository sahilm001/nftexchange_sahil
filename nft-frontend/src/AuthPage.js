import "./AuthPage.css";
import React, { useState } from "react";
import { supabase } from "./supabaseClient";

function AuthPage({ onLogin, showToast }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    let error = null;

    if (isRegistering) {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });
      error = signUpError;
      if (!error) {
        if (showToast) showToast('Registration successful! You can now log in.', 'success');
        setIsRegistering(false);
      }
    } else {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      error = signInError;
      if (!error && onLogin) {
        onLogin(email, false);
      }
    }

    if (error) {
      if (showToast) showToast(error.message, 'error');
    }
    setLoading(false);
  };

  return (
    <div className={`container ${isRegistering ? "active" : ""}`}>
      {/* Login Form */}
      <div className="form-box Login">
        <form className="animation" onSubmit={handleAuth}>
          <h2>Login</h2>
          <div className="input-box">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <label>Email</label>
          </div>
          <div className="input-box">
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <label>Password</label>
          </div>
          <button type="submit" className="btn" disabled={loading}>
            {loading ? "Loading..." : "Login"}
          </button>
          <div className="regi-link">
            Don't have an account?{" "}
            <button type="button" className="link-button" onClick={() => setIsRegistering(true)}>Sign Up</button>
          </div>
        </form>
      </div>

      {/* Register Form */}
      <div className="form-box Register">
        <form className="animation" onSubmit={handleAuth}>
          <h2>Register</h2>
          <div className="input-box">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <label>Email</label>
          </div>
          <div className="input-box">
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <label>Password</label>
          </div>
          <button type="submit" className="btn" disabled={loading}>
            {loading ? "Loading..." : "Register"}
          </button>
          <div className="regi-link">
            Already have an account?{" "}
            <button type="button" className="link-button" onClick={() => setIsRegistering(false)}>Sign In</button>
          </div>
        </form>
      </div>

      {/* Info Panels */}
      <div className="info-content Login">
        <div className="animation">
          <h2>WELCOME BACK!</h2>
          <p>We are happy to have you with us again. If you need anything, we are here to help.</p>
        </div>
      </div>

      <div className="info-content Register">
        <div className="animation">
          <h2>WELCOME!</h2>
          <p>We’re delighted to have you here. If you need any assistance, feel free to reach out.</p>
        </div>
      </div>

      {/* Decorative Shapes */}
      <div className="curved-shape"></div>
      <div className="curved-shape2"></div>
    </div>
  );
}

export default AuthPage;