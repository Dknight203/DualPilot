import React, { useState, useEffect } from 'react';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';
import Textarea from '../common/Textarea';
import { generateAiSummary } from '../../services/api';

interface StepConfirmProfileProps {
    domain: string;
    onProfileConfirmed: (profile: string) => void;
    onBack: () => void;
}

const StepConfirmProfile: React.FC<StepConfirmProfileProps> = ({ domain, onProfileConfirmed, onBack }) => {
    const [summary, setSummary] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!domain) return;

        const fetchSummary = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const generatedSummary = await generateAiSummary(domain);
                setSummary(generatedSummary);
            } catch (err: any) {
                console.error("Failed to generate summary:", err);
                setError(err.message);
                setSummary(''); // Start with empty so user can write their own
            } finally {
                setIsLoading(false);
            }
        };

        fetchSummary();
    }, [domain]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onProfileConfirmed(summary);
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-center text-slate-900">Confirm Your Site's Profile</h2>
            <p className="mt-2 text-center text-slate-600">Please confirm or edit this AI-generated summary to ensure our optimizations are perfectly tailored.</p>
            
            <form onSubmit={handleSubmit} className="mt-8 max-w-2xl mx-auto space-y-6">
                 {isLoading ? (
                    <div className="flex flex-col justify-center h-48 items-center text-center">
                        <LoadingSpinner text="Generating site profile..." />
                        <p className="text-sm text-slate-500 mt-2">This may take a few moments, especially for larger sites.</p>
                    </div>
                 ) : (
                    <div>
                        {error && (
                             <div className="mb-4 text-center text-sm text-yellow-800 bg-yellow-50 p-3 rounded-md border border-yellow-200">
                                <p className="font-semibold">Could not generate a profile automatically.</p>
                                <p className="mt-1">{error}</p>
                                <p className="mt-2">Please write a brief, one-paragraph summary of your business below.</p>
                            </div>
                        )}
                        <label htmlFor="summary" className="block text-sm font-medium text-slate-700">Your Site's AI Profile</label>
                        <Textarea
                            id="summary"
                            rows={5}
                            value={summary}
                            onChange={(e) => setSummary(e.target.value)}
                            className="mt-1"
                            placeholder="e.g., MyCompany is a leading provider of eco-friendly dog toys, committed to sustainability and pet wellness."
                            required
                        />
                    </div>
                 )}
                <div className="text-center pt-4 flex justify-center gap-4">
                    <Button type="button" variant="outline" size="lg" onClick={onBack} disabled={isLoading}>
                        Back
                    </Button>
                    <Button type="submit" size="lg" disabled={isLoading || !summary}>
                        Confirm Profile & Continue
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default StepConfirmProfile;