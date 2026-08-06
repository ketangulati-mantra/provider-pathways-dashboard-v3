import React, { useEffect, useState, type ReactNode } from 'react';

type HandshakeState = 'pending' | 'authenticated' | 'failed';

interface AuthGateProps {
  children: ReactNode;
}

export function AuthGate({ children }: AuthGateProps) {
  const [state, setState] = useState<HandshakeState>('pending');

  useEffect(() => {
    // 1. Exempt Admin Dashboard / Login routes from user pathway token handshake
    const hash = typeof window !== 'undefined' ? window.location.hash : '';
    const path = typeof window !== 'undefined' ? window.location.pathname : '';
    const isAdminRoute = hash.startsWith('#/admin') || path.startsWith('/admin');

    if (isAdminRoute) {
      setState('authenticated');
      return;
    }

    // 2. Check if user_id is already authenticated in sessionStorage
    const existingUserId = sessionStorage.getItem('user_id');

    // 3. Extract token parameter from URL query string or hash string
    const params = new URLSearchParams(window.location.search);
    let token = params.get('token');

    if (!token && hash.includes('token=')) {
      const queryIdx = hash.indexOf('?');
      if (queryIdx !== -1) {
        const hashParams = new URLSearchParams(hash.slice(queryIdx));
        token = hashParams.get('token');
      }
    }

    // 4. Perform POST Handshake Protocol if token is provided
    if (token) {
      fetch('https://api.mantracare.com/user/user-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })
        .then(async (res) => {
          if (!res.ok) throw new Error(`Handshake failed: ${res.status}`);
          return res.json();
        })
        .then((data) => {
          const userId = data.user_id || data.id || data.data?.user_id;
          if (!userId) {
            throw new Error('Invalid user_id payload returned from handshake API');
          }

          // Session isolation: Store user_id in sessionStorage
          sessionStorage.setItem('user_id', String(userId));
          if (data) {
            sessionStorage.setItem('user_info', JSON.stringify(data));
          }

          // Optional DB upsert initialization for new user records
          try {
            fetch('/api/user/initialize', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ user_id: userId, profile_data: data }),
            }).catch(() => {});
          } catch (e) {}

          // Immediately clean token from address bar without page reload
          const cleanParams = new URLSearchParams(window.location.search);
          cleanParams.delete('token');
          const cleanSearch = cleanParams.toString() ? `?${cleanParams.toString()}` : '';
          const cleanUrl = window.location.pathname + cleanSearch + window.location.hash;
          window.history.replaceState({}, '', cleanUrl);

          setState('authenticated');
        })
        .catch((err) => {
          console.error('[AuthGate] Authentication handshake error:', err);
          setState('failed');
          window.location.href = '/token';
        });
      return;
    }

    // 5. If user_id exists in sessionStorage, pass through
    if (existingUserId) {
      setState('authenticated');
      return;
    }

    // 6. Development mode bypass fallback if testing locally without token URL
    if (import.meta.env.DEV) {
      console.warn('[AuthGate] Dev Mode: No token provided in URL. Initializing dev session.');
      sessionStorage.setItem('user_id', 'dev_user_123');
      setState('authenticated');
      return;
    }

    // 7. Hard redirect to /token for unauthenticated users missing token
    setState('failed');
    window.location.href = '/token';
  }, []);

  if (state !== 'authenticated') {
    return <FullScreenLoader />;
  }

  return <>{children}</>;
}

function FullScreenLoader() {
  return (
    <div
      style={{
        display: 'grid',
        placeItems: 'center',
        height: '100vh',
        width: '100vw',
        background: '#f8fafc',
        fontFamily: "'Outfit', 'Inter', sans-serif",
        color: '#0f172a'
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            width: '48px',
            height: '48px',
            border: '4px solid #e2e8f0',
            borderTopColor: '#2563eb',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px auto'
          }}
        />
        <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#0f172a' }}>
          Loading your session…
        </div>
        <div style={{ fontSize: '0.84rem', color: '#64748b', marginTop: '4px' }}>
          Verifying security handshake
        </div>
      </div>
    </div>
  );
}
