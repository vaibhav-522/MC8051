import React from 'react';


interface ArchitectureDiagramProps {
  selectedBlockId: string | null;
  onSelectBlock: (blockId: string) => void;
}

export const ArchitectureDiagram: React.FC<ArchitectureDiagramProps> = ({
  selectedBlockId,
  onSelectBlock,
}) => {
  const isSelected = (id: string) => selectedBlockId === id;

  const handleKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelectBlock(id);
    }
  };

  return (
    <div className="diagram-wrapper">
      <div className="diagram-instructions">
        <span className="diagram-hint-pulse" />
        <span className="diagram-hint-text">
          Click any component below to inspect its purpose, register details, and practical examples.
        </span>
      </div>

      <div className="svg-container">
        <svg
          viewBox="0 0 1060 690"
          className="architecture-svg"
          role="group"
          aria-label="Classic 8051 Microcontroller Architecture Block Diagram"
        >
          <defs>
            {/* Glow filter for selected block */}
            <filter id="cyanGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* Subtle drop shadow for cards */}
            <filter id="boxShadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#1e3a8a" floodOpacity="0.15" />
            </filter>

            {/* Bus Arrow Marker */}
            <marker
              id="busArrow"
              viewBox="0 0 10 10"
              refX="6"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#0ea5e9" />
            </marker>

            {/* Down Arrow Marker */}
            <marker
              id="downArrow"
              viewBox="0 0 10 10"
              refX="5"
              refY="6"
              markerWidth="6"
              markerHeight="6"
              orient="auto"
            >
              <path d="M 1 0 L 5 10 L 9 0 z" fill="#0369a1" />
            </marker>

            {/* Up Arrow Marker */}
            <marker
              id="upArrow"
              viewBox="0 0 10 10"
              refX="5"
              refY="4"
              markerWidth="6"
              markerHeight="6"
              orient="auto"
            >
              <path d="M 1 10 L 5 0 L 9 10 z" fill="#0369a1" />
            </marker>

            {/* Diagonal Bus Hatch Pattern */}
            <pattern id="busPattern" width="12" height="12" patternUnits="userSpaceOnUse">
              <path d="M 0 12 L 12 0 M 6 18 L 18 6 M -6 6 L 6 -6" stroke="#0ea5e9" strokeWidth="1.2" strokeOpacity="0.25" />
            </pattern>
          </defs>

          {/* Background Canvas */}
          <rect width="1060" height="690" rx="16" fill="#f0f7ff" stroke="#bfdbfe" strokeWidth="1.5" />

          {/* ======================================================== */}
          {/* GROUP SECTION BOUNDARIES (Subtle dashed regions)        */}
          {/* ======================================================== */}

          {/* Section 1: CPU Core & Arithmetic (Top Left) */}
          <rect
            x="35"
            y="25"
            width="465"
            height="275"
            rx="12"
            fill="#ffffff"
            fillOpacity="0.6"
            stroke="#dbeafe"
            strokeWidth="1.2"
            strokeDasharray="4 4"
          />
          <text x="50" y="48" fill="#0369a1" fontSize="12" fontWeight="700" letterSpacing="1.2">
            CPU CORE &amp; ARITHMETIC UNIT
          </text>

          {/* Section 2: Timing, Control & Pointers (Top Right) */}
          <rect
            x="525"
            y="25"
            width="500"
            height="275"
            rx="12"
            fill="#ffffff"
            fillOpacity="0.6"
            stroke="#dbeafe"
            strokeWidth="1.2"
            strokeDasharray="4 4"
          />
          <text x="540" y="48" fill="#0369a1" fontSize="12" fontWeight="700" letterSpacing="1.2">
            TIMING, CONTROL &amp; POINTERS
          </text>

          {/* Section 3: Internal Memory System (Bottom Left) */}
          <rect
            x="35"
            y="370"
            width="465"
            height="295"
            rx="12"
            fill="#ffffff"
            fillOpacity="0.6"
            stroke="#dbeafe"
            strokeWidth="1.2"
            strokeDasharray="4 4"
          />
          <text x="50" y="393" fill="#0369a1" fontSize="12" fontWeight="700" letterSpacing="1.2">
            ON-CHIP MEMORY SYSTEM (HARVARD ARCHITECTURE)
          </text>

          {/* Section 4: Peripherals & Parallel I/O (Bottom Right) */}
          <rect
            x="525"
            y="370"
            width="500"
            height="295"
            rx="12"
            fill="#ffffff"
            fillOpacity="0.6"
            stroke="#dbeafe"
            strokeWidth="1.2"
            strokeDasharray="4 4"
          />
          <text x="540" y="393" fill="#0369a1" fontSize="12" fontWeight="700" letterSpacing="1.2">
            PERIPHERALS &amp; PARALLEL I/O PORTS
          </text>

          {/* ======================================================== */}
          {/* CENTRAL INTERNAL 8-BIT DATA BUS                          */}
          {/* ======================================================== */}
          <g className="system-bus-group">
            {/* Bus Glow / Drop shadow */}
            <rect
              x="55"
              y="320"
              width="950"
              height="28"
              rx="6"
              fill="#dbeafe"
              stroke="#0ea5e9"
              strokeWidth="1.8"
            />
            {/* Bus Hatch Fill */}
            <rect
              x="55"
              y="320"
              width="950"
              height="28"
              rx="6"
              fill="url(#busPattern)"
            />
            {/* Bus Label */}
            <text
              x="530"
              y="338"
              fill="#0ea5e9"
              fontSize="12"
              fontWeight="800"
              letterSpacing="2.5"
              textAnchor="middle"
            >
              ⇄ INTERNAL 8-BIT SYSTEM DATA BUS ⇄
            </text>
          </g>

          {/* ======================================================== */}
          {/* BUS CONNECTION LINES (Vertical taps to central bus)       */}
          {/* ======================================================== */}
          {/* ALU to Bus */}
          <line x1="267" y1="218" x2="267" y2="320" stroke="#0ea5e9" strokeWidth="2" strokeDasharray="3 3" />
          {/* PSW to Bus */}
          <line x1="420" y1="270" x2="420" y2="320" stroke="#0ea5e9" strokeWidth="2" strokeDasharray="3 3" />
          {/* SP to Bus (routed left of the PC block) */}
          <line x1="560" y1="205" x2="560" y2="320" stroke="#0ea5e9" strokeWidth="2" strokeDasharray="3 3" />
          {/* DPTR to Bus (routed right of the PC block) */}
          <line x1="950" y1="205" x2="950" y2="320" stroke="#0ea5e9" strokeWidth="2" strokeDasharray="3 3" />
          {/* PC to Bus */}
          <line x1="770" y1="285" x2="770" y2="320" stroke="#0ea5e9" strokeWidth="2" strokeDasharray="3 3" />

          {/* ROM from Bus */}
          <line x1="160" y1="348" x2="160" y2="415" stroke="#0ea5e9" strokeWidth="2" strokeDasharray="3 3" />
          {/* RAM from Bus */}
          <line x1="360" y1="348" x2="360" y2="415" stroke="#0ea5e9" strokeWidth="2" strokeDasharray="3 3" />
          {/* Timers to Bus */}
          <line x1="640" y1="348" x2="640" y2="415" stroke="#0ea5e9" strokeWidth="2" strokeDasharray="3 3" />
          {/* Serial to Bus */}
          <line x1="885" y1="348" x2="885" y2="415" stroke="#0ea5e9" strokeWidth="2" strokeDasharray="3 3" />
          {/* I/O Ports to Bus */}
          <line x1="770" y1="348" x2="770" y2="510" stroke="#0ea5e9" strokeWidth="2" strokeDasharray="3 3" />

          {/* ======================================================== */}
          {/* SECTION 1: CPU BLOCKS (Top Left)                         */}
          {/* ======================================================== */}

          {/* 1. Accumulator (A) */}
          <g
            className={`diagram-block ${isSelected('acc') ? 'selected' : ''}`}
            onClick={() => onSelectBlock('acc')}
            onKeyDown={(e) => handleKeyDown(e, 'acc')}
            tabIndex={0}
            role="button"
            aria-label="Accumulator (Register A)"
            filter="url(#boxShadow)"
          >
            <rect
              x="55"
              y="65"
              width="195"
              height="60"
              rx="8"
              className="block-rect"
              filter={isSelected('acc') ? 'url(#cyanGlow)' : undefined}
            />
            <text x="70" y="92" className="block-title">Accumulator (A)</text>
            <text x="70" y="112" className="block-sub">8-bit Register • SFR 0xE0</text>
            <rect x="195" y="73" width="45" height="18" rx="4" className="badge-rect" />
            <text x="217" y="86" className="badge-text" textAnchor="middle">8-BIT</text>
          </g>

          {/* 2. B Register */}
          <g
            className={`diagram-block ${isSelected('b-reg') ? 'selected' : ''}`}
            onClick={() => onSelectBlock('b-reg')}
            onKeyDown={(e) => handleKeyDown(e, 'b-reg')}
            tabIndex={0}
            role="button"
            aria-label="B Register"
            filter="url(#boxShadow)"
          >
            <rect
              x="280"
              y="65"
              width="195"
              height="60"
              rx="8"
              className="block-rect"
              filter={isSelected('b-reg') ? 'url(#cyanGlow)' : undefined}
            />
            <text x="295" y="92" className="block-title">B Register</text>
            <text x="295" y="112" className="block-sub">MUL/DIV Helper • SFR 0xF0</text>
            <rect x="420" y="73" width="45" height="18" rx="4" className="badge-rect" />
            <text x="442" y="86" className="badge-text" textAnchor="middle">8-BIT</text>
          </g>

          {/* Feed lines from A and B into ALU */}
          <path d="M 152 125 L 152 145 L 210 145 L 210 155" stroke="#0ea5e9" strokeWidth="1.8" fill="none" markerEnd="url(#downArrow)" />
          <path d="M 377 125 L 377 145 L 324 145 L 324 155" stroke="#0ea5e9" strokeWidth="1.8" fill="none" markerEnd="url(#downArrow)" />

          {/* 3. CPU & ALU */}
          <g
            className={`diagram-block ${isSelected('cpu-alu') ? 'selected' : ''}`}
            onClick={() => onSelectBlock('cpu-alu')}
            onKeyDown={(e) => handleKeyDown(e, 'cpu-alu')}
            tabIndex={0}
            role="button"
            aria-label="CPU and ALU"
            filter="url(#boxShadow)"
          >
            <rect
              x="145"
              y="155"
              width="240"
              height="65"
              rx="8"
              className="block-rect highlight-core"
              filter={isSelected('cpu-alu') ? 'url(#cyanGlow)' : undefined}
            />
            <text x="160" y="183" className="block-title highlight-text">CPU &amp; ALU</text>
            <text x="160" y="204" className="block-sub">8-bit Arithmetic, Logic &amp; Boolean</text>
            <rect x="330" y="163" width="45" height="18" rx="4" className="badge-rect core-badge" />
            <text x="352" y="176" className="badge-text" textAnchor="middle">CORE</text>
          </g>

          {/* Connection from ALU to PSW */}
          <path d="M 265 220 L 265 235" stroke="#0ea5e9" strokeWidth="1.8" fill="none" markerEnd="url(#downArrow)" />

          {/* 4. Program Status Word (PSW) */}
          <g
            className={`diagram-block ${isSelected('psw') ? 'selected' : ''}`}
            onClick={() => onSelectBlock('psw')}
            onKeyDown={(e) => handleKeyDown(e, 'psw')}
            tabIndex={0}
            role="button"
            aria-label="Program Status Word (PSW)"
            filter="url(#boxShadow)"
          >
            <rect
              x="145"
              y="235"
              width="240"
              height="55"
              rx="8"
              className="block-rect"
              filter={isSelected('psw') ? 'url(#cyanGlow)' : undefined}
            />
            <text x="160" y="258" className="block-title">Program Status Word (PSW)</text>
            <text x="160" y="277" className="block-sub">Flags: CY, AC, F0, RS1, RS0, OV, P</text>
            <rect x="330" y="243" width="45" height="18" rx="4" className="badge-rect" />
            <text x="352" y="256" className="badge-text" textAnchor="middle">FLAGS</text>
          </g>

          {/* ======================================================== */}
          {/* SECTION 2: TIMING, CONTROL & POINTERS (Top Right)        */}
          {/* ======================================================== */}

          {/* 5. Oscillator & Clock Circuitry */}
          <g
            className={`diagram-block ${isSelected('oscillator') ? 'selected' : ''}`}
            onClick={() => onSelectBlock('oscillator')}
            onKeyDown={(e) => handleKeyDown(e, 'oscillator')}
            tabIndex={0}
            role="button"
            aria-label="Oscillator and Clock Circuitry"
            filter="url(#boxShadow)"
          >
            <rect
              x="545"
              y="65"
              width="220"
              height="60"
              rx="8"
              className="block-rect"
              filter={isSelected('oscillator') ? 'url(#cyanGlow)' : undefined}
            />
            <text x="560" y="90" className="block-title">Oscillator &amp; Clock</text>
            <text x="560" y="112" className="block-sub">XTAL1 / XTAL2 • ÷12 Machine Cycle</text>
            <rect x="705" y="73" width="50" height="18" rx="4" className="badge-rect" />
            <text x="730" y="86" className="badge-text" textAnchor="middle">CLOCK</text>
          </g>

          {/* 6. Interrupt Control */}
          <g
            className={`diagram-block ${isSelected('interrupts') ? 'selected' : ''}`}
            onClick={() => onSelectBlock('interrupts')}
            onKeyDown={(e) => handleKeyDown(e, 'interrupts')}
            tabIndex={0}
            role="button"
            aria-label="Interrupt Control"
            filter="url(#boxShadow)"
          >
            <rect
              x="785"
              y="65"
              width="225"
              height="60"
              rx="8"
              className="block-rect"
              filter={isSelected('interrupts') ? 'url(#cyanGlow)' : undefined}
            />
            <text x="800" y="90" className="block-title">Interrupt Control</text>
            <text x="800" y="112" className="block-sub">5 Sources • 2 Priorities (IE/IP)</text>
            <rect x="945" y="73" width="55" height="18" rx="4" className="badge-rect" />
            <text x="972" y="86" className="badge-text" textAnchor="middle">5 INTR</text>
          </g>

          {/* 7. Stack Pointer (SP) */}
          <g
            className={`diagram-block ${isSelected('sp') ? 'selected' : ''}`}
            onClick={() => onSelectBlock('sp')}
            onKeyDown={(e) => handleKeyDown(e, 'sp')}
            tabIndex={0}
            role="button"
            aria-label="Stack Pointer (SP)"
            filter="url(#boxShadow)"
          >
            <rect
              x="545"
              y="148"
              width="220"
              height="58"
              rx="8"
              className="block-rect"
              filter={isSelected('sp') ? 'url(#cyanGlow)' : undefined}
            />
            <text x="560" y="173" className="block-title">Stack Pointer (SP)</text>
            <text x="560" y="194" className="block-sub">8-bit Pointer to RAM • Reset: 07H</text>
            <rect x="710" y="156" width="45" height="18" rx="4" className="badge-rect" />
            <text x="732" y="169" className="badge-text" textAnchor="middle">8-BIT</text>
          </g>

          {/* 8. Data Pointer (DPTR) */}
          <g
            className={`diagram-block ${isSelected('dptr') ? 'selected' : ''}`}
            onClick={() => onSelectBlock('dptr')}
            onKeyDown={(e) => handleKeyDown(e, 'dptr')}
            tabIndex={0}
            role="button"
            aria-label="Data Pointer (DPTR)"
            filter="url(#boxShadow)"
          >
            <rect
              x="785"
              y="148"
              width="225"
              height="58"
              rx="8"
              className="block-rect"
              filter={isSelected('dptr') ? 'url(#cyanGlow)' : undefined}
            />
            <text x="800" y="173" className="block-title">Data Pointer (DPTR)</text>
            <text x="800" y="194" className="block-sub">16-bit: DPH (0x83) + DPL (0x82)</text>
            <rect x="945" y="156" width="55" height="18" rx="4" className="badge-rect" />
            <text x="972" y="169" className="badge-text" textAnchor="middle">16-BIT</text>
          </g>

          {/* 9. Program Counter (PC) */}
          <g
            className={`diagram-block ${isSelected('pc') ? 'selected' : ''}`}
            onClick={() => onSelectBlock('pc')}
            onKeyDown={(e) => handleKeyDown(e, 'pc')}
            tabIndex={0}
            role="button"
            aria-label="Program Counter (PC)"
            filter="url(#boxShadow)"
          >
            <rect
              x="630"
              y="228"
              width="280"
              height="58"
              rx="8"
              className="block-rect highlight-pointer"
              filter={isSelected('pc') ? 'url(#cyanGlow)' : undefined}
            />
            <text x="645" y="253" className="block-title">Program Counter (PC)</text>
            <text x="645" y="274" className="block-sub">16-bit Code Pointer + Auto-Incrementer</text>
            <rect x="845" y="236" width="55" height="18" rx="4" className="badge-rect" />
            <text x="872" y="249" className="badge-text" textAnchor="middle">16-BIT</text>
          </g>

          {/* ======================================================== */}
          {/* SECTION 3: INTERNAL MEMORY (Bottom Left)                 */}
          {/* ======================================================== */}

          {/* 10. Program ROM */}
          <g
            className={`diagram-block ${isSelected('rom') ? 'selected' : ''}`}
            onClick={() => onSelectBlock('rom')}
            onKeyDown={(e) => handleKeyDown(e, 'rom')}
            tabIndex={0}
            role="button"
            aria-label="Program ROM"
            filter="url(#boxShadow)"
          >
            <rect
              x="55"
              y="410"
              width="205"
              height="80"
              rx="8"
              className="block-rect highlight-mem"
              filter={isSelected('rom') ? 'url(#cyanGlow)' : undefined}
            />
            <text x="70" y="438" className="block-title">Program ROM</text>
            <text x="70" y="458" className="block-sub">4 KB On-Chip Code Memory</text>
            <text x="70" y="476" className="block-mono">Addr: 0000H – 0FFFH</text>
            <rect x="200" y="418" width="50" height="18" rx="4" className="badge-rect mem-badge" />
            <text x="225" y="431" className="badge-text" textAnchor="middle">4 KB</text>
          </g>

          {/* 11. Internal Data RAM Container */}
          <g
            className={`diagram-block ${isSelected('ram') ? 'selected' : ''}`}
            onClick={() => onSelectBlock('ram')}
            onKeyDown={(e) => handleKeyDown(e, 'ram')}
            tabIndex={0}
            role="button"
            aria-label="Internal Data RAM"
            filter="url(#boxShadow)"
          >
            <rect
              x="275"
              y="410"
              width="210"
              height="80"
              rx="8"
              className="block-rect highlight-mem"
              filter={isSelected('ram') ? 'url(#cyanGlow)' : undefined}
            />
            <text x="290" y="438" className="block-title">Internal RAM</text>
            <text x="290" y="458" className="block-sub">128 Bytes Data RAM</text>
            <text x="290" y="476" className="block-mono">Addr: 00H – 7FH</text>
            <rect x="420" y="418" width="55" height="18" rx="4" className="badge-rect mem-badge" />
            <text x="447" y="431" className="badge-text" textAnchor="middle">128 B</text>
          </g>

          {/* 12. Register Banks R0-R7 (Sub-region inside memory space) */}
          <g
            className={`diagram-block ${isSelected('reg-banks') ? 'selected' : ''}`}
            onClick={() => onSelectBlock('reg-banks')}
            onKeyDown={(e) => handleKeyDown(e, 'reg-banks')}
            tabIndex={0}
            role="button"
            aria-label="Register Banks R0 to R7"
            filter="url(#boxShadow)"
          >
            <rect
              x="55"
              y="515"
              width="430"
              height="130"
              rx="8"
              className="block-rect"
              filter={isSelected('reg-banks') ? 'url(#cyanGlow)' : undefined}
            />
            <text x="75" y="542" className="block-title">Working Register Banks (R0–R7)</text>
            <text x="75" y="562" className="block-sub">
              Located in Internal RAM 00H–1FH (4 Banks × 8 Registers = 32 Bytes)
            </text>

            {/* 4 Bank Mini Grid */}
            <g className="bank-boxes">
              {/* Bank 0 */}
              <rect x="75" y="575" width="95" height="52" rx="4" fill="#eff6ff" stroke="#93c5fd" />
              <text x="122" y="595" fill="#1e3a8a" fontSize="11" fontWeight="700" textAnchor="middle">Bank 0</text>
              <text x="122" y="613" fill="#0369a1" fontSize="10" fontFamily="monospace" textAnchor="middle">00H–07H</text>

              {/* Bank 1 */}
              <rect x="180" y="575" width="95" height="52" rx="4" fill="#eff6ff" stroke="#93c5fd" />
              <text x="227" y="595" fill="#1e3a8a" fontSize="11" fontWeight="700" textAnchor="middle">Bank 1</text>
              <text x="227" y="613" fill="#0369a1" fontSize="10" fontFamily="monospace" textAnchor="middle">08H–0FH</text>

              {/* Bank 2 */}
              <rect x="285" y="575" width="95" height="52" rx="4" fill="#eff6ff" stroke="#93c5fd" />
              <text x="332" y="595" fill="#1e3a8a" fontSize="11" fontWeight="700" textAnchor="middle">Bank 2</text>
              <text x="332" y="613" fill="#0369a1" fontSize="10" fontFamily="monospace" textAnchor="middle">10H–17H</text>

              {/* Bank 3 */}
              <rect x="390" y="575" width="85" height="52" rx="4" fill="#eff6ff" stroke="#93c5fd" />
              <text x="432" y="595" fill="#1e3a8a" fontSize="11" fontWeight="700" textAnchor="middle">Bank 3</text>
              <text x="432" y="613" fill="#0369a1" fontSize="10" fontFamily="monospace" textAnchor="middle">18H–1FH</text>
            </g>

            <rect x="415" y="525" width="60" height="18" rx="4" className="badge-rect" />
            <text x="445" y="538" className="badge-text" textAnchor="middle">32 BYTES</text>
          </g>

          {/* ======================================================== */}
          {/* SECTION 4: PERIPHERALS & I/O (Bottom Right)              */}
          {/* ======================================================== */}

          {/* 13. Timers / Counters (T0 & T1) */}
          <g
            className={`diagram-block ${isSelected('timers') ? 'selected' : ''}`}
            onClick={() => onSelectBlock('timers')}
            onKeyDown={(e) => handleKeyDown(e, 'timers')}
            tabIndex={0}
            role="button"
            aria-label="Timers and Counters T0 and T1"
            filter="url(#boxShadow)"
          >
            <rect
              x="545"
              y="410"
              width="220"
              height="75"
              rx="8"
              className="block-rect"
              filter={isSelected('timers') ? 'url(#cyanGlow)' : undefined}
            />
            <text x="560" y="435" className="block-title">Timers / Counters</text>
            <text x="560" y="455" className="block-sub">Timer 0 (TH0/TL0) &amp; Timer 1 (TH1/TL1)</text>
            <text x="560" y="473" className="block-mono">Modes: TMOD (0x89) • TCON (0x88)</text>
            <rect x="705" y="418" width="50" height="18" rx="4" className="badge-rect" />
            <text x="730" y="431" className="badge-text" textAnchor="middle">2 × 16b</text>
          </g>

          {/* 14. Serial Communication Unit (UART) */}
          <g
            className={`diagram-block ${isSelected('serial') ? 'selected' : ''}`}
            onClick={() => onSelectBlock('serial')}
            onKeyDown={(e) => handleKeyDown(e, 'serial')}
            tabIndex={0}
            role="button"
            aria-label="Serial Communication Unit"
            filter="url(#boxShadow)"
          >
            <rect
              x="785"
              y="410"
              width="225"
              height="75"
              rx="8"
              className="block-rect"
              filter={isSelected('serial') ? 'url(#cyanGlow)' : undefined}
            />
            <text x="800" y="435" className="block-title">Serial Port (UART)</text>
            <text x="800" y="455" className="block-sub">Full-Duplex • SBUF (0x99) &amp; SCON</text>
            <text x="800" y="473" className="block-mono">Pins: RXD (P3.0) &amp; TXD (P3.1)</text>
            <rect x="950" y="418" width="50" height="18" rx="4" className="badge-rect" />
            <text x="975" y="431" className="badge-text" textAnchor="middle">UART</text>
          </g>

          {/* 15. Four I/O Ports (P0, P1, P2, P3) */}
          <g
            className={`diagram-block ${isSelected('io-ports') ? 'selected' : ''}`}
            onClick={() => onSelectBlock('io-ports')}
            onKeyDown={(e) => handleKeyDown(e, 'io-ports')}
            tabIndex={0}
            role="button"
            aria-label="Four I/O Ports: Port 0, Port 1, Port 2, Port 3"
            filter="url(#boxShadow)"
          >
            <rect
              x="545"
              y="505"
              width="465"
              height="140"
              rx="8"
              className="block-rect highlight-io"
              filter={isSelected('io-ports') ? 'url(#cyanGlow)' : undefined}
            />
            <text x="565" y="532" className="block-title">Four Parallel I/O Ports (P0, P1, P2, P3)</text>
            <text x="565" y="551" className="block-sub">
              32 Bidirectional Programmable I/O Lines with Latches &amp; Drivers
            </text>

            {/* Sub-cards for P0, P1, P2, P3 */}
            <g className="ports-grid">
              {/* Port 0 */}
              <rect x="565" y="565" width="100" height="65" rx="5" fill="#eff6ff" stroke="#93c5fd" />
              <text x="615" y="587" fill="#1e3a8a" fontSize="12" fontWeight="700" textAnchor="middle">Port 0</text>
              <text x="615" y="605" fill="#0369a1" fontSize="10" fontFamily="monospace" textAnchor="middle">AD0–AD7</text>
              <text x="615" y="621" fill="#64748b" fontSize="9" textAnchor="middle">Open Drain</text>

              {/* Port 1 */}
              <rect x="675" y="565" width="100" height="65" rx="5" fill="#eff6ff" stroke="#93c5fd" />
              <text x="725" y="587" fill="#1e3a8a" fontSize="12" fontWeight="700" textAnchor="middle">Port 1</text>
              <text x="725" y="605" fill="#0369a1" fontSize="10" fontFamily="monospace" textAnchor="middle">P1.0–P1.7</text>
              <text x="725" y="621" fill="#64748b" fontSize="9" textAnchor="middle">General I/O</text>

              {/* Port 2 */}
              <rect x="785" y="565" width="100" height="65" rx="5" fill="#eff6ff" stroke="#93c5fd" />
              <text x="835" y="587" fill="#1e3a8a" fontSize="12" fontWeight="700" textAnchor="middle">Port 2</text>
              <text x="835" y="605" fill="#0369a1" fontSize="10" fontFamily="monospace" textAnchor="middle">A8–A15</text>
              <text x="835" y="621" fill="#64748b" fontSize="9" textAnchor="middle">High Addr Bus</text>

              {/* Port 3 */}
              <rect x="895" y="565" width="100" height="65" rx="5" fill="#eff6ff" stroke="#93c5fd" />
              <text x="945" y="587" fill="#1e3a8a" fontSize="12" fontWeight="700" textAnchor="middle">Port 3</text>
              <text x="945" y="605" fill="#0369a1" fontSize="10" fontFamily="monospace" textAnchor="middle">P3.0–P3.7</text>
              <text x="945" y="621" fill="#64748b" fontSize="9" textAnchor="middle">Alt Functions</text>
            </g>

            <rect x="940" y="515" width="60" height="18" rx="4" className="badge-rect" />
            <text x="970" y="528" className="badge-text" textAnchor="middle">32 PINS</text>
          </g>
        </svg>
      </div>

      <div className="diagram-legend">
        <div className="legend-item">
          <span className="legend-dot core" />
          <span>CPU &amp; Arithmetic Registers</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot memory" />
          <span>On-Chip Memory (RAM / ROM)</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot control" />
          <span>Control, Pointers &amp; Timing</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot peripherals" />
          <span>Peripherals &amp; Parallel I/O Ports</span>
        </div>
        <div className="legend-item">
          <span className="legend-line bus" />
          <span>Internal 8-bit System Bus</span>
        </div>
      </div>
    </div>
  );
};
