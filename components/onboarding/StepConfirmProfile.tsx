import React, { useState, useEffect } from 'react';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';

interface StepConfirmProfileProps {
    onProfileConfirmed: () => void;
}

const StepConfirmProfile: React.FC<StepConfirmProfileProps> = ({ onProfileConfirmed }) => {
    const [summary, setSummary] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [domain, setDomain] = useState(''); // Added state for domain

    useEffect(() => {
        // Simulate fetching and generating a summary with Gemini
        // In a real app, this would be based on an initial crawl of the user's domain
        const userDomain = new URLSearchParams(window.location.hash.split('?')[1]).get('domain') || 'example.com';
        setDomain(userDomain);

        setIsLoading(true);
        setTimeout(() => {
            const mockSummary = `This site, ${userDomain}, appears to be a SaaS company providing an automated AI and Search visibility engine. It helps users audit pages, generate AI-ready metadata and schema, and maintain visibility across classic search engines and AI assistants.`;
            setSummary(mockSummary);
            setIsLoading(false);
        }, 2000);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Site profile confirmed:', summary);
        localStorage.setItem('siteProfile', summary); // Save the profile
        localStorage.setItem('onboardingDomain', domain); // Save the domain for the next step
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
                        <textarea
                            id="summary"
                            rows={5}
                            value={summary}
                            onChange={(e) => setSummary(e.target.value)}
                            className="mt-1 block w-full px-4 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-accent-default focus:border-accent-default sm:text-sm bg-white text-slate-900"
                            required
                        />
                    </div>
                 )}
                <div className="text-center pt-4">
                    <Button type="submit" size="lg" disabled={isLoading}>
                        Confirm Profile & Continue
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default StepConfirmProfile;