import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import { PRICING_PLANS } from '../constants';
import ScanForm from '../components/scan/ScanForm';
import ScoreGauge from '../components/common/ScoreGauge';
import PlanCards from '../components/pricing/PlanCards';

// Hero Section Component
const ScoreCard = () => (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <h3 className="text-lg font-bold text-slate-900">Visibility Score</h3>
        <p className="text-sm text-slate-600 mt-1">Example Score</p>
        <div className="mt-4 flex justify-center">
            <ScoreGauge score={72} size={140} />
        </div>
        <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">AI Readiness</span>
                <span className="font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-md">Ready</span>
            </div>
            <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Classic Readiness</span>
                <span className="font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-md">Ready</span>
            </div>
            <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Issues found</span>
                <span className="font-semibold text-yellow-700 bg-yellow-100 px-2 py-1 rounded-md">3</span>
            </div>
        </div>
    </div>
);

const Hero = () => {
    const navigate = useNavigate();
    const handleScan = (domain: string) => {
        navigate(`/scan?domain=${encodeURIComponent(domain)}`);
    };

    return (
        <div className="bg-white">
            <div className="max-w-6xl mx-auto py-16 px-4 sm:px-6 lg:px-8 sm:py-20 lg:py-24">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-slate-900 leading-tight">
                            Visibility on autopilot for search and AI
                        </h1>
                        <p className="mt-6 text-lg text-slate-600 leading-7">
                            DualPilot audits pages, writes clean metadata and schema, and keeps you visible in Google, Bing, and modern AI assistants.
                        </p>
                        <div className="mt-8">
                            <ScanForm onScan={handleScan} isLoading={false} />
                        </div>
                        <p className="mt-4 text-sm text-slate-500">
                            Works with WordPress, Webflow, Shopify, and custom stacks.
                        </p>
                    </div>
                    <div className="w-full max-w-sm mx-auto">
                        <ScoreCard />
                    </div>
                </div>
            </div>
        </div>
    );
};

// How It Works Section Component
const HowItWorks = () => (
  <div className="bg-slate-50">
    <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 sm:py-20">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">How it works</h2>
        <p className="mt-4 text-lg text-slate-600">Visibility on autopilot in 3 simple steps.</p>
      </div>
      <div className="mt-12 grid gap-8 md:grid-cols-3">
        <div className="text-center">
          <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-r from-accent-start to-accent-end text-white mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" /></svg>
          </div>
          <h3 className="mt-6 text-lg font-bold text-slate-900">Connect your site</h3>
          <p className="mt-2 text-base text-slate-600">Add our one line script tag or use our WordPress plugin. DualPilot connects securely and starts its first crawl.</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-r from-accent-start to-accent-end text-white mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" /></svg>
          </div>
          <h3 className="mt-6 text-lg font-bold text-slate-900">Optimize with one click</h3>
          <p className="mt-2 text-base text-slate-600">Our engine analyzes each page and generates perfect meta titles, descriptions, JSON LD schema, and AI summaries.</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-r from-accent-start to-accent-end text-white mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 11.667 0l3.181-3.183m-4.991-2.691v-4.992a2.25 2.25 0 0 0-2.25-2.25h-4.5a2.25 2.25 0 0 0-2.25 2.25v4.992m0 0h4.992" /></svg>
          </div>
          <h3 className="mt-6 text-lg font-bold text-slate-900">Stay visible with continuous refresh</h3>
          <p className="mt-2 text-base text-slate-600">Approve changes with one click. DualPilot monitors your site, pings search engines, and keeps your visibility score high.</p>
        </div>
      </div>
    </div>
  </div>
);

const FaqItem = ({ question, answer }: { question: string; answer: string }) => (
  <div>
    <dt className="text-lg font-bold text-slate-900">{question}</dt>
    <dd className="mt-2 text-base text-slate-600 leading-7">{answer}</dd>
  </div>
);

const Faq = () => (
    <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 sm:py-20">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Frequently Asked Questions</h2>
      </div>
      <dl className="mt-12 grid grid-cols-1 gap-y-10 md:grid-cols-2 md:gap-x-8">
        <FaqItem question="How does the AI work?" answer="DualPilot uses cutting edge large language models, including Google's Gemini, to analyze your content and generate contextually relevant, SEO friendly metadata. It understands nuance and intent, creating copy that resonates with both humans and search engines." />
        <FaqItem question="Is this safe for my SEO?" answer="Absolutely. DualPilot follows all search engine best practices. You have full control to approve or edit any suggestion before it goes live. Our goal is to enhance your existing SEO efforts, not replace them. We provide the data, you make the final call." />
        <FaqItem question="What platforms does DualPilot support?" answer="DualPilot works with any website. We provide a simple script tag you can add to any platform including Webflow, Shopify, or custom coded sites. We also have a dedicated WordPress plugin for easy installation." />
        <FaqItem question="What is a Visibility Score?" answer="The Visibility Score is a proprietary metric from 0 to 100 that measures your site's overall health for both classic search engines and modern AI assistants. It combines factors like metadata quality, schema completeness, and technical SEO readiness." />
      </dl>
    </div>
);

const LandingPage: React.FC = () => {
    const navigate = useNavigate();
    const handleSelectPlan = () => {
        navigate('/pricing');
    };

    return (
        <>
            <Hero />
            <HowItWorks />
            <div className="bg-slate-50 py-20">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                 <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">Simple, transparent pricing</h2>
                    <p className="mt-4 text-lg text-slate-600">Choose the plan that fits your needs. No hidden fees, ever.</p>
                 </div>
                <PlanCards plans={PRICING_PLANS} onSelectPlan={handleSelectPlan} />
                <div className="mt-10 text-center">
                    <Link to="/pricing">
                      <Button variant="outline" size="lg">
                        View all plans & features
                      </Button>
                    </Link>
                </div>
              </div>
            </div>
            <Faq />
        </>
    );
};

export default LandingPage;