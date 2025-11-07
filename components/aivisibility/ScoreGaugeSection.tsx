import React, { useState } from 'react';
import Card from '../common/Card';
import ScoreGauge from '../common/ScoreGauge';
import ScoreExplanationModal from './ScoreExplanationModal';

interface ScoreGaugeSectionProps {
    score: number;
}

const ScoreGaugeSection: React.FC<ScoreGaugeSectionProps> = ({ score }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            {isModalOpen && <ScoreExplanationModal onClose={() => setIsModalOpen(false)} />}
            <Card>
                <div className="flex flex-col md:flex-row items-center justify-center text-center md:text-left gap-8">
                    <div className="flex-shrink-0">
                        <ScoreGauge score={score} size={140} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">Your AI Visibility Score</h2>
                        <p className="mt-1 text-slate-600 max-w-prose">
                            This score measures your site's readiness to be understood, cited, and recommended by AI assistants like ChatGPT and Google Gemini.
                        </p>
                        <button 
                            onClick={() => setIsModalOpen(true)}
                            className="mt-3 text-sm font-semibold text-accent-default hover:underline"
                        >
                            How is this calculated?
                        </button>
                    </div>
                </div>
            </Card>
        </>
    );
};

export default ScoreGaugeSection;
