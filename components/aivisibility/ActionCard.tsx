import React from 'react';
import { Guide } from '../../data/playbookGuides';
import Card from '../common/Card';
import Button from '../common/Button';

interface ActionCardProps {
  guide: Guide;
  onViewGuide: (guide: Guide) => void;
}

const ActionCard: React.FC<ActionCardProps> = ({ guide, onViewGuide }) => {
  return (
    <Card>
      <div className="flex flex-col h-full">
        <div className="flex-grow">
          <span className="text-xs font-semibold text-accent-start uppercase">{guide.category}</span>
          <h3 className="text-lg font-bold text-slate-900 mt-1">{guide.title}</h3>
          <p className="mt-2 text-sm text-slate-600">
            {guide.description}
          </p>
        </div>
        <div className="mt-4 pt-4 border-t border-slate-200">
          <Button variant="outline" onClick={() => onViewGuide(guide)}>
            View Guide
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ActionCard;
