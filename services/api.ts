import {
    ScanResult,
    Site,
    PlanId,
    Page,
    PageStatus,
    PageDetails,
    PageOutput,
    Invoice,
    TeamMember,
    LineChartData,
    StackedBarChartData,
    PieChartData,
    Event,
    ImprovedPage,
    ReportData,
    GscDataPoint,
    AiCoverageData,
    PageImprovementData,
    OptimizationActivity
} from '../types';
import { seedSite } from '../data/seeds';

// Mock delay to simulate network latency
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

// --- MOCK DATA ---

const mockPages: Page[] = [
    { id: 'page_1', url: '/blog/ai-in-seo', lastOptimized: '2023-10-26', score: 95, status: PageStatus.Optimized },
    { id: 'page_2', url: '/features/automation', lastOptimized: '2023-10-25', score: 92, status: PageStatus.Optimized },
    { id: 'page_3', url: '/pricing', lastOptimized: '2023-10-20', score: 88, status: PageStatus.Optimized },
    { id: 'page_4', url: '/about-us', lastOptimized: null, score: 65, status: PageStatus.NeedsReview },
    { id: 'page_5', url: '/contact', lastOptimized: '2023-09-01', score: 78, status: PageStatus.Optimized },
    { id: 'page_6', url: '/blog/new-feature', lastOptimized: '2023-10-28', score: 0, status: PageStatus.Pending },
];

const mockPageDetails: PageDetails = {
    ...mockPages[0],
    metaTitle: 'The Role of AI in Modern SEO | DualPilot',
    metaDescription: 'Discover how artificial intelligence is reshaping search engine optimization, from content generation to technical analysis. Stay ahead of the curve.',
    jsonLd: { "@context": "https://schema.org", "@type": "BlogPosting", "headline": "The Role of AI in Modern SEO" },
    userKeywords: ['AI SEO', 'machine learning search'],
    aiKeywords: ['artificial intelligence', 'search engine optimization', 'content strategy', 'technical SEO'],
    history: [
        { id: 'out_1', metaTitle: 'AI in SEO', metaDescription: 'How AI is changing SEO.', jsonLd: {}, modelVersion: 'gemini-1.0', createdAt: '2023-10-20T10:00:00Z' },
        { id: 'out_2', metaTitle: 'The Role of AI in Modern SEO | DualPilot', metaDescription: 'Discover how artificial intelligence is reshaping search engine optimization, from content generation to technical analysis. Stay ahead of the curve.', jsonLd: { "@context": "https://schema.org", "@type": "BlogPosting", "headline": "The Role of AI in Modern SEO" }, modelVersion: 'gemini-1.5', createdAt: '2023-10-26T14:30:00Z' },
    ]
};

// --- API FUNCTIONS ---

export const scanDomain = async (domain: string): Promise<ScanResult> => {
    console.log(`Scanning domain: ${domain}`);
    await delay(2000);
    return {
        score: 78,
        classicReadiness: true,
        aiReadiness: false,
        issues: [
            'Missing structured data (JSON-LD) for key pages.',
            'Meta descriptions are too short on 3 pages.',
            'No clear AI summaries found for conversational search.',
        ],
        suggestedNextStep: 'Unlock your full potential with automated optimization.',
    };
};

export const createCheckoutSession = async (planId: string): Promise<{ checkoutUrl: string }> => {
    console.log(`Creating checkout session for plan: ${planId}`);
    await delay(1500);
    return { checkoutUrl: `https://stripe.com/mock_checkout/${planId}` };
};

export const verifyDomain = async (domain: string): Promise<{ verified: boolean; heartbeat: string | null }> => {
    console.log(`Verifying domain: ${domain}`);
    await delay(1000);
    // Simulate a 50/50 chance of being verified for demo purposes
    if (Math.random() > 0.5) {
        return { verified: true, heartbeat: new Date().toISOString() };
    }
    return { verified: false, heartbeat: null };
};

export const getSites = async (): Promise<Site[]> => {
    await delay(500);
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail === 'empty@example.com') {
        return [];
    }
    // Simulate user having multiple sites
    return [
        seedSite,
        {
            id: 'site_456',
            siteName: 'My Super Blog',
            domain: 'my-super-blog.com',
            plan: PlanId.Essentials,
            optimizedPages: 40,
            totalPages: 50,
            visibilityScore: 85,
            refreshPolicy: 'Weekly refresh',
        }
    ];
}

