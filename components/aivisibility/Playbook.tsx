import React, { useState } from 'react';
import { playbookGuides, Guide } from '../../data/playbookGuides';
import { Page } from '../../types';
import ActionCard from './ActionCard';
import GuideModal from './GuideModal';

interface PlaybookProps {
    pages: Page[];
    onAutomate: (guideTitle: string, pageId: string) => void;
}

const Playbook: React.FC<PlaybookProps> = ({ pages, onAutomate }) => {
    const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {playbookGuides.map(guide => (
                    <ActionCard key={guide.id} guide={guide} onViewGuide={handleViewGuide} />
                ))}
            </div>
        </>
    );
};

export default Playbook;
