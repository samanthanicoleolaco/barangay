'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Pill, Loader2, ArrowLeft } from 'lucide-react';

export function SignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [position, setPosition] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    if (!agreed) {
      alert('Please agree to the terms and conditions');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      router.push('/dashboard');
    }, 1500);
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    height: '44px',
    padding: '0 14px',
    fontSize: '14px',
    color: '#374151',
    backgroundColor: '#ffffff',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    outline: 'none',
    boxSizing: 'border-box',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '14px',
    fontWeight: 600,
    color: '#1a1a1a',
    marginBottom: '6px',
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8" style={{ backgroundColor: '#f0f5f4' }}>
      <div
        style={{
          width: '100%',
          maxWidth: '460px',
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
          padding: '32px 36px',
        }}
      >
        {/* Back to Login */}
        <Link
          href="/login"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '13px',
            color: '#6b7280',
            textDecoration: 'none',
            marginBottom: '20px',
          }}
        >
          <ArrowLeft style={{ width: '16px', height: '16px' }} />
          Back to Login
        </Link>

        {/* Icon */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '14px',
              backgroundColor: '#0d9488',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Pill style={{ width: '28px', height: '28px', color: '#ffffff' }} />
          </div>
        </div>

        {/* Title */}
        <h1
          style={{
            textAlign: 'center',
            fontSize: '22px',
            fontWeight: 700,
            color: '#1a1a1a',
            margin: '0 0 6px 0',
          }}
        >
          Create Account
        </h1>
        <p
          style={{
            textAlign: 'center',
            fontSize: '13px',
            color: '#6b7280',
            margin: '0 0 24px 0',
          }}
        >
          Join B-Healthcare Inventory System
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Juan dela Cruz"
              required
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = '#0d9488')}
              onBlur={(e) => (e.target.style.borderColor = '#d1d5db')}
            />
          </div>

          {/* Email Address */}
          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="yourname@barangay.gov"
              required
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = '#0d9488')}
              onBlur={(e) => (e.target.style.borderColor = '#d1d5db')}
            />
          </div>

          {/* Position */}
          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Position</label>
            <select
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              required
              style={{
                ...inputStyle,
                appearance: 'auto',
                color: position ? '#374151' : '#9ca3af',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#0d9488')}
              onBlur={(e) => (e.target.style.borderColor = '#d1d5db')}
            >
              <option value="" disabled>Select position</option>
              <option value="bhw">Barangay Health Worker (BHW)</option>
              <option value="bns">Barangay Nutrition Scholar (BNS)</option>
              <option value="midwife">Midwife</option>
              <option value="nurse">Nurse</option>
              <option value="doctor">Doctor</option>
              <option value="admin">Admin Staff</option>
            </select>
          </div>

          {/* Password / Confirm Password Row */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = '#0d9488')}
                onBlur={(e) => (e.target.style.borderColor = '#d1d5db')}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = '#0d9488')}
                onBlur={(e) => (e.target.style.borderColor = '#d1d5db')}
              />
            </div>
          </div>

          {/* Checkbox */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '24px' }}>
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              style={{
                width: '18px',
                height: '18px',
                marginTop: '2px',
                accentColor: '#0d9488',
                flexShrink: 0,
              }}
            />
            <span style={{ fontSize: '12px', color: '#6b7280', lineHeight: '1.5' }}>
              I agree to the terms and conditions and confirm that I am authorized barangay health personnel
            </span>
          </div>

          {/* Create Account Button */}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              height: '46px',
              backgroundColor: '#0d9488',
              color: '#ffffff',
              fontSize: '15px',
              fontWeight: 600,
              border: 'none',
              borderRadius: '10px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'background-color 0.2s',
            }}
            onMouseOver={(e) => {
              if (!isLoading) (e.currentTarget.style.backgroundColor = '#0f766e');
            }}
            onMouseOut={(e) => {
              (e.currentTarget.style.backgroundColor = '#0d9488');
            }}
          >
            {isLoading ? (
              <>
                <Loader2 style={{ width: '18px', height: '18px', animation: 'spin 1s linear infinite' }} />
                Creating account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Footer Link */}
        <p
          style={{
            textAlign: 'center',
            fontSize: '13px',
            color: '#6b7280',
            marginTop: '20px',
          }}
        >
          Already have an account?{' '}
          <Link
            href="/login"
            style={{
              color: '#0d9488',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}