export const getDashboardData = async (siteId: string) => {
    console.log(`Fetching dashboard data for site: ${siteId}`);
    await delay(1200);

    const visibilityTrend: LineChartData[] = Array.from({ length: 30 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (29 - i));
        return {
            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            score: 80 + Math.sin(i / 3) * 5 + Math.random() * 4,
        };
    });

    const issuesFixed: StackedBarChartData[] = Array.from({ length: 30 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (29 - i));
        return {
            date: date.toISOString(),
            title: Math.floor(Math.random() * 5),
            description: Math.floor(Math.random() * 8),
            canonical: Math.floor(Math.random() * 2),
            schema: Math.floor(Math.random() * 4),
            brokenLinks: Math.floor(Math.random() * 1),
        };
    });
    
    const pageStatus: PieChartData[] = [
        { name: PageStatus.Optimized, value: 180 },
        { name: PageStatus.NeedsReview, value: 45 },
        { name: PageStatus.Pending, value: 20 },
        { name: PageStatus.Failed, value: 5 },
    ];

    const events: Event[] = [
        { id: 'evt_1', type: 'Site Crawl', status: 'Success', timestamp: new Date().toISOString(), details: 'Crawled 250 pages, found 5 new.' },
        { id: 'evt_2', type: 'AI Optimization', status: 'Success', timestamp: '2023-10-27T10:00:00Z', details: 'Optimized 15 pages.' },
        { id: 'evt_3', type: 'IndexNow Ping', status: 'In Progress', timestamp: '2023-10-28T11:00:00Z', details: 'Pinging 15 updated pages.' },
    ];

    const topImprovedPages: ImprovedPage[] = [
        { pageId: 'page_1', url: '/blog/ai-in-seo', oldTitle: 'AI and SEO', newTitle: 'The Role of AI in Modern SEO | DualPilot', oldDescription: 'How AI is changing SEO.', newDescription: 'Discover how AI is reshaping search...' },
        { pageId: 'page_2', url: '/features/automation', oldTitle: 'Automation', newTitle: 'Automate Your Visibility | DualPilot Features', oldDescription: 'Our features.', newDescription: 'Save time and improve rankings with our powerful automation tools.' },
        { pageId: 'page_3', url: '/pricing', oldTitle: 'Pricing', newTitle: 'Affordable Pricing Plans for Every Business', oldDescription: 'See our plans.', newDescription: 'Find the perfect plan to boost your visibility on search and AI.' },
    ];

    const siteData = sites.find(s => s.id === siteId) || seedSite;

    return { site: siteData, charts: { visibilityTrend, issuesFixed, pageStatus }, events, topImprovedPages };
};

export const getPages = async (siteId: string, {}: {}): Promise<Page[]> => {
    console.log(`Fetching pages for site: ${siteId}`);
    if (siteId === 'site_456' && localStorage.getItem('userEmail') === 'empty@example.com') {
         await delay(800);
         return [];
    }
    await delay(800);
    return mockPages;
};

export const forceRecrawl = async (pageId: string): Promise<void> => {
    console.log(`Forcing recrawl for page: ${pageId}`);
    await delay(1000);
};

export const pingForIndex = async (pageId: string): Promise<void> => {
    console.log(`Pinging for index for page: ${pageId}`);
    await delay(1000);
};

export const getPageDetails = async (pageId: string): Promise<PageDetails> => {
    console.log(`Getting details for page: ${pageId}`);
    await delay(700);
    if (!pageId) {
        throw new Error("Page ID is required");
    }
    return mockPageDetails;
}

export const optimizePage = async (pageId: string, context?: { title: string, description: string }): Promise<PageOutput> => {
    console.log(`Optimizing page: ${pageId} with context`, context);
    await delay(2500);
     if(context?.title && context?.description) {
        return {
            id: `out_${Math.floor(Math.random() * 1000)}`,
            metaTitle: context.title,
            metaDescription: context.description,
            jsonLd: { ...mockPageDetails.jsonLd, headline: context.title },
            modelVersion: 'gemini-2.0-context',
            createdAt: new Date().toISOString(),
        }
    }
    return {
        id: `out_${Math.floor(Math.random() * 1000)}`,
        metaTitle: 'AI-Powered SEO: The Future is Now | DualPilot',
        metaDescription: 'Explore the next generation of search engine optimization driven by powerful artificial intelligence. Learn how to leverage AI for content, links, and technical SEO.',
        jsonLd: { ...mockPageDetails.jsonLd, headline: 'AI-Powered SEO: The Future is Now' },
        modelVersion: 'gemini-2.0',
        createdAt: new Date().toISOString(),
    };
};

