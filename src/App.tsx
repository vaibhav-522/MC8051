import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { FeaturesSection } from './components/FeaturesSection';
import { ArchitectureSection } from './components/ArchitectureSection';
import { MemoryMapSection } from './components/MemoryMapSection';
import { InstructionSetSection } from './components/InstructionSetSection';
import { TimersSection } from './components/TimersSection';
import { SerialIoSection } from './components/SerialIoSection';
import { ProgramsSection } from './components/ProgramsSection';
import { Footer } from './components/Footer';
import './App.css';

export type PageId =
  | 'home'
  | 'features'
  | 'architecture'
  | 'memory-map'
  | 'instructions'
  | 'timers'
  | 'io-serial'
  | 'programs';

export function App() {
  const [currentPage, setCurrentPage] = useState<PageId>('home');

  const navigateTo = (pageId: PageId) => {
    setCurrentPage(pageId);
  };

  // Scroll to top whenever the active page changes
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [currentPage]);

  return (
    <div className="app-root">
      {/* Top Navigation */}
      <Header
        onNavigate={navigateTo}
        activePage={currentPage}
      />

      <main className="main-content">
        {currentPage === 'home' && (
          <Hero
            onExploreArchitecture={() => navigateTo('architecture')}
            onExploreFeatures={() => navigateTo('features')}
            onExploreInstructions={() => navigateTo('instructions')}
          />
        )}

        {currentPage === 'features' && (
          <FeaturesSection
            onExploreArchitecture={() => navigateTo('architecture')}
          />
        )}

        {currentPage === 'architecture' && <ArchitectureSection />}

        {currentPage === 'memory-map' && <MemoryMapSection />}

        {currentPage === 'instructions' && <InstructionSetSection />}

        {currentPage === 'timers' && <TimersSection />}

        {currentPage === 'io-serial' && <SerialIoSection />}

        {currentPage === 'programs' && <ProgramsSection />}
      </main>

      {/* Footer */}
      <Footer
        onScrollToTop={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        onNavigate={navigateTo}
      />
    </div>
  );
}

export default App;
