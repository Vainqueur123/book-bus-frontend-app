import { useEffect, useRef } from 'react';
import './LandingPage.css';

const places = [
  { title: 'Kigali', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop' },
  { title: 'Musanze', image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop' },
  { title: 'Huye', image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=1200&auto=format&fit=crop' },
  { title: 'Rubavu', image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=1200&auto=format&fit=crop' },
  { title: 'Nyagatare', image: 'https://images.unsplash.com/photo-1441716844725-09cedc13a4e7?q=80&w=1200&auto=format&fit=crop' },
  { title: 'Rusizi', image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop' }
];

function Gallery() {
  const trackRef = useRef(null);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    let paused = false;
    const intervalMs = 5000;

    const getStep = () => {
      const firstCard = el.querySelector('.card');
      if (!firstCard) return 300; // fallback
      const style = window.getComputedStyle(el);
      const gap = parseInt(style.columnGap || style.gap || '14', 10) || 14;
      return firstCard.offsetWidth + gap; // width + gap
    };

    const tick = () => {
      if (paused) return;
      const maxScroll = el.scrollWidth - el.clientWidth;
      const step = getStep();
      let next = el.scrollLeft + step;
      if (next >= maxScroll - 4) {
        // loop back smoothly
        el.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        el.scrollTo({ left: next, behavior: 'smooth' });
      }
    };

    const id = setInterval(tick, intervalMs);

    // Pause on hover/touch
    const onEnter = () => { paused = true; };
    const onLeave = () => { paused = false; };
    el.addEventListener('mouseenter', onEnter);
    el.addEventListener('mouseleave', onLeave);
    el.addEventListener('touchstart', onEnter, { passive: true });
    el.addEventListener('touchend', onLeave, { passive: true });

    return () => {
      clearInterval(id);
      el.removeEventListener('mouseenter', onEnter);
      el.removeEventListener('mouseleave', onLeave);
      el.removeEventListener('touchstart', onEnter);
      el.removeEventListener('touchend', onLeave);
    };
  }, []);

  return (
    <section className="gallery">
      <div className="container">
        <h2 className="section-title">Popular destinations</h2>
        <div className="card-grid" ref={trackRef}>
          {places.map((p) => (
            <div key={p.title} className="card">
              <div className="card-image" style={{ backgroundImage: `url(${p.image})` }} />
              <div className="card-body">
                <h3>{p.title}</h3>
                <p>Explore routes, schedules, and prices.</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Gallery;