export const getBillingInfo = async (): Promise<{ invoices: Invoice[] }> => {
    await delay(600);
    return {
        invoices: [
            { id: 'inv_1', date: '2023-10-01', amount: '$99.00', status: 'Paid', pdfUrl: '#' },
            { id: 'inv_2', date: '2023-09-01', amount: '$99.00', status: 'Paid', pdfUrl: '#' },
        ]
    };
};

export const getTeamMembers = async (): Promise<TeamMember[]> => {
    await delay(600);
    return [
        { id: 'tm_1', name: 'You', email: 'test@example.com', role: 'Admin' },
        { id: 'tm_2', name: 'Jane Doe', email: 'jane@example.com', role: 'Member' },
    ];
};

export const getReportData = async (dateRange: { start: Date, end: Date }, compare: boolean): Promise<ReportData> => {
    console.log('Fetching report data', dateRange, compare);
    await delay(1500);
    
    const generateGscData = (days: number, offset = 0): GscDataPoint[] => Array.from({ length: days }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (days - 1 - i) - offset);
        return {
            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            clicks: 100 + Math.sin(i / 5) * 20 + Math.random() * 10 + (offset > 0 ? -20 : 0),
            impressions: 2000 + Math.sin(i / 5) * 300 + Math.random() * 200 + (offset > 0 ? -300 : 0),
        };
    });

    const generateAiCoverage = (offset = 0): AiCoverageData[] => [
        { name: 'Covered', value: 85 + offset },
        { name: 'Not Covered', value: 15 - offset },
    ];

    const days = Math.round((dateRange.end.getTime() - dateRange.start.getTime()) / (1000 * 3600 * 24)) + 1;
    
    return {
        summary: "This period saw a significant 15% increase in organic clicks, driven by a 12% rise in impressions. The 'AI in SEO' blog post was a top performer. AI Schema Coverage improved by 5 percentage points, now covering 85% of your site. Focus on converting the increased traffic from your '/features' pages next period.",
        gscPerformance: {
            current: generateGscData(days),
            previous: generateGscData(days, days),
        },
        aiCoverage: {
            current: generateAiCoverage(),
            previous: generateAiCoverage(-5),
        },
        topPageImprovements: [
            { url: '/blog/post-1', scoreChange: 15 },
            { url: '/features/new', scoreChange: 12 },
            { url: '/about-us', scoreChange: 9 },
            { url: '/pricing', scoreChange: 7 },
        ],
        optimizationActivity: [
            { pageId: 'page_1', url: '/blog/post-1', date: '2023-10-26', scoreChange: 15, keywords: ['AI', 'SEO', 'future'] },
            { pageId: 'page_2', url: '/features/new', date: '2023-10-25', scoreChange: 12, keywords: ['automation', 'new feature'] },
        ]
    };
};

export const getAiVisibilityData = async () => {
    await delay(1000);
    const generateGscData = (days: number): GscDataPoint[] => Array.from({ length: days }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (days - 1 - i));
        return {
            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            clicks: 5 + Math.sin(i / 2) * 2 + Math.random() * 3, // Lower numbers for "AI" queries
            impressions: 150 + Math.sin(i / 2) * 20 + Math.random() * 15,
        };
    });

    return {
        pages: mockPages.filter(p => p.status !== PageStatus.Pending),
        gscData: generateGscData(30),
        siteProfile: localStorage.getItem('siteProfile') || 'A demo SaaS company specializing in AI-powered SEO tools.'
    };
};


export const generateAiSummary = async (prompt: string): Promise<string> => {
    await delay(3000);
    return `Based on your request to analyze the competition for "AI-powered SEO tools", here are the key takeaways:

1.  **Top Competitors:** Your main competitors are SEMrush, Ahrefs, and Moz. They dominate the SERPs with comprehensive guides and case studies.
2.  **Content Gaps:** There's a noticeable lack of content focusing on AI-driven schema generation and real-time AI conversation readiness. This is a significant opportunity.
3.  **Emerging Keywords:** Look to target long-tail keywords like "how to prepare website for AI assistants" and "automated schema markup for e-commerce".

**Suggested Action:** Create a detailed blog post or whitepaper titled "The Ultimate Guide to AI Assistant Readiness" targeting these identified gaps and keywords.`;
};

export const getSiteProfile = async (): Promise<string> => {
    await delay(100);
    return localStorage.getItem('siteProfile') || 'A demo SaaS company specializing in AI-powered SEO tools.';
}

const sites: Site[] = [
    seedSite,
    {
        id: 'site_456',
        siteName: 'My Super Blog',
        domain: 'my-super-blog.com',
        plan: PlanId.Essentials,
        optimizedPages: 40,
        totalPages: 50,
        visibilityScore: 85,
        refreshPolicy: 'Weekly refresh',
    }
];