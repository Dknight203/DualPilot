import React, { useState, useMemo } from 'react';
import { Page } from '../../types';
import { playbookGuides, Guide } from '../../data/playbookGuides';
import ActionCard from './ActionCard';
import GuideModal from './GuideModal';

interface PlaybookProps {
  pages: Page[];
  onAutomate: (guideTitle: string, pageId: string) => void;
}

const Playbook: React.FC<PlaybookProps> = ({ pages, onAutomate }) => {
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);

  const guidesByCategory = useMemo(() => {
    // FIX: By typing the initial value of `reduce` with `as Record<string, Guide[]>`, we ensure TypeScript correctly
    // infers the accumulator's type. This prevents `Object.entries` from returning `unknown` for the values,
    // which was causing the 'map does not exist' error on the `guides` variable.
    return playbookGuides.reduce((acc, guide) => {
      const category = guide.category;
      (acc[category] = acc[category] || []).push(guide);
      return acc;
    }, {} as Record<string, Guide[]>);
  }, []);

  const handleViewGuide = (guide: Guide) => {
    setSelectedGuide(guide);
  };

  const handleCloseModal = () => {
    setSelectedGuide(null);
  };

  return (
    <>
      {selectedGuide && (
        <GuideModal 
          guide={selectedGuide} 
          onClose={handleCloseModal}
          pages={pages}
          onAutomate={onAutomate}
        />
      )}
      <div className="space-y-12">
        {Object.entries(guidesByCategory).map(([category, guides]) => (
          <div key={category}>
            <h2 className="text-2xl font-bold text-slate-900 pb-2 border-b-2 border-accent-start mb-6">
              {category}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {guides.map(guide => (
                <ActionCard key={guide.id} guide={guide} onViewGuide={handleViewGuide} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Playbook;