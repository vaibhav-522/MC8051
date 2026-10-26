import React from 'react';
import {
  SCON_REGISTER,
  SERIAL_MODES,
  BAUD_TABLE,
  PORTS,
  PORT3_PIN_MAP,
} from '../data/peripheralData';
import { RegisterBitGrid } from './RegisterBitGrid';
import { Cpu, ArrowLeftRight, Info, Send, Inbox } from 'lucide-react';

export const SerialIoSection: React.FC = () => {
  return (
    <section id="io-serial" className="io-serial-section">
      <div className="section-container">
        {/* Section Header */}
        <div className="section-title-wrap">
          <div className="section-badge">
            <Cpu size={14} />
            <span>Pins, Ports &amp; UART</span>
          </div>
          <h2 className="section-heading">I/O Ports &amp; Serial Communication</h2>
          <p className="section-subheading">
            The 8051 exposes all of its I/O through <strong>four 8-bit quasi-bidirectional ports</strong>{' '}
            and talks to the outside world over a <strong>full-duplex UART</strong>. Learn the pin
            structure, the Port 3 alternate-function map and how SCON/SBUF drive the four serial modes.
          </p>
        </div>

        {/* Four Port Cards */}
        <div className="ports-overview-grid">
          {PORTS.map((port) => (
            <div key={port.id} className="port-card">
              <div className="port-card-head">
                <h4 className="port-name">{port.name}</h4>
                <span className="port-label-chip">{port.alternateLabel}</span>
              </div>
              <div className="port-fact">
                <span className="port-fact-label">Special Role</span>
                <p>{port.specialFunction}</p>
              </div>
              <div className="port-fact">
                <span className="port-fact-label">Pin Structure</span>
                <p>{port.pinStructure}</p>
              </div>
              <div className="port-fact exam">
                <span className="port-fact-label">Exam Note</span>
                <p>{port.examNote}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quasi-bidirectional explainer */}
        <div className="subsection-head">
          <h3 className="subsection-title">
            <Info size={18} className="subsection-icon" />
            The Quasi-Bidirectional Pin — 3 Rules
          </h3>
        </div>

        <div className="rules-grid">
          <div className="rule-card">
            <span className="rule-number">1</span>
            <h5>Write 1 → make it an input</h5>
            <p>
              Ports have no direction register. Writing <code>1</code> to a port latch bit switches its
              output FET off, and the weak internal pull-up keeps the pin high — external logic can now
              pull it low freely.
            </p>
            <code className="rule-code">MOV P1, #0FFH ; all pins become inputs</code>
          </div>
          <div className="rule-card">
            <span className="rule-number">2</span>
            <h5>Read the pin, not the latch</h5>
            <p>
              <code>MOV A, P1</code> samples the actual pin voltage. But read-modify-write instructions
              (<code>INC P1</code>, <code>ANL P1, A</code>, <code>CPL P1.0</code>) act on the{' '}
              <em>stored latch value</em> — a classic gotcha when a pin is loaded externally.
            </p>
            <code className="rule-code">MOV A, P1 ; reads the physical pin</code>
          </div>
          <div className="rule-card">
            <span className="rule-number">3</span>
            <h5>Write 0 → drive low hard</h5>
            <p>
              A <code>0</code> in the latch turns the pull-down FET on and the pin sinks current — so a
              "high" sensor reading into a quasi-bidirectional pin relies on the weak pull-up. Only P0
              (open-drain) needs external resistors for high.
            </p>
            <code className="rule-code">CLR P1.0 ; LED on (active-low)</code>
          </div>
        </div>

        {/* Port 3 pin map */}
        <div className="subsection-head">
          <h3 className="subsection-title">Port 3 Alternate Functions</h3>
          <p className="subsection-sub">
            The single most-asked hardware table in 8051 vivas — every pin has a second job.
          </p>
        </div>

        <div className="intr-table-wrap">
          <table className="intr-table p3-table">
            <thead>
              <tr>
                <th>Pin</th>
                <th>Primary Function</th>
                <th>Alternate Function</th>
                <th>Direction</th>
              </tr>
            </thead>
            <tbody>
              {PORT3_PIN_MAP.map((row) => (
                <tr key={row.pin} className="intr-row">
                  <td>
                    <code className="bit-code pin-code">{row.pin}</code>
                  </td>
                  <td>{row.primary}</td>
                  <td className="alt-func-cell">{row.alternate}</td>
                  <td><span className="mode-pill">{row.direction}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ================= SERIAL PART ================= */}
        <div className="serial-divider">
          <ArrowLeftRight size={18} className="serial-divider-icon" />
          <span>Full-Duplex Serial Port (UART)</span>
        </div>

        {/* SBUF + SCON explainer */}
        <div className="sbuf-explain-grid">
          <div className="sbuf-card">
            <h4 className="sbuf-title">SBUF (99H) — Two Registers, One Address</h4>
            <p className="sbuf-text">
              <strong>SBUF</strong> is physically two separate registers sharing one address:
            </p>
            <ul className="sbuf-list">
              <li>
                <strong>Write to SBUF</strong> → loads the <em>transmit</em> shift register; the frame
                begins shifting out on TXD.
              </li>
              <li>
                <strong>Read from SBUF</strong> → returns the <em>receive</em> buffer, which holds the
                last complete frame even while the next one is arriving (double buffering).
              </li>
              <li>
                Writing a new byte to SBUF before TI = 1 overwrites the byte still being sent — always
                wait for <strong>TI</strong>.
              </li>
            </ul>
          </div>
          <div className="sbuf-card">
            <h4 className="sbuf-title">Baud Rate Generation</h4>
            <p className="sbuf-text">
              In UART modes 1 and 3 the baud rate comes from Timer 1 in{' '}
              <strong>8-bit auto-reload mode (mode 2)</strong>:
            </p>
            <code className="sbuf-formula">
              Baud = (2<sup>SMOD</sup> × fosc) ÷ (384 × (256 − TH1))
            </code>
            <p className="sbuf-text small">
              Mode 2 of the serial port instead uses a fixed fosc/64 (or /32 with SMOD = 1) divider.
              The 11.0592 MHz crystal exists precisely because it divides into standard baud rates
              with zero error.
            </p>
          </div>
        </div>

        {/* SCON register grid */}
        <div className="subsection-head">
          <h3 className="subsection-title">Configure with SCON (98H)</h3>
          <p className="subsection-sub">
            Click any bit cell — mode selection, receive enable, the 9th data bit and both interrupt
            flags live here.
          </p>
        </div>

        <div className="register-grid-single">
          <RegisterBitGrid register={SCON_REGISTER} accent="serial" />
        </div>

        {/* Serial Modes */}
        <div className="subsection-head">
          <h3 className="subsection-title">The Four Serial Modes (SM0 SM1)</h3>
        </div>

        <div className="serial-mode-grid">
          {SERIAL_MODES.map((mode) => (
            <div key={mode.id} className="serial-mode-card">
              <div className="serial-mode-head">
                <span className="serial-mode-sm">{mode.smBits}</span>
                <h5>{mode.name}</h5>
              </div>
              <div className="serial-mode-fact">
                <span className="sm-label">Frame</span>
                <p>{mode.frameFormat}</p>
              </div>
              <div className="serial-mode-fact">
                <span className="sm-label">Baud</span>
                <p>{mode.baudRate}</p>
              </div>
              <p className="serial-mode-desc">{mode.description}</p>
              <div className="serial-mode-use">
                <span className="sm-label">Used for</span>
                <p>{mode.typicalUse}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Baud Table */}
        <div className="subsection-head">
          <h3 className="subsection-title">Baud Rate Lookup — 11.0592 MHz Crystal</h3>
          <p className="subsection-sub">
            Timer 1 in mode 2 (TH1 holds the reload value). Common lab setup:{' '}
            <code>TMOD = #20H</code> (Timer 1, mode 2) → load TH1 → <code>SETB TR1</code> →{' '}
            <code>SETB REN</code>.
          </p>
        </div>

        <div className="instr-table-wrap">
          <table className="instr-table baud-table">
            <thead>
              <tr>
                <th className="num-col">Baud Rate</th>
                <th className="num-col">TH1 Reload</th>
                <th className="num-col">SMOD (PCON.7)</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {BAUD_TABLE.map((row) => (
                <tr key={row.baud + row.smod} className="instr-row">
                  <td className="num-col baud-value">{row.baud}</td>
                  <td className="num-col">
                    <code className="vector-code">{row.th1}</code>
                  </td>
                  <td className="num-col">{row.smod}</td>
                  <td className="baud-note">{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* TX / RX workflows */}
        <div className="txrx-grid">
          <div className="txrx-card">
            <div className="txrx-head">
              <Send size={17} className="txrx-icon" />
              <h4>Transmitting a byte</h4>
            </div>
            <ol className="txrx-steps">
              <li>
                Set up serial mode: <code>MOV SCON, #40H</code> (mode 1, REN off)
              </li>
              <li>
                Start Timer 1 as baud generator: <code>MOV TMOD, #20H</code> →{' '}
                <code>MOV TH1, #0FDH</code> → <code>SETB TR1</code>
              </li>
              <li>
                Write the byte: <code>MOV SBUF, #'A'</code> — framing and shifting start immediately
              </li>
              <li>
                Wait for completion: <code>JNB TI, $</code>
              </li>
              <li>
                Clear the flag in software: <code>CLR TI</code>, then send the next byte
              </li>
            </ol>
          </div>
          <div className="txrx-card">
            <div className="txrx-head">
              <Inbox size={17} className="txrx-icon" />
              <h4>Receiving a byte</h4>
            </div>
            <ol className="txrx-steps">
              <li>
                Enable reception: <code>SETB REN</code> (plus the same mode/baud setup)
              </li>
              <li>Wait for a complete frame: <code>JNB RI, $</code></li>
              <li>
                Read it immediately: <code>MOV A, SBUF</code> — reading SBUF empties the receive buffer
              </li>
              <li>
                Clear the flag: <code>CLR RI</code>
              </li>
              <li>
                Multi-processor links also inspect <code>RB8</code> and <code>SM2</code> to tell
                address bytes from data bytes
              </li>
            </ol>
          </div>
        </div>

        {/* PCON note */}
        <div className="pcon-note">
          <strong>PCON (87H):</strong> only <strong>SMOD (bit 7)</strong> matters for serial — it
          doubles the baud rate when set. The lower bits (GF1, GF0, PD, IDL) control idle/power-down
          modes and are unrelated to communication. PCON is not bit-addressable, so use{' '}
          <code>ANL PCON, #7FH</code> to clear SMOD or <code>ORL PCON, #80H</code> to set it.
        </div>
      </div>
    </section>
  );
};
