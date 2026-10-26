import React, { useState, useEffect } from 'react';
import { ARCHITECTURE_BLOCKS, ARCHITECTURE_CATEGORIES } from '../data/architectureData';
import { ArchitectureDiagram } from './ArchitectureDiagram';
import { BlockDetailPanel } from './BlockDetailPanel';
import { Layers, Info, Sparkles } from 'lucide-react';

export const ArchitectureSection: React.FC = () => {
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>('cpu-alu');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Filter blocks for quick selector
  const filteredBlocks =
    activeCategory === 'all'
      ? ARCHITECTURE_BLOCKS
      : ARCHITECTURE_BLOCKS.filter((b) => b.category === activeCategory);

  const selectedIndex = ARCHITECTURE_BLOCKS.findIndex((b) => b.id === selectedBlockId);
  const selectedBlock = selectedIndex !== -1 ? ARCHITECTURE_BLOCKS[selectedIndex] : null;

  // Keep the detail panel in sync with the filter: if the user switches to a
  // category that hides the currently selected block, clear the selection.
  // (Adjusted during render rather than in an effect — React's recommended
  // pattern for deriving state from a prop/state change.)
  const [prevCategory, setPrevCategory] = useState(activeCategory);
  if (prevCategory !== activeCategory) {
    setPrevCategory(activeCategory);
    if (selectedBlockId && !filteredBlocks.some((b) => b.id === selectedBlockId)) {
      setSelectedBlockId(null);
    }
  }

  const handleSelectBlock = (id: string) => {
    // If the block is hidden by the active filter (e.g. clicked on the diagram),
    // widen the filter back to "All" so the selection is actually visible.
    if (!filteredBlocks.some((b) => b.id === id)) {
      setActiveCategory('all');
    }
    setSelectedBlockId(id);
  };

  const handleClose = () => {
    setSelectedBlockId(null);
  };

  const handlePrev = () => {
    // Navigate within the currently filtered block list
    if (filteredBlocks.length === 0) return;
    const filteredIndex = filteredBlocks.findIndex((b) => b.id === selectedBlockId);
    if (filteredIndex === -1) {
      setSelectedBlockId(filteredBlocks[0].id);
      return;
    }
    const prevIndex = (filteredIndex - 1 + filteredBlocks.length) % filteredBlocks.length;
    setSelectedBlockId(filteredBlocks[prevIndex].id);
  };

  const handleNext = () => {
    // Navigate within the currently filtered block list
    if (filteredBlocks.length === 0) return;
    const filteredIndex = filteredBlocks.findIndex((b) => b.id === selectedBlockId);
    if (filteredIndex === -1) {
      setSelectedBlockId(filteredBlocks[0].id);
      return;
    }
    const nextIndex = (filteredIndex + 1) % filteredBlocks.length;
    setSelectedBlockId(filteredBlocks[nextIndex].id);
  };

  // Keyboard navigation: Escape closes panel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedBlockId) {
        setSelectedBlockId(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedBlockId]);

  return (
    <section id="architecture" className="architecture-section">
      <div className="section-container">
        {/* Section Header */}
        <div className="section-title-wrap">
          <div className="section-badge">
            <Layers size={14} />
            <span>Interactive Hardware Diagram</span>
          </div>
          <h2 className="section-heading">8051 Architecture</h2>
          <p className="section-subheading">
            The classic 8051 employs a modified <strong>Harvard architecture</strong> featuring separate physical memory spaces for program code (ROM) and runtime data (RAM), linked by a central internal 8-bit system bus.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="filter-controls">
          <span className="filter-label">Filter Components:</span>
          <div className="category-pills">
            {ARCHITECTURE_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`category-pill ${activeCategory === cat.id ? 'active' : ''}`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Component Picker Pills */}
        <div className="quick-blocks-shelf">
          <div className="quick-shelf-label">
            <Sparkles size={14} className="cyan-icon" />
            <span>Click any block to inspect:</span>
          </div>
          <div className="quick-pill-list">
            {filteredBlocks.map((b) => (
              <button
                key={b.id}
                onClick={() => handleSelectBlock(b.id)}
                className={`quick-pill ${selectedBlockId === b.id ? 'active' : ''}`}
              >
                <span className="quick-pill-dot" />
                <span className="quick-pill-name">{b.shortName}</span>
                <span className="quick-pill-badge">{b.bitWidth}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Block Diagram */}
        <div className="diagram-card-container">
          <ArchitectureDiagram
            selectedBlockId={selectedBlockId}
            onSelectBlock={handleSelectBlock}
          />
        </div>

        {/* Selected Block Info Panel */}
        <div className="panel-anchor-area" id="detail-panel">
          {selectedBlock ? (
            <BlockDetailPanel
              block={selectedBlock}
              onClose={handleClose}
              onNavigatePrev={handlePrev}
              onNavigateNext={handleNext}
              currentIndex={Math.max(filteredBlocks.findIndex((b) => b.id === selectedBlockId), 0)}
              totalBlocks={filteredBlocks.length}
            />
          ) : (
            <div className="no-selection-card">
              <Info size={28} className="no-selection-icon" />
              <h4>No Component Selected</h4>
              <p>
                Click any block in the schematic above or select one from the quick component list to read its hardware purpose and practical code examples.
              </p>
              <button
                onClick={() => setSelectedBlockId('cpu-alu')}
                className="btn-select-default"
              >
                Inspect CPU &amp; ALU
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
