import React, { useState } from 'react';
import { HardDrive, CheckCircle2 } from 'lucide-react';

export const MemoryMapSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'comparison' | 'ram' | 'rom'>('comparison');

  return (
    <section id="memory-map" className="memory-map-section">
      <div className="section-container">
        {/* Section Header */}
        <div className="section-title-wrap">
          <div className="section-badge">
            <HardDrive size={14} />
            <span>Memory Organization</span>
          </div>
          <h2 className="section-heading">RAM vs. ROM in the Classic 8051</h2>
          <p className="section-subheading">
            A key cornerstone of the 8051’s <strong>Harvard architecture</strong> is the total physical and logical separation between volatile data storage (Internal RAM) and non-volatile code memory (Program ROM).
          </p>
        </div>

        {/* Tab Controls */}
        <div className="memory-tabs">
          <button
            onClick={() => setActiveTab('comparison')}
            className={`memory-tab ${activeTab === 'comparison' ? 'active' : ''}`}
          >
            Direct Comparison (RAM vs. ROM &amp; PC vs. DPTR)
          </button>
          <button
            onClick={() => setActiveTab('ram')}
            className={`memory-tab ${activeTab === 'ram' ? 'active' : ''}`}
          >
            Internal RAM Map (128 Bytes: 00H–7FH)
          </button>
          <button
            onClick={() => setActiveTab('rom')}
            className={`memory-tab ${activeTab === 'rom' ? 'active' : ''}`}
          >
            Program ROM Map (4 KB: 0000H–0FFFH)
          </button>
        </div>

        {/* Tab 1: Comparison Cards */}
        {activeTab === 'comparison' && (
          <div className="memory-tab-content">
            <div className="comparison-grid">
              {/* RAM Card */}
              <div className="comparison-card memory-ram-card">
                <div className="comp-card-badge ram-badge">DATA MEMORY</div>
                <h3 className="comp-card-title">128 Bytes Internal RAM</h3>
                <p className="comp-card-summary">
                  Volatile, fast data storage accessed during program execution for temporary variables, calculations, and subroutine call stacks.
                </p>
                <ul className="comp-list">
                  <li>
                    <CheckCircle2 size={16} className="cyan-bullet" />
                    <span><strong>Address Range:</strong> 00H to 7FH (128 bytes total)</span>
                  </li>
                  <li>
                    <CheckCircle2 size={16} className="cyan-bullet" />
                    <span><strong>Access Instructions:</strong> <code>MOV A, 30H</code> or <code>MOV @R0, A</code></span>
                  </li>
                  <li>
                    <CheckCircle2 size={16} className="cyan-bullet" />
                    <span><strong>Structure:</strong> Register Banks (00H-1FH), Bit-Addressable RAM (20H-2FH), Scratchpad (30H-7FH)</span>
                  </li>
                  <li>
                    <CheckCircle2 size={16} className="cyan-bullet" />
                    <span><strong>Data Persistence:</strong> Erased instantly when power is disconnected</span>
                  </li>
                </ul>
              </div>

              {/* ROM Card */}
              <div className="comparison-card memory-rom-card">
                <div className="comp-card-badge rom-badge">CODE MEMORY</div>
                <h3 className="comp-card-title">4 KB On-Chip Program ROM</h3>
                <p className="comp-card-summary">
                  Non-volatile memory designed to permanently store machine code instructions, lookup constants, and interrupt vectors.
                </p>
                <ul className="comp-list">
                  <li>
                    <CheckCircle2 size={16} className="cyan-bullet" />
                    <span><strong>Address Range:</strong> 0000H to 0FFFH (4,096 bytes)</span>
                  </li>
                  <li>
                    <CheckCircle2 size={16} className="cyan-bullet" />
                    <span><strong>Access Instructions:</strong> Fetched via PC, or read via <code>MOVC A, @A+DPTR</code></span>
                  </li>
                  <li>
                    <CheckCircle2 size={16} className="cyan-bullet" />
                    <span><strong>Structure:</strong> Reset Vector (0000H), Interrupt Vectors (0003H-0023H), Program Code</span>
                  </li>
                  <li>
                    <CheckCircle2 size={16} className="cyan-bullet" />
                    <span><strong>Data Persistence:</strong> Permanently retained with or without power</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* PC vs DPTR Comparison */}
            <div className="pointer-clarification-card">
              <h4 className="pointer-card-title">
                Technical Distinction: Program Counter (PC) vs. Data Pointer (DPTR)
              </h4>
              <p className="pointer-card-desc">
                Both are 16-bit registers capable of addressing 64 KB (0000H–FFFFH), but they serve fundamentally different purposes:
              </p>
              <div className="pointer-dual-grid">
                <div className="pointer-item">
                  <span className="pointer-name">Program Counter (PC)</span>
                  <span className="pointer-role">Instruction Execution Flow</span>
                  <p className="pointer-text">
                    Tracks the memory address in <strong>Program ROM</strong> of the next instruction opcode to execute. Automatically incremented after every byte fetch. Modified only by jumps, calls, and returns. Not directly accessible via SFR addresses.
                  </p>
                </div>
                <div className="pointer-item">
                  <span className="pointer-name">Data Pointer (DPTR)</span>
                  <span className="pointer-role">Data &amp; Table Indexing</span>
                  <p className="pointer-text">
                    Used explicitly by the programmer to point to <strong>external data RAM</strong> (with <code>MOVX</code>) or lookup tables in <strong>ROM</strong> (with <code>MOVC</code>). Can be written and read as two separate 8-bit SFRs: DPH (0x83) and DPL (0x82).
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Internal RAM Map */}
        {activeTab === 'ram' && (
          <div className="memory-tab-content">
            <div className="map-breakdown-card">
              <h3 className="map-title">Classic 8051 Internal RAM Map (128 Bytes: 00H–7FH)</h3>
              <p className="map-desc">
                Internal RAM is divided into three distinct functional sections. Note that in the classic 8051, addresses 80H to FFH are reserved for Special Function Registers (SFRs), not user RAM.
              </p>

              <div className="ram-map-visual">
                {/* Section 3 */}
                <div className="ram-zone zone-scratchpad">
                  <div className="zone-header">
                    <span className="zone-range">30H – 7FH (80 Bytes)</span>
                    <span className="zone-name">General-Purpose Scratchpad RAM &amp; Stack</span>
                  </div>
                  <p className="zone-desc">
                    Used for storing user program variables, lookup buffers, and dynamic stack data (Stack Pointer defaults to 07H, but is typically re-initialized to 30H).
                  </p>
                </div>

                {/* Section 2 */}
                <div className="ram-zone zone-bit">
                  <div className="zone-header">
                    <span className="zone-range">20H – 2FH (16 Bytes)</span>
                    <span className="zone-name">Bit-Addressable RAM (128 Boolean Bits)</span>
                  </div>
                  <p className="zone-desc">
                    Can be accessed byte-by-byte (addresses 20H–2FH) or bit-by-bit (bit addresses 00H through 7FH) using single-bit instructions like <code>SETB 05H</code> or <code>CLR 05H</code>.
                  </p>
                </div>

                {/* Section 1 */}
                <div className="ram-zone zone-banks">
                  <div className="zone-header">
                    <span className="zone-range">00H – 1FH (32 Bytes)</span>
                    <span className="zone-name">Four Working Register Banks (Bank 0 – Bank 3)</span>
                  </div>
                  <div className="bank-sub-strip">
                    <div className="bank-pill">Bank 3 (18H–1FH: R0–R7)</div>
                    <div className="bank-pill">Bank 2 (10H–17H: R0–R7)</div>
                    <div className="bank-pill">Bank 1 (08H–0FH: R0–R7)</div>
                    <div className="bank-pill active-bank">Bank 0 (00H–07H: R0–R7, default on reset)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Program ROM Map */}
        {activeTab === 'rom' && (
          <div className="memory-tab-content">
            <div className="map-breakdown-card">
              <h3 className="map-title">Classic 8051 Program ROM Map (4 KB: 0000H–0FFFH)</h3>
              <p className="map-desc">
                The lower memory addresses of on-chip ROM are reserved for hardware vectors that define where the CPU starts executing on system reset and interrupt events.
              </p>

              <div className="vector-table">
                <div className="vector-row header-row">
                  <span>ROM Address</span>
                  <span>Event / Interrupt Source</span>
                  <span>Typical Action</span>
                </div>
                <div className="vector-row reset-vector">
                  <span className="vec-addr">0000H</span>
                  <span className="vec-source">Power-On / System Reset</span>
                  <span className="vec-action">Branches to main code (e.g. <code>LJMP 0030H</code>)</span>
                </div>
                <div className="vector-row">
                  <span className="vec-addr">0003H</span>
                  <span className="vec-source">External Interrupt 0 (INT0#)</span>
                  <span className="vec-action">Triggered by low level or falling edge on pin P3.2</span>
                </div>
                <div className="vector-row">
                  <span className="vec-addr">000BH</span>
                  <span className="vec-source">Timer 0 Overflow (TF0)</span>
                  <span className="vec-action">Triggered when Timer 0 rolls over from FFH or FFFFH</span>
                </div>
                <div className="vector-row">
                  <span className="vec-addr">0013H</span>
                  <span className="vec-source">External Interrupt 1 (INT1#)</span>
                  <span className="vec-action">Triggered by low level or falling edge on pin P3.3</span>
                </div>
                <div className="vector-row">
                  <span className="vec-addr">001BH</span>
                  <span className="vec-source">Timer 1 Overflow (TF1)</span>
                  <span className="vec-action">Triggered when Timer 1 rolls over from FFH or FFFFH</span>
                </div>
                <div className="vector-row">
                  <span className="vec-addr">0023H</span>
                  <span className="vec-source">Serial Port (RI / TI)</span>
                  <span className="vec-action">Triggered when a byte is received or finished transmitting</span>
                </div>
                <div className="vector-row user-code-row">
                  <span className="vec-addr">0030H – 0FFFH</span>
                  <span className="vec-source">General User Program Memory Space</span>
                  <span className="vec-action">Main application code and lookup constant tables</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
