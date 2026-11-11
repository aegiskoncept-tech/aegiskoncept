'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@aegiskoncept.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const cleanEmail = email.trim().toLowerCase();
      const res = await signIn('credentials', {
        email: cleanEmail,
        password,
        redirect: false,
        callbackUrl: '/admin',
      });

      if (res?.error) {
        console.error('[AdminLogin] signIn error:', res.error);
        if (res.error === 'CredentialsSignin') {
          setError('Invalid email or password. Use: admin@aegiskoncept.com / AegisAdmin2026!');
        } else {
          setError(`Login failed: ${res.error}`);
        }
      } else if (res?.ok) {
        window.location.href = '/admin';
      }
    } catch (err: any) {
      console.error('[AdminLogin] Exception during signIn:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#191919',
        color: '#F4F0E8',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        fontFamily: '"Inter Tight", system-ui, sans-serif',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          background: '#242220',
          border: '1px solid #3A3734',
          borderRadius: '16px',
          padding: '40px 32px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ display: 'inline-block', width: '48px', height: '52px', marginBottom: '16px' }}>
            <svg viewBox="0 0 100 110" width="100%" height="100%">
              <path
                d="M8 110 V54 C8 28 28 10 50 0 C72 10 92 28 92 54 V110 H70 V56 C70 42 62 31 50 24 C38 31 30 42 30 56 V110 Z"
                fill="#D3E45B"
              />
            </svg>
          </div>
          <h1
            style={{
              fontFamily: '"Instrument Serif", Georgia, serif',
              fontSize: '32px',
              fontWeight: 400,
              margin: '0 0 6px 0',
              color: '#F4F0E8',
            }}
          >
            AegisKoncept Admin
          </h1>
          <p style={{ margin: 0, fontSize: '14px', color: '#8E877F' }}>
            Sign in to manage content, SEO and leads
          </p>
        </div>

        {error && (
          <div
            style={{
              background: 'rgba(163, 38, 31, 0.15)',
              border: '1px solid #A3261F',
              color: '#F9B3AE',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '13px',
              marginBottom: '20px',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label
              htmlFor="email"
              style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: 600,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                color: '#8E877F',
                marginBottom: '8px',
              }}
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 14px',
                background: '#191919',
                border: '1px solid #3A3734',
                borderRadius: '8px',
                color: '#F4F0E8',
                fontSize: '15px',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: 600,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                color: '#8E877F',
                marginBottom: '8px',
              }}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              style={{
                width: '100%',
                padding: '12px 14px',
                background: '#191919',
                border: '1px solid #3A3734',
                borderRadius: '8px',
                color: '#F4F0E8',
                fontSize: '15px',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: '10px',
              padding: '14px',
              background: '#D3E45B',
              color: '#191919',
              border: 'none',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'transform 0.15s ease',
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '12px', color: '#77716A' }}>
          Protected portal · AegisKoncept Digital Marketing
        </div>
      </div>
    </div>
  );
}

