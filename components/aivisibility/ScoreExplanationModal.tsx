import React from 'react';
import Button from '../common/Button';

interface ScoreExplanationModalProps {
    onClose: () => void;
}

const Pillar: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div>
        <h4 className="font-bold text-slate-800">{title}</h4>
        <p className="mt-1 text-sm text-slate-600">{children}</p>
    </div>
);

const ScoreExplanationModal: React.FC<ScoreExplanationModalProps> = ({ onClose }) => {
    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-[60] p-4 animate-fade-in-up"
            style={{ animationDuration: '0.3s' }}
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6 border-b border-slate-200 flex justify-between items-center flex-shrink-0">
                     <h2 className="text-xl font-bold text-slate-900">How the AI Visibility Score is Calculated</h2>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-800 transition-colors p-1 rounded-full hover:bg-slate-100">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <div className="p-6 overflow-y-auto space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900">Our Philosophy</h3>
                        <p className="mt-2 text-slate-600">
                            Your AI Visibility Score is a proprietary metric designed to measure how easily and accurately AI assistants can understand, trust, and use your website's content to answer user questions. Unlike traditional SEO, AI readiness is about providing clear, structured, and authoritative information.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900">The Pillars of the Score</h3>
                        <div className="mt-4 space-y-4">
                            <Pillar title="1. Content & Schema">
                                This is the most important factor. We check for the implementation and completeness of structured data (like Product, FAQ, and Local Business schema) that AIs rely on for factual information. We also analyze the presence of concise, AI-ready summaries for your key pages.
                            </Pillar>
                             <Pillar title="2. Technical Readiness">
                                This pillar measures how easily AI crawlers can access and parse your content. It includes factors like your internal linking structure, which helps establish context, and mobile-friendliness, as many AI queries originate from mobile devices.
                            </Pillar>
                             <Pillar title="3. Authority & Trust">
                                We analyze signals that tell an AI your content is credible and trustworthy. This includes the presence of Author schema for articles, clear contact information, and a verified connection to Google Search Console.
                            </Pillar>
                        </div>
                    </div>
                     <div>
                        <h3 className="text-lg font-semibold text-slate-900">How We Stay Accurate</h3>
                        <p className="mt-2 text-slate-600">
                            The world of Generative AI is new and constantly evolving. Our scoring model is not static; it's continuously updated by our team based on the latest research, documentation from major AI labs (like Google and OpenAI), and observed changes in AI assistant responses. The best way to improve your score is to complete the tasks in your **AI Visibility Playbook**.
                        </p>
                    </div>
                </div>
                 <div className="p-4 bg-slate-50 border-t border-slate-200 text-right flex-shrink-0">
                    <Button onClick={onClose} variant="primary">Got it</Button>
                </div>
            </div>
        </div>
    );
};

export default ScoreExplanationModal;
