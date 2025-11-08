import { useState } from 'react';
import Navbar from './Navbar';
import Hero from './Hero';
import Gallery from './Gallery';
import Authentication from '../welcome/components/Authentication';
import './LandingPage.css';

function LandingPage() {
  const [authMode, setAuthMode] = useState(null); // 'signin' | 'signup' | null

  const closeModal = () => setAuthMode(null);

  return (
    <div className="landing-page">
      <Navbar 
        onLoginClick={() => setAuthMode('signin')} 
        onSignupClick={() => setAuthMode('signup')} 
      />
      <main>
        <Hero />
        <Gallery />
      </main>

      {authMode && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-card">
              <Authentication 
                mode={authMode}
                onAuthSuccess={() => setAuthMode(null)}
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
