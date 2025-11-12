import React, { useState, useEffect } from 'react';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';
import Textarea from '../common/Textarea';

interface StepConfirmProfileProps {
    domain: string;
    onProfileConfirmed: () => void;
    onBack: () => void;
}

const StepConfirmProfile: React.FC<StepConfirmProfileProps> = ({ domain, onProfileConfirmed, onBack }) => {
    const [summary, setSummary] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate fetching and generating a summary based on the provided domain
        setIsLoading(true);
        setTimeout(() => {
            const mockSummary = `This site, ${domain}, appears to be a SaaS company providing an automated AI and Search visibility engine. It helps users audit pages, generate AI-ready metadata and schema, and maintain visibility across classic search engines and AI assistants.`;
            setSummary(mockSummary);
            setIsLoading(false);
        }, 2000);
    }, [domain]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Site profile confirmed:', summary);
        localStorage.setItem('siteProfile', summary); // Save the profile for other parts of the app
        onProfileConfirmed();
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-center text-slate-900">Confirm Your Site's Profile</h2>
            <p className="mt-2 text-center text-slate-600">Our AI has generated a summary of your site. Please confirm or edit it to ensure our optimizations are perfectly tailored.</p>
            
            <form onSubmit={handleSubmit} className="mt-8 max-w-2xl mx-auto space-y-6">
                 {isLoading ? (
                    <div className="flex justify-center h-48 items-center">
                        <LoadingSpinner text="Generating site profile..." />
                    </div>
                 ) : (
                    <div>
                        <label htmlFor="summary" className="block text-sm font-medium text-slate-700">Your Site's AI Profile</label>
                        <Textarea
                            id="summary"
                            rows={5}
                            value={summary}
                            onChange={(e) => setSummary(e.target.value)}
                            className="mt-1"
                            required
                        />
                    </div>
                 )}
                <div className="text-center pt-4 flex justify-center gap-4">
                    <Button type="button" variant="outline" size="lg" onClick={onBack}>
                        Back
                    </Button>
                    <Button type="submit" size="lg" disabled={isLoading}>
                        Confirm Profile & Continue
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default StepConfirmProfile;
