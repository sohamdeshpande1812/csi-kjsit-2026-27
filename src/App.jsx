import { Navbar, Footer, CybertronBackground } from '@/components/layout';
import { Hero, About, Events, Sponsors, Team } from '@/sections';

/**
 * Complete CSI KJSIT 2026 website interface.
 * Sections:
 *   1. Navbar (fixed header)
 *   2. Hero (#home)
 *   3. About Us (#about)
 *   4. Events (#events)
 *   5. Sponsors (#sponsors)
 *   6. Team (#team)
 *   7. Footer (#footer)
 */
export default function App() {
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <CybertronBackground />
      <Navbar />

      <main id="main" style={{ position: 'relative', zIndex: 1 }}>
        <Hero />
        <About />
        <Events />
        <Sponsors />
        <Team />
      </main>

      <Footer />
    </>
  );
}
