import React from 'react';
import { Cpu, BookOpen, Layers, HardDrive, Home, Terminal, Timer, Radio, Code } from 'lucide-react';
import type { PageId } from '../App';

interface HeaderProps {
  onNavigate: (pageId: PageId) => void;
  activePage: PageId;
}

const navItems: { id: PageId; label: string; icon: React.ReactNode }[] = [
  { id: 'home', label: 'Home', icon: <Home size={16} /> },
  { id: 'features', label: 'Features', icon: <BookOpen size={16} /> },
  { id: 'architecture', label: 'Architecture', icon: <Layers size={16} /> },
  { id: 'memory-map', label: 'Memory Map', icon: <HardDrive size={16} /> },
  { id: 'instructions', label: 'Instruction Set', icon: <Terminal size={16} /> },
  { id: 'timers', label: 'Timers & IRQ', icon: <Timer size={16} /> },
  { id: 'io-serial', label: 'I/O & Serial', icon: <Radio size={16} /> },
  { id: 'programs', label: 'Programs', icon: <Code size={16} /> },
];

export const Header: React.FC<HeaderProps> = ({ onNavigate, activePage }) => {
  return (
    <header className="site-header">
      <div className="header-inner">
        {/* Logo / Brand */}
        <div
          className="brand"
          onClick={() => onNavigate('home')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onNavigate('home');
            }
          }}
          role="button"
          tabIndex={0}
        >
          <div className="logo-chip">
            <Cpu size={20} className="logo-icon" />
          </div>
          <div className="brand-text">
            <span className="brand-title">8051 <span className="cyan-text">Basics</span></span>
            <span className="brand-sub">E&amp;TC Engineering Guide</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="header-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`nav-link ${activePage === item.id ? 'active' : ''}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Quick Chip Indicator */}
        <div className="header-right">
          <span className="classic-chip">Classic 8051</span>
        </div>
      </div>
    </header>
  );
};
