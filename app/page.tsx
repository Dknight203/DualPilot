import Hero from "@/components/Hero";
import Link from "next/link";
import PricingSection from "@/app/components/PricingSection";
import React from "react";

const HowItWorks = () => (
  <div className="bg-gray-50">
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 md:py-14 lg:py-20">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">How it works</h2>
        <p className="mt-4 text-lg text-gray-600">Visibility on autopilot in 3 simple steps.</p>
      </div>
      <div className="mt-12 grid gap-8 md:grid-cols-3">
        <div className="text-center">
          <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-accent text-white mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" /></svg>
          </div>
          <h3 className="mt-6 text-lg font-bold text-gray-900">Connect your site</h3>
          <p className="mt-2 text-base text-gray-600">Add our one line script tag or use our WordPress plugin. DualPilot connects securely and starts its first crawl.</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-accent text-white mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" /></svg>
          </div>
          <h3 className="mt-6 text-lg font-bold text-gray-900">Optimize with one click</h3>
          <p className="mt-2 text-base text-gray-600">Our engine analyzes each page and generates perfect meta titles, descriptions, JSON LD schema, and AI summaries.</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-accent text-white mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 11.667 0l3.181-3.183m-4.991-2.691v-4.992a2.25 2.25 0 0 0-2.25-2.25h-4.5a2.25 2.25 0 0 0-2.25 2.25v4.992m0 0h4.992" /></svg>
          </div>
          <h3 className="mt-6 text-lg font-bold text-gray-900">Stay visible with continuous refresh</h3>
          <p className="mt-2 text-base text-gray-600">Approve changes with one click. DualPilot monitors your site, pings search engines, and keeps your visibility score high.</p>
        </div>
      </div>
    </div>
  </div>
);

const BenefitCard = ({ title, description, icon }: { title: string; description: string; icon: React.ReactNode }) => (
  <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
    <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-accent text-white">
      {icon}
    </div>
    <h3 className="mt-6 text-lg font-bold text-gray-900">{title}</h3>
    <p className="mt-2 text-base text-gray-600">{description}</p>
  </div>
);

const Benefits = () => (
  <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 md:py-14 lg:py-20">
    <div className="text-center">
      <h2 className="text-3xl font-bold tracking-tight text-gray-900">Everything you need to be visible</h2>
      <p className="mt-4 text-lg text-gray-600">From classic SEO to modern AI assistants, we have you covered.</p>
    </div>
    <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
      <BenefitCard title="Clean JSON LD" description="Generate perfect, nested JSON LD schema that helps search engines understand your content, services, and products." icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 12" /></svg>} />
      <BenefitCard title="Smart titles and descriptions" description="AI powered copy that is optimized for click through rates and keyword relevance, written in your brand voice." icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" /></svg>} />
      <BenefitCard title="IndexNow pings" description="We automatically ping Google, Bing, and other major search engines when your content changes for faster reindexing." icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" /></svg>} />
      <BenefitCard title="Visibility Score tracking" description="Monitor your overall site health with a single score that tracks classic SEO factors and AI readiness over time." icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" /></svg>} />
    </div>
  </div>
);

const FaqItem = ({ question, answer }: { question: string; answer: string }) => (
  <div>
    <dt className="text-lg font-bold text-gray-900">{question}</dt>
    <dd className="mt-2 text-base text-gray-600 leading-7">{answer}</dd>
  </div>
);

const Faq = () => (
    <div className="max-w-7xl mx-auto pt-10 px-4 sm:px-6 lg:px-8 md:pt-14 lg:pt-20 pb-16 md:pb-20">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">Frequently Asked Questions</h2>
      </div>
      <dl className="mt-12 grid grid-cols-1 gap-y-10 md:grid-cols-2 md:gap-x-8">
        <FaqItem question="How does the AI work?" answer="DualPilot uses cutting edge large language models, including Google's Gemini, to analyze your content and generate contextually relevant, SEO friendly metadata. It understands nuance and intent, creating copy that resonates with both humans and search engines." />
        <FaqItem question="Is this safe for my SEO?" answer="Absolutely. DualPilot follows all search engine best practices. You have full control to approve or edit any suggestion before it goes live. Our goal is to enhance your existing SEO efforts, not replace them. We provide the data, you make the final call." />
        <FaqItem question="What platforms does DualPilot support?" answer="DualPilot works with any website. We provide a simple script tag you can add to any platform including Webflow, Shopify, or custom coded sites. We also have a dedicated WordPress plugin for easy installation." />
        <FaqItem question="What is a Visibility Score?" answer="The Visibility Score is a proprietary metric from 0 to 100 that measures your site's overall health for both classic search engines and modern AI assistants. It combines factors like metadata quality, schema completeness, and technical SEO readiness." />
        <FaqItem question="Can I cancel my subscription at any time?" answer="Yes. You can cancel your subscription at any time from your account settings. You will retain access until the end of your current billing period, and you will not be charged again." />
      </dl>
    </div>
);


export default function LandingPage() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <Benefits />
      <PricingSection />
      <Faq />
    </>
  );
}