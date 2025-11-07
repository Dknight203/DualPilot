export interface Guide {
  id: string;
  category: 'Content & Schema' | 'Technical' | 'Authority & Trust';
  title: string;
  description: string;
  content: string; // Markdown-like content for the modal
  actionable?: boolean;
}

export const playbookGuides: Guide[] = [
  {
    id: 'product-schema',
    category: 'Content & Schema',
    title: 'Implement Product Schema',
    description: 'Add structured data to your product pages to enable rich results like pricing, availability, and review ratings in search.',
    actionable: true,
    content: `
### Why It Matters
Product schema is vital for e-commerce sites. It gives search engines detailed information about your products, which can be displayed directly in search results. This increases visibility and click-through rates.

### How to Implement
1.  **Identify Product Details:** Gather key information like product name, image, brand, description, SKU, and price.
2.  **Use a Generator:** Use a tool like Schema.org's generator or technicalseo.com's tool to create the JSON-LD script.
3.  **Embed the Script:** Place the generated JSON-LD script tag in the \`<head>\` section of your product page's HTML.
4.  **Test:** Use Google's Rich Results Test tool to validate your implementation.

**Example JSON-LD:**
\`\`\`json
{
  "@context": "https://schema.org/",
  "@type": "Product",
  "name": "DualPilot Pro Plan",
  "image": [
    "https://dualpilot.ai/pro-plan.jpg"
   ],
  "description": "The Pro Plan for serious SEO and AI visibility.",
  "sku": "DP-PRO-001",
  "brand": {
    "@type": "Brand",
    "name": "DualPilot"
  },
  "offers": {
    "@type": "Offer",
    "url": "https://dualpilot.ai/pricing",
    "priceCurrency": "USD",
    "price": "99.00",
    "priceValidUntil": "2025-12-31",
    "availability": "https://schema.org/InStock"
  }
}
\`\`\`
`,
  },
    {
    id: 'faq-schema',
    category: 'Content & Schema',
    title: 'Add FAQ Schema to Pages',
    description: 'Structure your frequently asked questions to have them appear directly in search results, increasing your SERP real estate.',
    actionable: true,
    content: `
### Why It Matters
FAQ schema helps you take up more space on the search results page and answers user questions directly, establishing you as an authority. It's great for informational pages, product pages, and blog posts.

### How to Implement
1.  **List Questions & Answers:** Identify the most common questions related to the page content.
2.  **Generate JSON-LD:** For each question-answer pair, create a \`Question\` and \`AcceptedAnswer\` object within an \`FAQPage\` schema type.
3.  **Embed & Test:** Add the script to your page's \`<head>\` and validate with the Rich Results Test tool.

**Example JSON-LD:**
\`\`\`json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [{
    "@type": "Question",
    "name": "Is DualPilot safe for my SEO?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "Absolutely. DualPilot follows all search engine best practices. You have full control to approve or edit any suggestion before it goes live."
    }
  }, {
    "@type": "Question",
    "name": "What platforms does DualPilot support?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "DualPilot works with any website. We provide a simple script tag you can add to any platform including Webflow, Shopify, or custom coded sites."
    }
  }]
}
\`\`\`
`,
    },
    {
    id: 'internal-linking',
    category: 'Technical',
    title: 'Optimize Internal Linking',
    description: 'Strengthen your site architecture and pass authority to important pages by improving your internal linking strategy.',
    content: `
### Why It Matters
Internal links help search engines understand the relationship between your pages and their relative importance. A strong internal linking structure helps with crawling, indexing, and ranking.

### Best Practices
1.  **Use Descriptive Anchor Text:** Avoid generic text like "click here." Use anchor text that describes the page you're linking to (e.g., "AI visibility engine" instead of "learn more").
2.  **Link Deeply:** Don't just link to your homepage or contact page. Link to relevant blog posts, product pages, and other deep content.
3.  **Fix Broken Links:** Use a crawling tool to find and fix any broken (404) internal links on your site.
4.  **Audit Orphan Pages:** Ensure all important pages have at least one internal link pointing to them.
`,
    },
    {
    id: 'gsc-connect',
    category: 'Authority & Trust',
    title: 'Connect Google Search Console',
    description: 'Verify your site with GSC to gain access to invaluable performance data and diagnostic tools directly from Google.',
    content: `
### Why It Matters
Google Search Console (GSC) is a free tool that is essential for monitoring your site's health and performance in Google Search. It's the most direct way to get feedback from the search engine itself.

### Key Benefits
*   **Performance Reports:** See which queries bring users to your site, and analyze your impressions, clicks, and average position.
*   **Indexing Status:** Check if your pages are indexed and troubleshoot any issues.
*   **Manual Actions:** Get notified if your site has been penalized by Google.
*   **Sitemap Submission:** Submit your sitemap to help Google crawl your site more efficiently.

If you haven't connected GSC yet, it should be your top priority.
`,
  },
];