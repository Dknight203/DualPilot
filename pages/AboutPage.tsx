import React from 'react';
import Card from '../components/common/Card';

const AboutPage: React.FC = () => {
    return (
        <div className="bg-white py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold text-slate-900 sm:text-5xl">
                        Our Mission
                    </h1>
                    <p className="mt-4 text-xl text-slate-600">
                        To make the web more visible and intelligent for everyone by bridging the gap between classic search engines and modern AI assistants.
                    </p>
                </div>

                <div className="mt-16">
                    <Card>
                        <div className="prose prose-slate max-w-none mx-auto text-slate-600">
                            <h2>The Story of DualPilot</h2>
                            <p>
                                Driving meaningful traffic to your website has become a costly and complex challenge. Businesses are forced to navigate an ever-changing landscape of search engine algorithms, paid advertising strategies, and now, the rise of AI assistants. The mundane, technical tasks required to stay visible often pull focus away from what truly matters: running your business.
                            </p>
                            <p>
                                DualPilot was founded with a clear mission: to take away the complications and mitigate the costs of being visible online. We believe that you shouldn't need to be an SEO expert or an AI engineer to attract your audience. Our platform is designed to be a true autopilot, handling the intricate, repetitive work of optimizing your site for both classic search and modern AI.
                            </p>
                             <p>
                                By automating metadata generation, schema markup, and continuous monitoring, DualPilot allows you to focus on creating great products and content, confident that your visibility is being managed intelligently in the background.
                            </p>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;