import React, { useState, useEffect } from 'react';
import { Guide } from '../../data/playbookGuides';
import { Page } from '../../types';
import Button from '../common/Button';
import Select from '../common/Select';

interface GuideModalProps {
  guide: Guide;
  onClose: () => void;
  pages: Page[];
  onAutomate: (guideTitle: string, pageId: string) => void;
}

const GuideModal: React.FC<GuideModalProps> = ({ guide, onClose, pages, onAutomate }) => {
  const [selectedPageId, setSelectedPageId] = useState('');

  useEffect(() => {
    if (pages.length > 0) {
      setSelectedPageId(pages[0].id);
    }
  }, [pages]);
  
  const handleAutomateClick = () => {
    if (selectedPageId) {
      onAutomate(guide.title, selectedPageId);
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-[60] p-4 animate-fade-in-up"
      style={{ animationDuration: '0.3s' }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-200 flex justify-between items-start">
          <div>
            <span className="text-sm font-semibold text-accent-start uppercase">{guide.category}</span>
            <h2 className="text-2xl font-bold text-slate-900 mt-1">{guide.title}</h2>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800 transition-colors p-1 rounded-full hover:bg-slate-100">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6 overflow-y-auto prose prose-slate max-w-none">
          <pre className="whitespace-pre-wrap font-sans bg-slate-50 p-4 rounded-md text-sm leading-relaxed">{guide.content}</pre>
        </div>
        
        <div className="p-6 border-t border-slate-200 flex-shrink-0 flex justify-between items-center">
           {guide.actionable && (
            <div className="flex-grow mr-4">
                <div className="flex items-center gap-2">
                     <Select
                        value={selectedPageId}
                        onChange={e => setSelectedPageId(e.target.value)}
                      >
                       {pages.map(page => <option key={page.id} value={page.id}>{page.url}</option>)}
                      </Select>
                     <Button onClick={handleAutomateClick} variant="primary" disabled={!selectedPageId}>
                        Generate for Page
                    </Button>
                </div>
                 <p className="text-xs text-slate-500 mt-1">Automate this task for a specific page.</p>
            </div>
           )}
            <Button onClick={onClose} variant={guide.actionable ? 'outline' : 'primary'} className="ml-auto">Close</Button>
        </div>
      </div>
    </div>
  );
};

export default GuideModal;