import React, { useState, useEffect } from 'react';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';
import Textarea from '../common/Textarea';
import { pollForSiteProfile } from '../../services/api';

interface StepConfirmProfileProps {
    siteId: string;
    onProfileConfirmed: (profile: string) => void;
    onBack: () => void;
}

const StepConfirmProfile: React.FC<StepConfirmProfileProps> = ({ siteId, onProfileConfirmed, onBack }) => {
    const [summary, setSummary] = useState('');
    const [status, setStatus] = useState<'polling' | 'completed' | 'failed'>('polling');

    useEffect(() => {
        const fetchSummary = async () => {
            setStatus('polling');
            try {
                const site = await pollForSiteProfile(siteId);
                if (site.siteProfileStatus === 'completed') {
                    setSummary(site.siteProfile || `AI profile for ${site.domain}.`);
                    setStatus('completed');
                } else {
                    throw new Error('Profile generation failed.');
                }
            } catch (error) {
                console.error("Failed to poll for summary:", error);
                setSummary(`We couldn't automatically generate a profile for your site. This can happen if a site is very new or has limited content. Please write a brief, one-paragraph summary of your business below.`);
                setStatus('failed');
            }
        };

        if (siteId) {
            fetchSummary();
        }
    }, [siteId]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onProfileConfirmed(summary);
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-center text-slate-900">Confirm Your Site's Profile</h2>
            <p className="mt-2 text-center text-slate-600">Please confirm or edit this AI-generated summary to ensure our optimizations are perfectly tailored.</p>
            
            <form onSubmit={handleSubmit} className="mt-8 max-w-2xl mx-auto space-y-6">
                 {status === 'polling' ? (
                    <div className="flex flex-col justify-center h-48 items-center text-center">
                        <LoadingSpinner text="Generating site profile..." />
                        <p className="text-sm text-slate-500 mt-2">This may take a few moments, especially for larger sites.</p>
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
                    <Button type="submit" size="lg" disabled={status === 'polling'}>
                        Confirm Profile & Continue
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default StepConfirmProfile;