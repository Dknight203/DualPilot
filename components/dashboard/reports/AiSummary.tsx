import React, { useState, useEffect } from 'react';
import { ReportsData } from '../../../types';
import Card from '../../common/Card';
import LoadingSpinner from '../../common/LoadingSpinner';
import { GoogleGenAI } from '@google/genai';

interface AiSummaryProps {
    reportsData: ReportsData;
    days: number;
}

const AiSummary: React.FC<AiSummaryProps> = ({ reportsData, days }) => {
    const [summary, setSummary] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const generateSummary = async () => {
            setIsLoading(true);
            setError(null);
            try {
                if (!process.env.API_KEY) {
                    // Fallback for demo if API key is not set
                    console.warn("API_KEY environment variable not set. Using mock summary.");
                    const daysText = days === 0 ? 'all time' : `the last ${days} days`;
                    setSummary(`Over ${daysText}, visibility has shown a positive trend. AI coverage is strong at ${reportsData.aiCoverage.find(d => d.name === 'Covered')?.value}%. Key improvements were seen on pages like ${reportsData.pageImprovements?.[0]?.url}.`);
                    return;
                }

                // FIX: Use new GoogleGenAI({apiKey: process.env.API_KEY}) as per guidelines.
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
                
                const dataSummary = JSON.stringify({
                    visibilityTrend: `Trend over last ${days} days with starting score ${reportsData.visibilityTrend[0].score} and ending score ${reportsData.visibilityTrend[reportsData.visibilityTrend.length - 1].score}.`,
                    aiCoverage: reportsData.aiCoverage,
                    gscPerformance: reportsData.gscPerformance ? `GSC data is available.` : `GSC data is not connected.`,
                    topPageImprovement: reportsData.pageImprovements?.[0],
                    optimizationActivityCount: reportsData.optimizationActivity.length,
                });

                const prompt = `
                    You are an expert SEO analyst. Provide a brief, insightful summary (2-3 sentences) of the following website performance data for a client report. 
                    Be positive but realistic. Highlight one key achievement and one area to watch.
                    Data: ${dataSummary}
                `;

                // FIX: Use ai.models.generateContent as per guidelines.
                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: prompt,
                });

                // FIX: Use response.text to get the text output.
                setSummary(response.text);

            } catch (err) {
                console.error("Failed to generate AI summary", err);
                setError("Could not generate AI summary. Please check your API key.");
                // Provide a fallback summary on error
                const daysText = days === 0 ? 'the period' : `the last ${days} days`;
                setSummary(`An error occurred while generating the summary. Based on the data, the site's visibility trend over ${daysText} appears to be generally positive.`);
            } finally {
                setIsLoading(false);
            }
        };

        generateSummary();
    }, [reportsData, days]);

    return (
        <Card title="AI-Generated Summary">
            {isLoading ? (
                <div className="flex items-center space-x-2">
                    <LoadingSpinner size="sm" />
                    <p className="text-slate-500">Generating insights with Gemini...</p>
                </div>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                <p className="text-slate-700 leading-relaxed">{summary}</p>
            )}
        </Card>
    );
};

export default AiSummary;
