import React, { useState } from 'react';
import { PROGRAMS } from '../data/programsData';
import { CodeAnimator } from './CodeAnimator';
import {
  Plus,
  Minus,
  Calculator,
  ArrowUpDown,
  Lightbulb,
  ArrowLeftRight,
  Volume2,
  Play,
  Code2,
  Cpu,
} from 'lucide-react';
import '../Programs.css';

const iconMap: Record<string, React.ReactNode> = {
  Plus: <Plus size={22} />,
  Minus: <Minus size={22} />,
  Calculator: <Calculator size={22} />,
  ArrowUpDown: <ArrowUpDown size={22} />,
  Lightbulb: <Lightbulb size={22} />,
  ArrowLeftRight: <ArrowLeftRight size={22} />,
  Volume2: <Volume2 size={22} />,
};

type LangTab = 'asm' | 'c';

/**
 * Programs page — two subsections (Assembly / C) with seven classic lab
 * programs, each playable as a line-by-line execution animation.
 */
export const ProgramsSection: React.FC = () => {
  const [lang, setLang] = useState<LangTab>('asm');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <section id="programs" className="pgm-section">
      <div className="section-container">
        <div className="section-title-wrap">
          <span className="section-badge">Practice · Animated Execution</span>
          <h2 className="section-heading">8051 Programs</h2>
          <p className="section-subheading">
            Seven classic lab programs in both Assembly and C. Press <strong>Play</strong> to watch each
            line execute with live registers, flags, memory, LED outputs and console messages.
          </p>
        </div>

        {/* Language subsection tabs */}
        <div className="pgm-tabs" role="tablist" aria-label="Program language">
          <button
            role="tab"
            aria-selected={lang === 'asm'}
            className={`pgm-tab${lang === 'asm' ? ' active' : ''}`}
            onClick={() => {
              setLang('asm');
              setExpandedId(null);
            }}
          >
            <Code2 size={16} />
            <span>1. Programs using Assembly Language</span>
          </button>
          <button
            role="tab"
            aria-selected={lang === 'c'}
            className={`pgm-tab${lang === 'c' ? ' active' : ''}`}
            onClick={() => {
              setLang('c');
              setExpandedId(null);
            }}
          >
            <Cpu size={16} />
            <span>2. Programs in C Language</span>
          </button>
        </div>

        <div className="pgm-grid">
          {PROGRAMS.map((p) => {
            const open = expandedId === p.id;
            return (
              <div key={p.id} className={`pgm-card${open ? ' open' : ''}`}>
                <button
                  className="pgm-card-head"
                  onClick={() => setExpandedId(open ? null : p.id)}
                  aria-expanded={open}
                >
                  <span className="pgm-card-icon">{iconMap[p.iconName]}</span>
                  <span className="pgm-card-text">
                    <span className="pgm-card-title">{p.title}</span>
                    <span className="pgm-card-summary">{p.summary}</span>
                  </span>
                  <span className="pgm-card-cta">
                    {open ? (
                      'Close ▾'
                    ) : (
                      <>
                        <Play size={13} /> View &amp; Animate
                      </>
                    )}
                  </span>
                </button>
                {open && (
                  <div className="pgm-card-body">
                    <CodeAnimator program={p} lang={lang} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <p className="pgm-footnote">
          <strong>Tip:</strong> the Assembly tab shows exactly what the 8051 executes (MOV, ADD, SUBB,
          MUL&nbsp;AB, DIV&nbsp;AB, DJNZ…), while the C tab shows the equivalent Keil&nbsp;C51 source —
          the compiler turns each C statement into those very instructions. Flags use standard 8051
          semantics: CY = borrow/carry, AC = half-carry, OV = signed overflow.
        </p>
      </div>
    </section>
  );
};
