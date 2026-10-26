import React from 'react';
import { ArrowRight, BookOpen, Cpu, Terminal } from 'lucide-react';

interface HeroProps {
  onExploreArchitecture: () => void;
  onExploreFeatures: () => void;
  onExploreInstructions: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onExploreArchitecture,
  onExploreFeatures,
  onExploreInstructions,
}) => {
  return (
    <section className="hero-section">
      <div className="hero-container">
        {/* Engineering Badge */}
        <div className="hero-tagline">
          <Cpu size={15} className="cyan-glow-icon" />
          <span>Electronics &amp; Telecommunication Engineering Reference</span>
        </div>

        {/* Main Title */}
        <h1 className="hero-title">
          8051 <span className="text-cyan-gradient">Basics</span>
        </h1>

        {/* Short Introduction */}
        <p className="hero-intro">
          The <strong>8051 microcontroller</strong> is an iconic 8-bit integrated circuit originally developed by Intel in 1980. Built upon a modified <strong>Harvard architecture</strong>, it features dedicated on-chip memory, a rich boolean and byte instruction set, and hardware peripherals that form the core curriculum of modern embedded engineering.
        </p>

        {/* Call-to-action buttons */}
        <div className="hero-actions">
          <button
            onClick={onExploreArchitecture}
            className="btn-hero-primary"
            aria-label="Explore 8051 Architecture Diagram"
          >
            <span>Explore Architecture</span>
            <ArrowRight size={18} />
          </button>

          <button
            onClick={onExploreFeatures}
            className="btn-hero-secondary"
            aria-label="View Key 8051 Features"
          >
            <BookOpen size={17} />
            <span>Key Features</span>
          </button>

          <button
            onClick={onExploreInstructions}
            className="btn-hero-secondary"
            aria-label="Open 8051 Instruction Set Reference"
          >
            <Terminal size={17} />
            <span>Instruction Set</span>
          </button>
        </div>

        {/* Quick Highlights Bar */}
        <div className="hero-stat-strip">
          <div className="stat-item">
            <span className="stat-value">8-Bit</span>
            <span className="stat-label">CISC CPU Core</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-value">128 Bytes</span>
            <span className="stat-label">Internal RAM</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-value">4 KB</span>
            <span className="stat-label">Program ROM</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-value">32 Lines</span>
            <span className="stat-label">Programmable I/O</span>
          </div>
        </div>
      </div>
    </section>
  );
};
