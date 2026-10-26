import React from 'react';
import type { ArchitectureBlock } from '../types';
import { X, ChevronLeft, ChevronRight, Cpu, BookOpen, Terminal, CheckCircle2 } from 'lucide-react';

interface BlockDetailPanelProps {
  block: ArchitectureBlock;
  onClose: () => void;
  onNavigatePrev: () => void;
  onNavigateNext: () => void;
  currentIndex: number;
  totalBlocks: number;
}

export const BlockDetailPanel: React.FC<BlockDetailPanelProps> = ({
  block,
  onClose,
  onNavigatePrev,
  onNavigateNext,
  currentIndex,
  totalBlocks,
}) => {
  return (
    <div className="block-detail-card" role="region" aria-label={`Details for ${block.name}`}>
      {/* Header with Title, Category, and Close Button */}
      <div className="block-detail-header">
        <div className="block-detail-title-group">
          <div className="block-detail-tags">
            <span className={`block-category-pill cat-${block.category}`}>
              {block.categoryLabel}
            </span>
            <span className="block-width-pill">{block.bitWidth}</span>
            {block.sfrAddress && (
              <span className="block-sfr-pill">SFR: {block.sfrAddress}</span>
            )}
          </div>
          <h3 className="block-detail-name">{block.name}</h3>
        </div>

        <button
          onClick={onClose}
          className="close-panel-btn"
          aria-label="Close component details"
          title="Close details (or press Esc)"
        >
          <X size={20} />
        </button>
      </div>

      {/* Main Body */}
      <div className="block-detail-body">
        {/* Function Section */}
        <div className="detail-section">
          <div className="section-label">
            <Cpu size={16} className="section-icon" />
            <span>Hardware Function</span>
          </div>
          <p className="section-text">{block.functionDescription}</p>
        </div>

        {/* Example or Use Case Section */}
        <div className="detail-section">
          <div className="section-label">
            <Terminal size={16} className="section-icon" />
            <span>Practical Example &amp; Use Case</span>
          </div>
          <div className="example-box">
            <code className="example-code">{block.exampleUseCase}</code>
          </div>
        </div>

        {/* Key Student Takeaways */}
        {block.bulletPoints && block.bulletPoints.length > 0 && (
          <div className="detail-section">
            <div className="section-label">
              <BookOpen size={16} className="section-icon" />
              <span>Key Technical Highlights for Exams &amp; Labs</span>
            </div>
            <ul className="takeaways-list">
              {block.bulletPoints.map((point, idx) => (
                <li key={idx} className="takeaway-item">
                  <CheckCircle2 size={15} className="bullet-check" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Footer Navigation */}
      <div className="block-detail-footer">
        <div className="panel-counter">
          Block <strong>{currentIndex + 1}</strong> of <strong>{totalBlocks}</strong>
        </div>

        <div className="nav-btn-group">
          <button
            onClick={onNavigatePrev}
            className="nav-btn"
            title="Inspect previous component"
          >
            <ChevronLeft size={16} />
            <span>Previous</span>
          </button>
          <button
            onClick={onNavigateNext}
            className="nav-btn"
            title="Inspect next component"
          >
            <span>Next</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
