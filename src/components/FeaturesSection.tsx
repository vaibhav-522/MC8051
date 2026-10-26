import React from 'react';
import { CLASSIC_8051_FEATURES, VARIANT_DISCLAIMER } from '../data/featuresData';
import {
  Cpu,
  FileCode,
  HardDrive,
  Network,
  Clock,
  Radio,
  Zap,
  Activity,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  Cpu: <Cpu size={24} className="feature-icon" />,
  FileCode: <FileCode size={24} className="feature-icon" />,
  HardDrive: <HardDrive size={24} className="feature-icon" />,
  Network: <Network size={24} className="feature-icon" />,
  Clock: <Clock size={24} className="feature-icon" />,
  Radio: <Radio size={24} className="feature-icon" />,
  Zap: <Zap size={24} className="feature-icon" />,
  Activity: <Activity size={24} className="feature-icon" />,
};

interface FeaturesSectionProps {
  onExploreArchitecture: () => void;
}

export const FeaturesSection: React.FC<FeaturesSectionProps> = ({ onExploreArchitecture }) => {
  return (
    <section id="features" className="features-section">
      <div className="section-container">
        {/* Section Header */}
        <div className="section-title-wrap">
          <div className="section-badge">
            <CheckCircle size={14} />
            <span>Classic Hardware Specifications</span>
          </div>
          <h2 className="section-heading">Features of 8051</h2>
          <p className="section-subheading">
            The Intel 8051 microcontroller set the foundational standard for modern 8-bit embedded control systems. Here are the 8 key hardware capabilities of the classic standard model.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="features-grid">
          {CLASSIC_8051_FEATURES.map((feature, idx) => (
            <div key={feature.id} className="feature-card">
              <div className="feature-card-header">
                <div className="feature-icon-wrapper">
                  {iconMap[feature.iconName] || <Cpu size={24} className="feature-icon" />}
                </div>
                <div className="feature-card-meta">
                  <span className="feature-number">{(idx + 1).toString().padStart(2, '0')}</span>
                  <span className="feature-category-badge">{feature.badge}</span>
                </div>
              </div>

              <h3 className="feature-card-title">{feature.title}</h3>
              <p className="feature-card-summary">{feature.summary}</p>
              <p className="feature-card-details">{feature.details}</p>
            </div>
          ))}
        </div>

        {/* Variant Disclaimer Callout */}
        <div className="disclaimer-banner">
          <div className="disclaimer-icon-col">
            <AlertTriangle size={24} className="warning-icon" />
          </div>
          <div className="disclaimer-content">
            <h4 className="disclaimer-title">{VARIANT_DISCLAIMER.title}</h4>
            <p className="disclaimer-text">{VARIANT_DISCLAIMER.text}</p>
          </div>
        </div>

        {/* Mini CTA */}
        <div className="features-cta">
          <p className="features-cta-text">
            Ready to see how all these hardware blocks connect on the chip?
          </p>
          <button onClick={onExploreArchitecture} className="btn-primary-cyan">
            Explore Architecture Diagram
          </button>
        </div>
      </div>
    </section>
  );
};
