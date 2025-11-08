import Navbar from './Navbar';
import Hero from './Hero';
import Gallery from './Gallery';
import './LandingPage.css';

function LandingPage() {
  return (
    <div className="landing-page">
      <Navbar />
      <main>
        <Hero />
        <Gallery />
      </main>
    </div>
  );
}

export default LandingPage;
