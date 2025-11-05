import React, { useState, useCallback } from 'react';
import { GoogleGenAI } from '@google/genai';
import { useSite } from '../components/site/SiteContext';
import { getPages } from '../services/api';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';

const AiVisibilityPage: React.FC = () => {
    const { activeSite } = useSite();
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [aiResponse, setAiResponse] = useState<string | null>(null);

    const handleSimulation = useCallback(async () => {
        if (!activeSite || !query) return;
        setIsLoading(true);
        setError(null);
        setAiResponse(null);

        try {
            // 1. Fetch pages to get AI summaries
            const pages = await getPages(activeSite.id, {});
            const contextContent = pages
                .map(p => `URL: ${p.url}\nScore: ${p.score}\nAI Summary: (This is a pre-generated summary for the page content)`)
                .join('\n\n');
            
            // 2. Call Gemini API to generate a simulated response
            if (!process.env.API_KEY) {
                console.warn("API_KEY environment variable not set. Using mock AI response.");
                setTimeout(() => {
                    setAiResponse(`Based on the content from ${activeSite.siteName}, here's an answer to your query about "${query}". The site provides comprehensive services and information which you can explore further on their main pages.`);
                    setIsLoading(false);
                }, 1500);
                return;
            }

            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `
                You are simulating an AI assistant's response. A user is asking a question to a search engine. 
                Your answer should be based ONLY on the provided content from the website '${activeSite.siteName}'.
                Do not use any external knowledge.
                Synthesize the provided page summaries into a helpful, conversational answer to the user's query.
                
                USER QUERY: "${query}"

                WEBSITE CONTENT:
                ---
                ${contextContent}
                ---

                Simulated AI Response:
            `;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });

            setAiResponse(response.text);

        } catch (err) {
            console.error(err);
            setError('Failed to generate AI response. Please try again.');
        } finally {
            setIsLoading(false);
        }

    }, [activeSite, query]);


    return (
        <div className="bg-slate-100 p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-slate-900">AI Visibility Simulator</h1>
                    <p className="mt-2 text-slate-600">
                        See how your site's optimized content might appear in AI-powered search answers.
                    </p>
                </div>

                <Card className="mt-8">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Ask a question, e.g., 'what services do you offer?'"
                            className="flex-grow block w-full px-4 py-3 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:ring-accent-default focus:border-accent-default sm:text-sm bg-white text-slate-900"
                        />
                        <Button onClick={handleSimulation} isLoading={isLoading} disabled={!query || isLoading}>
                            Simulate Response
                        </Button>
                    </div>
                </Card>

                <div className="mt-6">
                    {isLoading && (
                        <div className="flex justify-center items-center h-48">
                            <LoadingSpinner text="Generating AI Response..." />
                        </div>
                    )}
                    {error && <p className="text-center text-red-500">{error}</p>}
                    {aiResponse && (
                        <Card title="Simulated AI Response">
                            <div className="prose prose-slate max-w-none">
                                <p>{aiResponse}</p>
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AiVisibilityPage;
