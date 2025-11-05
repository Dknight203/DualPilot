import React from 'react';

const faqs = [
    {
        question: "Can I change my plan later?",
        answer: "Yes, you can upgrade or downgrade your plan at any time from your account settings. Prorated charges or credits will be applied automatically."
    },
    {
        question: "What counts as a page?",
        answer: "A page is any unique URL on your site that DualPilot crawls and optimizes. We automatically discover pages via your sitemap and internal links."
    },
    {
        question: "What if I go over my page limit?",
        answer: "We will notify you when you are approaching your limit. You can choose to upgrade your plan or purchase extra pages at $0.05 per page."
    },
    {
        question: "What are client accounts?",
        answer: "The Agency plan allows you to create sub accounts to manage multiple client websites under your main account, each with their own isolated data and settings."
    }
];

// FIX: Refactor to use React.FC and an interface to properly handle props and keys in a list.
interface FAQItemProps {
    question: string;
    answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => (
    <div>
        <h3 className="text-[18px] font-semibold text-[#0F172A]">{question}</h3>
        <p className="mt-2 text-[16px] text-[#1E1E1E]">{answer}</p>
    </div>
);

const PlansFAQ: React.FC = () => {
    return (
        <section id="plans-faq" className="bg-[#F8FAFC] pt-10 pb-16 md:pt-12 md:pb-20">
            <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {faqs.map(faq => <FAQItem key={faq.question} question={faq.question} answer={faq.answer} />)}
                </div>
            </div>
        </section>
    );
};

export default PlansFAQ;
