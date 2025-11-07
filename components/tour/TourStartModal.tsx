import React from 'react';
import Button from '../common/Button';

interface TourStartModalProps {
    onStart: () => void;
    onSkip: () => void;
}

const TourStartModal: React.FC<TourStartModalProps> = ({ onStart, onSkip }) => {
    return (
        <div className="fixed inset-0 bg-slate-900 bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md text-center p-8 animate-fade-in-up">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent-default" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mt-5">Welcome to your Dashboard!</h2>
                <p className="mt-2 text-slate-600">
                    Ready for a quick tour to see how everything works?
                </p>
                <div className="mt-8 flex justify-center space-x-4">
                    <Button onClick={onSkip} variant="outline">Maybe Later</Button>
                    <Button onClick={onStart} variant="primary">Start Tour</Button>
                </div>
            </div>
        </div>
    );
};

export default TourStartModal;