'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import siteData from '@/data/site-data.json';

export default function AdminLogin() {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate login delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (credentials.username === siteData.admin.username && 
        credentials.password === siteData.admin.password) {
      // Store login state in localStorage
      localStorage.setItem('adminLoggedIn', 'true');
      localStorage.setItem('adminUser', JSON.stringify(siteData.admin));
      router.push('/admin');
    } else {
      setError('Ungültige Anmeldedaten');
    }
    
    setIsLoading(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setCredentials(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!mounted) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#f9fafb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #e5e7eb',
            borderTop: '4px solid #2563eb',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          <p style={{ color: '#6b7280' }}>Laden...</p>
        </div>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 16px'
    }}>
      <div style={{
        maxWidth: '400px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '32px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{
            fontSize: '30px',
            fontWeight: 'bold',
            color: '#111827',
            marginBottom: '8px'
          }}>
            FliesenExpress24
          </h1>
          <h2 style={{
            fontSize: '20px',
            color: '#6b7280'
          }}>
            Admin Panel Anmeldung
          </h2>
        </div>

        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          padding: '32px 24px'
        }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {error && (
              <div style={{
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#dc2626',
                padding: '12px 16px',
                borderRadius: '6px'
              }}>
                {error}
              </div>
            )}

            <div>
              <label htmlFor="username" style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '4px'
              }}>
                Benutzername
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={credentials.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '16px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
                placeholder="Benutzername eingeben"
              />
            </div>

            <div>
              <label htmlFor="password" style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '4px'
              }}>
                Passwort
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={credentials.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '16px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
                placeholder="Passwort eingeben"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                backgroundColor: isLoading ? '#9ca3af' : '#2563eb',
                color: 'white',
                padding: '12px',
                border: 'none',
                borderRadius: '6px',
                fontSize: '16px',
                fontWeight: '500',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.2s'
              }}
            >
              {isLoading ? 'Anmelden...' : 'Anmelden'}
            </button>
          </form>

          <div style={{ marginTop: '24px', textAlign: 'center' }}>
            <Link
              href="/"
              style={{
                fontSize: '14px',
                color: '#2563eb',
                textDecoration: 'none'
              }}
            >
              ← Zurück zur Website
            </Link>
          </div>
        </div>

        <div style={{ textAlign: 'center', fontSize: '14px', color: '#6b7280' }}>
          <p>Demo-Zugangsdaten:</p>
          <p>Benutzername: <code style={{ backgroundColor: '#f3f4f6', padding: '2px 4px', borderRadius: '4px' }}>admin</code></p>
          <p>Passwort: <code style={{ backgroundColor: '#f3f4f6', padding: '2px 4px', borderRadius: '4px' }}>admin123</code></p>
        </div>
      </div>
    </div>
  );
}