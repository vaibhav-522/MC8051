import React, { useState } from 'react';
import {
  TMOD_REGISTER,
  TCON_REGISTER,
  IE_REGISTER,
  IP_REGISTER,
  TIMER_MODES,
  INTERRUPT_SOURCES,
} from '../data/peripheralData';
import { RegisterBitGrid } from './RegisterBitGrid';
import { Timer, Zap, ListOrdered, AlertTriangle, CornerDownRight } from 'lucide-react';

export const TimersSection: React.FC = () => {
  const [activeModeId, setActiveModeId] = useState(TIMER_MODES[1].id);
  const activeMode = TIMER_MODES.find((m) => m.id === activeModeId) ?? TIMER_MODES[1];

  return (
    <section id="timers" className="timers-section">
      <div className="section-container">
        {/* Section Header */}
        <div className="section-title-wrap">
          <div className="section-badge">
            <Timer size={14} />
            <span>Timing &amp; Event Handling</span>
          </div>
          <h2 className="section-heading">Timers, Counters &amp; Interrupts</h2>
          <p className="section-subheading">
            Two independent 16-bit timers and five interrupt sources form the real-time heart of the
            8051. This page walks through <strong>TMOD</strong>, <strong>TCON</strong>,{' '}
            <strong>IE</strong> and <strong>IP</strong> bit by bit, the four operating modes, and how
            the CPU vectors to an interrupt service routine.
          </p>
        </div>

        {/* Timer 0 / Timer 1 Overview Cards */}
        <div className="timer-overview-grid">
          <div className="timer-card">
            <div className="timer-card-head">
              <Zap size={18} className="timer-card-icon" />
              <h4>Timer / Counter 0</h4>
            </div>
            <ul className="timer-fact-list">
              <li><strong>Counters:</strong> TH0 (high) : TL0 (low)</li>
              <li><strong>Control bits:</strong> TR0, TF0 in TCON — TMOD low nibble sets the mode</li>
              <li><strong>Vector:</strong> 000BH when TF0 fires</li>
              <li><strong>External pin:</strong> T0 = P3.4 in counter mode</li>
            </ul>
          </div>

          <div className="timer-card">
            <div className="timer-card-head">
              <Zap size={18} className="timer-card-icon" />
              <h4>Timer / Counter 1</h4>
            </div>
            <ul className="timer-fact-list">
              <li><strong>Counters:</strong> TH1 (high) : TL1 (low)</li>
              <li><strong>Control bits:</strong> TR1, TF1 in TCON — TMOD high nibble sets the mode</li>
              <li><strong>Vector:</strong> 001BH when TF1 fires</li>
              <li><strong>External pin:</strong> T1 = P3.5 — also the classic serial baud generator</li>
            </ul>
          </div>

          <div className="timer-card accent-note">
            <div className="timer-card-head">
              <AlertTriangle size={18} className="timer-card-icon warn" />
              <h4>Timer vs. Counter vs. Gate</h4>
            </div>
            <ul className="timer-fact-list">
              <li><strong>C/T = 0 (Timer):</strong> counts machine cycles — fosc ÷ 12 (1 µs @ 12 MHz)</li>
              <li><strong>C/T = 1 (Counter):</strong> counts falling edges on the T0/T1 pin</li>
              <li><strong>GATE = 1:</strong> the INT0#/INT1# pin must also be high to count — pulse-width measurement</li>
            </ul>
          </div>
        </div>

        {/* Register Dictionaries: TMOD + TCON */}
        <div className="subsection-head">
          <h3 className="subsection-title">Step 1 — Configure with TMOD &amp; TCON</h3>
          <p className="subsection-sub">
            Click any bit cell to see what it does. Remember the exam split: <strong>TMOD</strong>{' '}
            chooses <em>how</em> a timer runs, <strong>TCON</strong> starts it and reports what happened.
          </p>
        </div>

        <div className="register-grid-2col">
          <RegisterBitGrid register={TMOD_REGISTER} accent="timer" />
          <RegisterBitGrid register={TCON_REGISTER} accent="timer" />
        </div>

        {/* Timer Modes */}
        <div className="subsection-head">
          <h3 className="subsection-title">Step 2 — Pick a Mode (TMOD M1 M0)</h3>
          <p className="subsection-sub">
            Select a mode card to see its counter width, reload arithmetic and typical lab use.
          </p>
        </div>

        <div className="mode-picker-row">
          {TIMER_MODES.map((mode) => (
            <button
              key={mode.id}
              onClick={() => setActiveModeId(mode.id)}
              className={`mode-pick-card ${activeModeId === mode.id ? 'active' : ''}`}
            >
              <span className="mode-number">Mode {mode.modeNumber}</span>
              <span className="mode-size">{mode.counterSize}</span>
            </button>
          ))}
        </div>

        <div className="mode-detail-card">
          <div className="mode-detail-head">
            <h4 className="mode-detail-title">{activeMode.name}</h4>
            <span className="mode-size-pill">{activeMode.counterSize}</span>
          </div>
          <p className="mode-detail-summary">{activeMode.summary}</p>
          <p className="mode-detail-text">{activeMode.details}</p>
          <div className="mode-detail-grid">
            <div className="mode-detail-box">
              <span className="mode-box-label">Typical Use</span>
              <p>{activeMode.typicalUse}</p>
            </div>
            <div className="mode-detail-box mono-box">
              <span className="mode-box-label">Reload Arithmetic</span>
              <p>{activeMode.reloadExample}</p>
            </div>
          </div>
        </div>

        {/* Quick delay formula reference */}
        <div className="formula-strip">
          <div className="formula-item">
            <span className="formula-title">Mode 1 reload (16-bit)</span>
            <code className="formula-code">Count = 65536 − (TH × 256 + TL)</code>
            <span className="formula-hint">Interval = Count × 12 / fosc</span>
          </div>
          <div className="formula-item">
            <span className="formula-title">Mode 2 reload (8-bit auto)</span>
            <code className="formula-code">Interval = (256 − TH1) × 12 / fosc</code>
            <span className="formula-hint">TH1 = FDH → 9600 baud @ 11.0592 MHz</span>
          </div>
          <div className="formula-item">
            <span className="formula-title">Machine cycle</span>
            <code className="formula-code">1 cycle = 12 / fosc = 1 µs @ 12 MHz</code>
            <span className="formula-hint">Timers count cycles, not instructions</span>
          </div>
        </div>

        {/* Interrupt Registers: IE + IP */}
        <div className="subsection-head">
          <h3 className="subsection-title">
            Step 3 — Enable &amp; Prioritise with IE &amp; IP
          </h3>
          <p className="subsection-sub">
            Every interrupt needs <strong>both</strong> its own enable bit <em>and</em> the master
            switch <strong>EA = 1</strong>. IP is optional — leave it 0 for the default natural order.
          </p>
        </div>

        <div className="register-grid-2col">
          <RegisterBitGrid register={IE_REGISTER} accent="interrupt" />
          <RegisterBitGrid register={IP_REGISTER} accent="interrupt" />
        </div>

        {/* Interrupt vector & priority table */}
        <div className="subsection-head">
          <h3 className="subsection-title">
            <ListOrdered size={18} className="subsection-icon" />
            The Five Interrupt Sources
          </h3>
          <p className="subsection-sub">
            Ranked by their fixed natural priority (1 = highest). With IP = 0 all five sit in the low
            group in exactly this order; setting an IP bit promotes a source above every low-priority one.
          </p>
        </div>

        <div className="intr-table-wrap">
          <table className="intr-table">
            <thead>
              <tr>
                <th className="num-col">Rank</th>
                <th>Interrupt Source</th>
                <th>Vector</th>
                <th>IE Bit</th>
                <th>IP Bit</th>
                <th>Request Flag</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {INTERRUPT_SOURCES.map((src) => (
                <tr key={src.vector} className="intr-row">
                  <td className="num-col">
                    <span className="rank-chip">{src.naturalPriority}</span>
                  </td>
                  <td className="intr-name-cell">{src.name}</td>
                  <td>
                    <code className="vector-code">{src.vector}</code>
                  </td>
                  <td><code className="bit-code">{src.ieBit}</code></td>
                  <td><code className="bit-code">{src.ipBit}</code></td>
                  <td className="flag-cell">{src.requestFlag}</td>
                  <td className="intr-notes-cell">{src.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ISR workflow checklist */}
        <div className="isr-flow-card">
          <h4 className="isr-flow-title">
            <CornerDownRight size={17} className="isr-flow-icon" />
            Anatomy of an interrupt service routine
          </h4>
          <ol className="isr-steps">
            <li>
              <strong>Configure:</strong> set the mode in <code>TMOD</code>, reload <code>THx/TLx</code>,
              then <code>SETB TRx</code>.
            </li>
            <li>
              <strong>Enable:</strong> set the source bit in <code>IE</code> and always{' '}
              <code>SETB EA</code> — no master enable, no interrupts.
            </li>
            <li>
              <strong>Vector:</strong> on the request the CPU finishes the current instruction, pushes
              the PC onto the stack (low byte first) and jumps to the vector address — use{' '}
              <code>LJMP</code> at the vector to reach your real ISR body.
            </li>
            <li>
              <strong>Service:</strong> read/clear the request flag in software (TF0, RI/TI are yours to
              clear) and do the work.
            </li>
            <li>
              <strong>Return:</strong> end with <code>RETI</code> (not RET) — it also releases the
              in-service latch so lower-priority interrupts can be acknowledged again.
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
};
