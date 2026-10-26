import React, { useMemo, useState } from 'react';
import {
  INSTRUCTION_SET,
  INSTRUCTION_CATEGORIES,
  OPERAND_SYMBOL_KEY,
  FLAG_LEGEND,
} from '../data/instructionSetData';
import { Terminal, Search, Zap, Hash, Timer, XCircle } from 'lucide-react';

export const InstructionSetSection: React.FC = () => {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Per-category counts (memoised so pills stay cheap to re-render)
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: INSTRUCTION_SET.length };
    for (const cat of INSTRUCTION_CATEGORIES) {
      counts[cat.id] = INSTRUCTION_SET.filter((i) => i.category === cat.id).length;
    }
    return counts;
  }, []);

  const filteredInstructions = useMemo(() => {
    const q = query.trim().toLowerCase();
    return INSTRUCTION_SET.filter((ins) => {
      const matchesCategory = activeCategory === 'all' || ins.category === activeCategory;
      if (!matchesCategory) return false;
      if (!q) return true;
      return (
        ins.mnemonic.toLowerCase().includes(q) ||
        ins.description.toLowerCase().includes(q) ||
        ins.example.toLowerCase().includes(q) ||
        ins.addressingMode.toLowerCase().includes(q) ||
        ins.opcode.toLowerCase().includes(q)
      );
    });
  }, [query, activeCategory]);

  const singleCycleCount = INSTRUCTION_SET.filter((i) => i.machineCycles === 1).length;
  const activeCategoryMeta = INSTRUCTION_CATEGORIES.find((c) => c.id === activeCategory);

  return (
    <section id="instructions" className="instruction-section">
      <div className="section-container">
        {/* Section Header */}
        <div className="section-title-wrap">
          <div className="section-badge">
            <Terminal size={14} />
            <span>Complete Assembly Reference</span>
          </div>
          <h2 className="section-heading">8051 Instruction Set</h2>
          <p className="section-subheading">
            Every instruction of the classic MCS-51 core, grouped by function. Look up the mnemonic,
            its addressing mode, size in bytes, execution time in machine cycles and the status flags it
            modifies — everything a lab exam or assembly program needs in one table.
          </p>
        </div>

        {/* Stats Strip */}
        <div className="instr-stats-strip">
          <div className="instr-stat">
            <Hash size={16} className="instr-stat-icon" />
            <span className="instr-stat-value">{INSTRUCTION_SET.length}</span>
            <span className="instr-stat-label">Instruction Forms</span>
          </div>
          <div className="instr-stat">
            <Zap size={16} className="instr-stat-icon" />
            <span className="instr-stat-value">{singleCycleCount}</span>
            <span className="instr-stat-label">Single-Cycle (1 µs @ 12 MHz)</span>
          </div>
          <div className="instr-stat">
            <Timer size={16} className="instr-stat-icon" />
            <span className="instr-stat-value">12</span>
            <span className="instr-stat-label">Clocks per Machine Cycle</span>
          </div>
          <div className="instr-stat">
            <XCircle size={16} className="instr-stat-icon" />
            <span className="instr-stat-value">5</span>
            <span className="instr-stat-label">Addressing Modes</span>
          </div>
        </div>

        {/* Search + Category Filters */}
        <div className="instr-toolbar">
          <div className="instr-search-box">
            <Search size={16} className="instr-search-icon" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search mnemonic, operand or description… (e.g. MOV, SUBB, timer)"
              className="instr-search-input"
              aria-label="Search instructions"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="instr-search-clear"
                aria-label="Clear search"
              >
                <XCircle size={15} />
              </button>
            )}
          </div>

          <div className="instr-category-pills">
            <button
              onClick={() => setActiveCategory('all')}
              className={`instr-cat-pill ${activeCategory === 'all' ? 'active' : ''}`}
            >
              <span>All</span>
              <span className="instr-cat-count">{categoryCounts.all}</span>
            </button>
            {INSTRUCTION_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`instr-cat-pill cat-${cat.id} ${activeCategory === cat.id ? 'active' : ''}`}
              >
                <span>{cat.label}</span>
                <span className="instr-cat-count">{categoryCounts[cat.id]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Active category description banner */}
        {activeCategoryMeta && (
          <div className={`instr-cat-banner cat-${activeCategoryMeta.id}`}>
            <strong>{activeCategoryMeta.label}:</strong> {activeCategoryMeta.description}
          </div>
        )}

        {/* Results count */}
        <div className="instr-results-meta">
          Showing <strong>{filteredInstructions.length}</strong> of{' '}
          {INSTRUCTION_SET.length} instructions
          {query && <> matching “{query}”</>}
        </div>

        {/* Instruction Table */}
        <div className="instr-table-wrap">
          <table className="instr-table">
            <thead>
              <tr>
                <th>Instruction</th>
                <th>Description &amp; Example</th>
                <th>Addressing</th>
                <th className="num-col">Bytes</th>
                <th className="num-col">Cycles</th>
                <th className="num-col">Flags</th>
              </tr>
            </thead>
            <tbody>
              {filteredInstructions.map((ins) => (
                <tr key={ins.id} className={`instr-row cat-${ins.category}`}>
                  <td className="mnemonic-cell">
                    <code className="mnemonic-code">{ins.mnemonic}</code>
                    <span className="opcode-text">Opcode: {ins.opcode}</span>
                  </td>
                  <td className="desc-cell">
                    <p className="desc-text">{ins.description}</p>
                    <code className="example-inline">{ins.example}</code>
                  </td>
                  <td>
                    <span className="mode-pill">{ins.addressingMode}</span>
                  </td>
                  <td className="num-col mono-cell">{ins.bytes}</td>
                  <td className="num-col mono-cell">
                    <span className={ins.machineCycles === 1 ? 'cycle-fast' : ''}>
                      {ins.machineCycles}
                    </span>
                  </td>
                  <td className="num-col">
                    {ins.flagsAffected.length > 0 ? (
                      <span className="flags-text">{ins.flagsAffected.join(', ')}</span>
                    ) : (
                      <span className="no-flags">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredInstructions.length === 0 && (
            <div className="instr-empty-state">
              <Search size={26} className="instr-empty-icon" />
              <h4>No instructions found</h4>
              <p>
                Nothing matches “{query}”. Try a mnemonic like <code>MOVC</code>, an operand like{' '}
                <code>@Ri</code>, or clear the filters to browse the full set.
              </p>
              <button
                onClick={() => {
                  setQuery('');
                  setActiveCategory('all');
                }}
                className="btn-select-default"
              >
                Reset search &amp; filters
              </button>
            </div>
          )}
        </div>

        {/* Reference Cards: Operand Key + Flag Legend */}
        <div className="instr-ref-grid">
          <div className="instr-ref-card">
            <h4 className="instr-ref-title">Assembly Operand Symbol Key</h4>
            <ul className="symbol-key-list">
              {OPERAND_SYMBOL_KEY.map((item) => (
                <li key={item.symbol} className="symbol-key-item">
                  <code className="symbol-code">{item.symbol}</code>
                  <span className="symbol-meaning">{item.meaning}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="instr-ref-card">
            <h4 className="instr-ref-title">PSW Status Flag Legend</h4>
            <ul className="symbol-key-list">
              {FLAG_LEGEND.map((item) => (
                <li key={item.flag} className="symbol-key-item">
                  <code className="symbol-code flag-code">{item.flag}</code>
                  <span className="symbol-meaning">
                    <strong>{item.name}</strong> — {item.meaning}
                  </span>
                </li>
              ))}
            </ul>
            <p className="instr-timing-note">
              <strong>Timing reminder:</strong> 1 machine cycle = 12 oscillator periods, so at the
              classic 12 MHz crystal frequency a single-cycle instruction takes exactly 1 µs. Most
              memory-access and branching instructions take 2 cycles; MUL AB and DIV AB take 4.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
