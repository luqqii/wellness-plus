import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Mail, Lock, User, Sparkles, Check } from 'lucide-react';
import Input from '../components/ui/Input';
import useAuth from '../hooks/useAuth';

const PASSWORD_RULES = [
  { test: v => v.length >= 8,       label: '8+ characters' },
  { test: v => /[A-Z]/.test(v),     label: 'Uppercase letter' },
  { test: v => /[0-9]/.test(v),     label: 'Number' },
];

export default function SignupPage() {
  const navigate = useNavigate();
  const { signup, loading } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [pwFocused, setPwFocused] = useState(false);

  function updateField(field, value) {
    setForm(p => ({ ...p, [field]: value }));
    setErrors(p => ({ ...p, [field]: '' }));
  }

  function validate() {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 8) errs.password = 'At least 8 characters required';
    if (!form.confirm) errs.confirm = 'Please confirm your password';
    else if (form.confirm !== form.password) errs.confirm = 'Passwords do not match';
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    
    try {
      await signup({ name: form.name, email: form.email, password: form.password });
    } catch (err) {
      setErrors({ form: err.message });
    }
  }

  const pwStrength = PASSWORD_RULES.filter(r => r.test(form.password)).length;
  const pwStrengthColor = ['var(--c-red)', 'var(--c-orange)', 'var(--c-yellow)', 'var(--c-teal)'][pwStrength];

  return (
    <div className="auth-page">
      {/* Background orbs */}
      <div style={{
        position: 'absolute', width: 450, height: 450,
        borderRadius: '50%', top: '-15%', left: '-8%',
        background: 'radial-gradient(circle, rgba(155,109,255,0.1) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', width: 350, height: 350,
        borderRadius: '50%', bottom: '0%', right: '-5%',
        background: 'radial-gradient(circle, rgba(0,212,170,0.08) 0%, transparent 70%)',
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
              Create your account
            </h1>
            <p style={{ fontSize: 14, color: 'var(--c-text-secondary)' }}>
              Start your AI-powered wellness journey today
            </p>
          </div>

          {/* Google Sign Up */}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
            <div style={{ flex: 1, height: 1, background: 'var(--c-border)' }} />
            <span style={{ fontSize: 12, color: 'var(--c-text-muted)', fontWeight: 500 }}>or sign up with email</span>
            <div style={{ flex: 1, height: 1, background: 'var(--c-border)' }} />
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {errors.form && (
              <div style={{ padding: '10px 14px', background: 'var(--c-red-dim)', color: 'var(--c-red)', fontSize: 13, borderRadius: 8, textAlign: 'center', fontWeight: 500 }}>
                {errors.form}
              </div>
            )}
            <Input
              label="Full name"
              type="text"
              value={form.name}
              onChange={e => updateField('name', e.target.value)}
              icon={User}
              error={errors.name}
              required
            />
            <Input
              label="Email address"
              type="email"
              value={form.email}
              onChange={e => updateField('email', e.target.value)}
              icon={Mail}
              error={errors.email}
              required
            />
            <div>
              <Input
                label="Password"
                type="password"
                value={form.password}
                onChange={e => updateField('password', e.target.value)}
                icon={Lock}
                error={errors.password}
                required
                inputClassName="pw-input"
                onFocus={() => setPwFocused(true)}
                onBlur={() => setPwFocused(false)}
              />
              {/* Password strength */}
              {(form.password || pwFocused) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  style={{ marginTop: 10 }}
                >
                  <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
                    {[0,1,2].map(i => (
                      <div key={i} style={{
                        flex: 1, height: 3, borderRadius: 99,
                        background: i < pwStrength ? pwStrengthColor : 'rgba(255,255,255,0.08)',
                        transition: 'background 0.3s',
                      }} />
                    ))}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 16px' }}>
                    {PASSWORD_RULES.map(rule => (
                      <div key={rule.label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <div style={{
                          width: 14, height: 14, borderRadius: '50%',
                          background: rule.test(form.password) ? 'var(--c-teal)' : 'rgba(255,255,255,0.1)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          transition: 'background 0.2s',
                        }}>
                          {rule.test(form.password) && <Check size={9} color="white" strokeWidth={3} />}
                        </div>
                        <span style={{ fontSize: 11, color: rule.test(form.password) ? 'var(--c-teal)' : 'var(--c-text-muted)' }}>
                          {rule.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
            <Input
              label="Confirm password"
              type="password"
              value={form.confirm}
              onChange={e => updateField('confirm', e.target.value)}
              icon={Lock}
              error={errors.confirm}
              success={form.confirm && form.confirm === form.password ? true : undefined}
              required
            />

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
                  Creating account...
                </>
              ) : (
                <>Create Account <ArrowRight size={16} /></>
              )}
            </button>

            <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--c-text-muted)', lineHeight: 1.6 }}>
              By creating an account, you agree to our{' '}
              <a href="#" style={{ color: 'var(--c-blue)', textDecoration: 'none' }}>Terms of Service</a>{' '}
              and{' '}
              <a href="#" style={{ color: 'var(--c-blue)', textDecoration: 'none' }}>Privacy Policy</a>.
            </p>
          </form>

          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--c-text-secondary)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--c-blue)', fontWeight: 600, textDecoration: 'none' }}>
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
