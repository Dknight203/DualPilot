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

    useEffect(() => {
        const fetchSummary = async () => {
            setIsLoading(true);
            const prompt = `Analyze the website at the domain ${domain} and provide a concise, one-paragraph summary of what the company does. The summary should be suitable for use as an AI profile for SEO purposes. Focus on the company's main products, services, and target audience. For example, for 'nike.com', a good summary would be: 'Nike is a global leader in athletic footwear, apparel, equipment, and accessories. It designs, develops, and sells products for a wide variety of sports and fitness activities, catering to athletes at every level as well as consumers seeking an active lifestyle.'`;
            
            try {
                const generatedSummary = await generateAiSummary(prompt);
                setSummary(generatedSummary);
            } catch (error) {
                console.error("Failed to generate summary:", error);
                setSummary(`Failed to generate a summary for ${domain}. Please write one manually.`);
            } finally {
                setIsLoading(false);
            }
        };

        if (domain) {
            fetchSummary();
        }
    }, [domain]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Site profile confirmed:', summary);
        localStorage.setItem('siteProfile', summary); // Save the profile for other parts of the app
        onProfileConfirmed(summary);
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