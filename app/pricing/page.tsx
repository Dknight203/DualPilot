import PlanCards from "@/components/PlanCards";
// FIX: PRICING_PLANS is exported from @/constants, not @/data/seeds.
import { PRICING_PLANS } from "@/constants";

const FaqItem = ({ question, answer }: { question: string; answer: string }) => (
  <div>
    <dt className="text-lg font-bold text-gray-900">{question}</dt>
    <dd className="mt-2 text-base text-gray-600 leading-7">{answer}</dd>
  </div>
);

export default function PricingPage() {
  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 md:py-14 lg:py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900">
            Simple, transparent pricing
          </h1>
          <p className="mt-5 max-w-2xl mx-auto text-lg text-gray-600 leading-7">
            Choose the plan that fits your needs. No hidden fees, ever.
          </p>
        </div>

        <div className="mt-12">
            <PlanCards plans={PRICING_PLANS} />
        </div>

        <div className="mt-12 text-center rounded-2xl border border-gray-200 bg-gray-50 p-6 md:p-8">
            <h3 className="text-xl font-bold text-gray-900">Need more power?</h3>
            <p className="mt-2 text-base text-gray-600">We offer straightforward pricing for add ons.</p>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <p><span className="font-semibold text-gray-800">Extra domain:</span> $10 / mo</p>
                <p><span className="font-semibold text-gray-800">Extra page:</span> $0.05 / page</p>
                <p><span className="font-semibold text-gray-800">Extra seat:</span> $10 / mo</p>
            </div>
        </div>

        <div className="mt-10 md:mt-14 lg:mt-20">
            <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">Plans FAQ</h2>
            </div>
            <dl className="mt-12 grid grid-cols-1 gap-y-10 md:grid-cols-2 md:gap-x-8">
                <FaqItem question="Can I change my plan later?" answer="Yes, you can upgrade or downgrade your plan at any time from your account settings. Prorated charges or credits will be applied automatically." />
                <FaqItem question="What counts as a page?" answer="A page is any unique URL on your site that DualPilot crawls and optimizes. We automatically discover pages via your sitemap and internal links." />
                <FaqItem question="What if I go over my page limit?" answer="We'll notify you when you're approaching your limit. You can choose to upgrade your plan or purchase extra pages at a rate of $0.05 per page." />
                <FaqItem question="What are client accounts?" answer="The Agency plan allows you to create sub accounts to manage multiple client websites under your main account, each with their own isolated data and settings." />
            </dl>
        </div>
      </div>
    </div>
  );
}
