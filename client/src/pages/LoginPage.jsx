import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Mail, Lock, Sparkles } from 'lucide-react';
import Input from '../components/ui/Input';
import useAuth from '../hooks/useAuth';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  function validate() {
    const errs = {};
    if (!email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Enter a valid email';
    if (!password) errs.password = 'Password is required';
    else if (password.length < 6) errs.password = 'Password must be 6+ characters';
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    
    try {
      await login({ email, password });
    } catch (err) {
      setErrors({ form: err.message });
    }
  }

  return (
    <div className="auth-page">
      {/* Background orbs */}
      <div style={{
        position: 'absolute', width: 400, height: 400,
        borderRadius: '50%', top: '-10%', right: '-5%',
        background: 'radial-gradient(circle, rgba(79,141,255,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', width: 300, height: 300,
        borderRadius: '50%', bottom: '5%', left: '-5%',
        background: 'radial-gradient(circle, rgba(155,109,255,0.1) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ width: '100%', maxWidth: 440, zIndex: 2 }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center', marginBottom: 32 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 12,
            background: 'linear-gradient(135deg, var(--c-blue), var(--c-purple))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: 'var(--shadow-glow-blue)',
          }}>
            <Sparkles size={18} color="white" />
          </div>
          <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.5px' }}
            className="grad-blue-purple">Wellness+</span>
        </div>

        <div className="auth-card">
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 6 }}>
              Welcome back
            </h1>
            <p style={{ fontSize: 14, color: 'var(--c-text-secondary)' }}>
              Sign in to continue your wellness journey
            </p>
          </div>

          {/* Google Sign In */}
          <button className="social-btn" style={{ marginBottom: 20 }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A9 9 0 009 18z" fill="#34A853"/>
              <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A9 9 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A9 9 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div className="auth-divider" style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
            <div className="auth-divider-line" />
            <span className="auth-divider-text">or sign in with email</span>
            <div className="auth-divider-line" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {errors.form && (
              <div style={{ padding: '10px 14px', background: 'var(--c-red-dim)', color: 'var(--c-red)', fontSize: 13, borderRadius: 8, textAlign: 'center', fontWeight: 500 }}>
                {errors.form}
              </div>
            )}
            <Input
              label="Email address"
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: '' })); }}
              icon={Mail}
              error={errors.email}
              required
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={e => { setPassword(e.target.value); setErrors(p => ({ ...p, password: '' })); }}
              icon={Lock}
              error={errors.password}
              required
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: -4 }}>
              <a href="#" style={{ fontSize: 12, color: 'var(--c-blue)', textDecoration: 'none', fontWeight: 500 }}>
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{
                width: '100%', padding: '13px 18px', fontSize: 15,
                justifyContent: 'center', gap: 8, marginTop: 4,
                background: loading ? 'rgba(79,141,255,0.5)' : 'var(--c-blue)',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? (
                <>
                  <svg style={{ animation: 'spin 1s linear infinite' }} width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="31.4" strokeDashoffset="8" />
                  </svg>
                  Signing in...
                </>
              ) : (
                <>Sign In <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: 'var(--c-text-secondary)' }}>
            Don't have an account?{' '}
            <Link to="/signup" style={{ color: 'var(--c-blue)', fontWeight: 600, textDecoration: 'none' }}>
              Create one
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
