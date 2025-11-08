import { useEffect, useState } from 'react';
import Navbar from './Navbar';
import Hero from './Hero';
import Gallery from './Gallery';
import Authentication from '../welcome/components/Authentication';
import './LandingPage.css';
import { supabase } from '../lib/supabaseClient';

function LandingPage() {
  const [authMode, setAuthMode] = useState(null); // 'signin' | 'signup' | null
  const [user, setUser] = useState(null);
  const [notice, setNotice] = useState('');

  const closeModal = () => setAuthMode(null);

  // Auto-dismiss toast after 10 seconds
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(''), 10000);
    return () => clearTimeout(timer);
  }, [notice]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (mounted) setUser(data.session?.user || null);
    })();
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });
    return () => {
      mounted = false;
      sub?.subscription?.unsubscribe?.();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="landing-page">
      <Navbar 
        user={user}
        onLoginClick={() => setAuthMode('signin')} 
        onSignupClick={() => setAuthMode('signup')} 
        onLogoutClick={handleLogout}
      />
      <main>
        <Hero 
          user={user}
          onRequireAuth={(mode) => setAuthMode(mode || 'signin')}
          onNotify={(msg) => setNotice(msg)}
        />
        <Gallery />
      </main>

      {notice && (
        <div className="toast" role="status">
          <span>{notice}</span>
          <button className="toast-close" onClick={() => setNotice('')} aria-label="Dismiss">×</button>
        </div>
      )}

      {authMode && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-card">
              <Authentication 
                mode={authMode}
                onAuthSuccess={() => setAuthMode(null)}
                onNotify={(msg) => setNotice(msg)}
                onBack={closeModal}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LandingPage;
