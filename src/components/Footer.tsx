import React from 'react';
import { Cpu, ArrowUp } from 'lucide-react';
import type { PageId } from '../App';

const CURRENT_YEAR = new Date().getFullYear();

interface FooterProps {
  onScrollToTop: () => void;
  onNavigate: (sectionId: PageId) => void;
}

export const Footer: React.FC<FooterProps> = ({ onScrollToTop, onNavigate }) => {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="brand-badge">
              <Cpu size={18} className="footer-chip-icon" />
              <span className="footer-brand-title">8051 Basics</span>
            </div>
            <p className="footer-desc">
              An educational web resource designed for Electronics and Telecommunication Engineering (E&amp;TC) students to master the classic 8051 microcontroller hardware and Harvard architecture.
            </p>
          </div>

          <div className="footer-links-col">
            <h4 className="footer-col-title">Quick Navigation</h4>
            <ul className="footer-links">
              <li>
                <button onClick={() => onNavigate('features')} className="footer-btn">
                  Features of 8051
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('architecture')} className="footer-btn">
                  8051 Architecture Diagram
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('memory-map')} className="footer-btn">
                  RAM vs. ROM Memory Map
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('instructions')} className="footer-btn">
                  Complete Instruction Set
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('timers')} className="footer-btn">
                  Timers, Counters &amp; Interrupts
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('io-serial')} className="footer-btn">
                  I/O Ports &amp; Serial Comm
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('programs')} className="footer-btn">
                  8051 Programs (Animated)
                </button>
              </li>
            </ul>
          </div>

          <div className="footer-links-col">
            <h4 className="footer-col-title">Engineering References</h4>
            <ul className="footer-links-text">
              <li>• Intel MCS-51 Family User's Manual</li>
              <li>• The 8051 Microcontroller &amp; Embedded Systems (Mazidi &amp; Mazidi)</li>
              <li>• The 8051 Microcontroller (Kenneth J. Ayala)</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="copyright-text">
            © {CURRENT_YEAR} 8051 Basics • Classic Intel 8051 Educational Reference
          </p>

          <button onClick={onScrollToTop} className="btn-back-to-top" title="Back to top">
            <span>Back to Top</span>
            <ArrowUp size={16} />
          </button>
        </div>
      </div>
    </footer>
  );
};
