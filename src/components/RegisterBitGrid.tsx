import React, { useState } from 'react';
import type { SpecialRegister } from '../types';

interface RegisterBitGridProps {
  register: SpecialRegister;
  /** Optional accent color override for the register card */
  accent?: 'timer' | 'interrupt' | 'serial';
}

/**
 * Interactive 8-bit Special Function Register diagram.
 * Click any bit cell to read what that bit does.
 */
export const RegisterBitGrid: React.FC<RegisterBitGridProps> = ({ register, accent = 'timer' }) => {
  // Default selection: first non-reserved bit, so the panel is never empty
  const defaultBit =
    register.bits.find((b) => b.name !== null) ?? register.bits[0];
  const [selectedPos, setSelectedPos] = useState<number>(defaultBit.position);

  const selectedBit = register.bits.find((b) => b.position === selectedPos) ?? register.bits[0];

  return (
    <div className={`register-card accent-${accent}`}>
      {/* Register header */}
      <div className="register-header">
        <div className="register-title-group">
          <span className="register-name">{register.name}</span>
          <span className="register-address">Address {register.address}</span>
          <span className="register-addressable">
            {['tcon', 'ie', 'ip', 'scon'].includes(register.id)
              ? 'Bit-addressable ✓'
              : 'Byte-access only'}
          </span>
        </div>
      </div>

      <p className="register-purpose">{register.purpose}</p>

      {/* Bit cells: rendered high → low (7 on the left, 0 on the right) */}
      <div className="register-bit-row" role="group" aria-label={`${register.name} bits`}>
        {register.bits.map((bit) => (
          <button
            key={bit.position}
            className={`register-bit-cell group-${bit.group} ${selectedPos === bit.position ? 'selected' : ''} ${bit.name === null ? 'reserved' : ''}`}
            onClick={() => setSelectedPos(bit.position)}
            aria-pressed={selectedPos === bit.position}
            title={`Bit ${bit.position}${bit.name ? `: ${bit.name}` : ' (reserved)'}`}
          >
            <span className="bit-index">{bit.position}</span>
            <span className="bit-name">{bit.name ?? '—'}</span>
          </button>
        ))}
      </div>

      {/* Selected bit explanation */}
      <div className="register-bit-detail">
        <div className="bit-detail-head">
          <code className="bit-detail-code">
            {selectedBit.name ?? `Bit ${selectedBit.position}`}
          </code>
          <span className="bit-detail-pos">
            {register.name}.{selectedBit.position}
          </span>
        </div>
        <p className="bit-detail-desc">{selectedBit.description}</p>
      </div>
    </div>
  );
};
