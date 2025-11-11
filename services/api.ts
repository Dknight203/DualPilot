import {
    ScanResult, Site, PlanId, Page, PageStatus, LineChartData, StackedBarChartData,
    PieChartData, Event, ImprovedPage, PageDetails, PageOutput, Invoice, TeamMember,
    ApiKey, ReportData, GscDataPoint, AiCoverageData, ActionAnnotation, ImpactAnalysisItem, CmsConnection,
    InitialOptimizations, BrandingSettings
} from '../types';
import { GoogleGenAI } from '@google/genai';

// --- MOCK DATA ---
const userSites: { [key: string]: Site[] } = {
    'test@example.com': [
        { id: 'site_123', siteName: 'DualPilot Demo', domain: 'dualpilot.ai', plan: PlanId.Pro, optimizedPages: 180, totalPages: 250, visibilityScore: 91, refreshPolicy: 'Daily refresh' },
    ],
    'agency@example.com': [
        { id: 'site_456', siteName: 'Agency Client Site', domain: 'agency-client.com', plan: PlanId.Agency, optimizedPages: 450, totalPages: 1000, visibilityScore: 88, refreshPolicy: 'Daily refresh' },
        { id: 'site_789', siteName: 'Another Client Corp', domain: 'another-client.com', plan: PlanId.Agency, optimizedPages: 120, totalPages: 250, visibilityScore: 94, refreshPolicy: 'Daily refresh' },
    ],
    'newbie@example.com': [
        { id: 'site_new', siteName: 'New User Site', domain: 'new-user-site.com', plan: PlanId.Pro, optimizedPages: 0, totalPages: 50, visibilityScore: 0, refreshPolicy: 'Daily refresh' }
    ],
    'empty@example.com': [],
};


const mockPages: Page[] = [
    { id: 'page_01', url: '/blog/ai-seo-strategies', lastOptimized: '2023-10-26', score: 95, status: PageStatus.Optimized },
    { id: 'page_02', url: '/features/visibility-score', lastOptimized: '2023-10-25', score: 92, status: PageStatus.Optimized },
    { id: 'page_03', url: '/pricing', lastOptimized: '2023-10-20', score: 88, status: PageStatus.Optimized },
    { id: 'page_04', url: '/about-us', lastOptimized: null, score: 65, status: PageStatus.NeedsReview },
    { id: 'page_05', url: '/blog/new-feature-launch', lastOptimized: '2023-10-15', score: 78, status: PageStatus.Optimized },
    { id: 'page_06', url: '/docs/getting-started', lastOptimized: null, score: 0, status: PageStatus.Pending },
    { id: 'page_07', url: '/contact', lastOptimized: '2023-09-01', score: 90, status: PageStatus.Optimized },
];

const mockImprovedPages: ImprovedPage[] = [
    { pageId: 'page_01', url: '/blog/ai-seo-strategies', oldTitle: 'AI SEO Tips', newTitle: '7 Advanced AI SEO Strategies to Dominate in 2024', oldDescription: 'Some tips for AI SEO.', newDescription: 'Unlock the future of search with these 7 advanced AI SEO strategies. Learn how to leverage machine learning for top rankings.' },
    { pageId: 'page_02', url: '/features/visibility-score', oldTitle: 'Visibility Score', newTitle: 'What is a Visibility Score? | DualPilot Feature', oldDescription: 'Our visibility score.', newDescription: 'Discover how DualPilot\'s proprietary Visibility Score measures your site\'s health for both classic search engines and modern AI assistants.' },
    { pageId: 'page_03', url: '/pricing', oldTitle: 'Pricing', newTitle: 'Simple, Transparent Pricing | DualPilot', oldDescription: 'See our prices.', newDescription: 'Choose the plan that fits your needs. No hidden fees, ever. Start with our Essentials plan or scale with Pro and Agency.' },
];

const mockApiKeys: ApiKey[] = [
    { id: 'key_1', name: 'CMS Integration', lastFour: 'a1b2', createdAt: '2023-10-15T10:00:00Z', status: 'active' },
    { id: 'key_2', name: 'Reporting Script', lastFour: 'c3d4', createdAt: '2023-09-01T14:30:00Z', status: 'active' },
];

let mockTeamMembers: TeamMember[] = [
    { id: 'user_1', name: 'Alex Smith (You)', email: 'test@example.com', role: 'Admin', status: 'Active', isOwner: true, avatarUrl: `https://i.pravatar.cc/150?u=test@example.com` },
    { id: 'user_2', name: 'Jane Doe', email: 'jane@example.com', role: 'Member', status: 'Active', avatarUrl: `https://i.pravatar.cc/150?u=jane@example.com` },
    { id: 'user_3', name: 'Mike Johnson', email: 'mike@example.com', role: 'Admin', status: 'Active', avatarUrl: `https://i.pravatar.cc/150?u=mike@example.com` },
    { id: 'user_4', name: 'Sarah Lee', email: 'agency@example.com', role: 'Admin', status: 'Active', isOwner: true, avatarUrl: `https://i.pravatar.cc/150?u=agency@example.com` },
];

let mockCmsConnection: CmsConnection | null = null;

// Stateful store for page details to make approve actions feel real
const mockPageDetailsStore: { [key: string]: PageDetails } = {};

const generateMockPageDetails = (page: Page): PageDetails => ({
    ...page,
    metaTitle: 'Original Meta Title for ' + page.url,
    metaDescription: 'Original meta description for this page. It is not yet optimized by AI.',
    jsonLd: { "@context": "https://schema.org", "@type": "WebPage", "name": 'Original Meta Title for ' + page.url },
    userKeywords: ['keyword1', 'keyword2'],
    aiKeywords: ['ai-keyword1', 'ai-keyword2', 'ai-keyword3'],
    history: [
        { id: `out_initial_${page.id}`, metaTitle: 'Original Meta Title for ' + page.url, metaDescription: 'Original meta description for this page.', jsonLd: {}, modelVersion: 'N/A', createdAt: '2023-01-01T10:00:00Z' }
    ],
});


// --- API SIMULATION ---
const simulateApiCall = <T>(data: T, delay = 500): Promise<T> => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(JSON.parse(JSON.stringify(data))); // Deep copy to prevent mutation
        }, delay);
    });
};

// --- API FUNCTIONS ---

export const scanDomain = (domain: string): Promise<ScanResult> => {
    const score = Math.floor(Math.random() * (95 - 60 + 1) + 60);
    const result: ScanResult = {
        score,
        classicReadiness: score > 70,
        aiReadiness: score > 80,
        issues: [
            '3 pages have no meta description',
            'Missing Product schema on /shop/item-1',
            'Improve internal linking to /features',
        ],
        suggestedNextStep: 'Automate fixes and boost your score!',
    };
    return simulateApiCall(result, 1500);
};

export const createCheckoutSession = (planId: string): Promise<{ checkoutUrl: string }> => {
    return simulateApiCall({ checkoutUrl: `https://stripe.com/checkout/mock_session_for_${planId}` });
};

export const verifyDomain = (domain: string): Promise<{ verified: boolean; heartbeat: string }> => {
    return simulateApiCall({ verified: true, heartbeat: new Date().toISOString() });
};

export const getSites = (): Promise<Site[]> => {
    const userEmail = localStorage.getItem('userEmail') || '';
    const sitesForUser = userSites[userEmail] || [];
    return simulateApiCall(sitesForUser);
};

export const getDashboardData = (siteId: string) => {
    const allSites = Object.values(userSites).flat();
    const site = allSites.find(s => s.id === siteId);

    // Generate some mock chart data
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
        { name: PageStatus.Pending, value: 25 },
        { name: PageStatus.Failed, value: 0 },
    ];
    
    const events: Event[] = [
        { id: 'evt_1', type: 'Site Crawl', status: 'Success', timestamp: new Date().toISOString(), details: 'Crawled 250 pages, found 5 new.' },
        { id: 'evt_2', type: 'AI Optimization', status: 'Success', timestamp: new Date().toISOString(), details: 'Optimized 12 pages.' },
        { id: 'evt_3', type: 'Index Ping', status: 'Success', timestamp: new Date().toISOString(), details: 'Pinged Google & Bing for 12 pages.' },
    ];

    const data = {
        site,
        charts: { visibilityTrend, issuesFixed, pageStatus },
        events,
        topImprovedPages: mockImprovedPages,
    };
    return simulateApiCall(data, 1000);
};

export const getPages = (siteId: string, options: any): Promise<Page[]> => {
    return simulateApiCall(mockPages);
};

export const forceRecrawl = (pageId: string): Promise<void> => {
    console.log(`Force recrawl requested for ${pageId}`);
    return simulateApiCall(undefined);
};

export const pingForIndex = (pageId: string): Promise<void> => {
    console.log(`Ping for index sent for ${pageId}`);
    return simulateApiCall(undefined);
};

export const bulkApprovePages = (pageIds: string[]): Promise<{ success: boolean }> => {
    console.log(`Bulk approving ${pageIds.length} pages:`, pageIds);
    // In a real app, you'd update the status of these pages in the database.
    return simulateApiCall({ success: true }, 1000);
};

export const getPageDetails = (pageId: string): Promise<PageDetails> => {
    // If we have a stateful version in our store, use it
    if (mockPageDetailsStore[pageId]) {
        return simulateApiCall(mockPageDetailsStore[pageId], 800);
    }

    // Otherwise, generate and store it for the first time
    const basePage = mockPages.find(p => p.id === pageId);
    if (!basePage) {
        // Create a fallback for IDs not in the main list for robustness
        const fallbackPage: Page = { id: pageId, url: `/unknown/page/${pageId}`, lastOptimized: null, score: 50, status: PageStatus.NeedsReview };
        const fallbackDetails = generateMockPageDetails(fallbackPage);
        mockPageDetailsStore[pageId] = fallbackDetails;
        return simulateApiCall(fallbackDetails, 800);
    }
    
    const details = generateMockPageDetails(basePage);
    mockPageDetailsStore[pageId] = details;
    return simulateApiCall(details, 800);
};

export const saveKeywords = (pageId: string, keywords: string[], includeAiKeywords: boolean): Promise<{ success: boolean }> => {
    console.log(`Saving keywords for page ${pageId}:`, { keywords, includeAiKeywords });
    if (mockPageDetailsStore[pageId]) {
        mockPageDetailsStore[pageId].userKeywords = keywords;
    }
    return simulateApiCall({ success: true }, 1000);
};

export const optimizePage = (pageId: string): Promise<PageOutput> => {
    const newOutput: PageOutput = {
        id: `out_${Math.random().toString(36).substr(2, 9)}`,
        metaTitle: `The Ultimate Guide to AI-Powered SEO | ${new Date().getFullYear()}`,
        metaDescription: `Discover the absolute best practices for AI-driven SEO. This comprehensive guide covers everything from keyword clustering to schema generation.`,
        jsonLd: { "@context": "https://schema.org", "@type": "Article", "headline": "The Ultimate Guide to AI-Powered SEO" },
        modelVersion: 'gemini-2.5-pro',
        createdAt: new Date().toISOString(),
    };
    return simulateApiCall(newOutput, 2500);
};

export const approveOptimization = (pageId: string, newOutput: PageOutput): Promise<{ success: boolean }> => {
    if (!mockPageDetailsStore[pageId]) {
        return Promise.reject('Page details not found in cache. Please refresh.');
    }

    const pageDetails = mockPageDetailsStore[pageId];
    pageDetails.history.push(newOutput);
    pageDetails.metaTitle = newOutput.metaTitle;
    pageDetails.metaDescription = newOutput.metaDescription;
    pageDetails.jsonLd = newOutput.jsonLd;
    pageDetails.lastOptimized = new Date().toISOString();
    pageDetails.score = Math.min(100, pageDetails.score + Math.floor(Math.random() * 5 + 3));
    pageDetails.status = PageStatus.Optimized;
    
    // Also update the main mockPages list so the dashboard table reflects the change
    const pageIndex = mockPages.findIndex(p => p.id === pageId);
    if (pageIndex > -1) {
        mockPages[pageIndex].status = PageStatus.Optimized;
        mockPages[pageIndex].score = pageDetails.score;
        mockPages[pageIndex].lastOptimized = pageDetails.lastOptimized;
    }
    
    return simulateApiCall({ success: true }, 1200);
};


export const getBillingInfo = (): Promise<{ invoices: Invoice[] }> => {
    const invoices: Invoice[] = [
        { id: 'inv_1', date: '2023-10-01', amount: '$99.00', status: 'Paid', pdfUrl: '#' },
        { id: 'inv_2', date: '2023-09-01', amount: '$99.00', status: 'Paid', pdfUrl: '#' },
    ];
    return simulateApiCall({ invoices });
};

export const getCurrentUser = (email: string): Promise<TeamMember | undefined> => {
    const user = mockTeamMembers.find(member => member.email === email);
    // If not found, create a placeholder Admin user for demo purposes
    if (!user && email) {
        const newUser: TeamMember = { id: 'user_new', name: 'New User', email, role: 'Admin', status: 'Active', avatarUrl: `https://i.pravatar.cc/150?u=${email}`};
        mockTeamMembers.push(newUser);
        return simulateApiCall(newUser);
    }
    return simulateApiCall(user);
};

export const saveSiteSettings = (siteId: string, newSiteName: string, newDomain: string): Promise<Site> => {
    let foundSite: Site | undefined;
    let siteUpdated = false;

    for (const userEmail in userSites) {
        const sitesForUser = userSites[userEmail];
        const siteIndex = sitesForUser.findIndex(s => s.id === siteId);

        if (siteIndex > -1) {
            sitesForUser[siteIndex] = {
                ...sitesForUser[siteIndex],
                siteName: newSiteName,
                domain: newDomain,
            };
            foundSite = sitesForUser[siteIndex];
            siteUpdated = true;
            break;
        }
    }

    if (siteUpdated && foundSite) {
        return simulateApiCall(foundSite, 800);
    } else {
        return Promise.reject('Site not found');
    }
};

export const updateUserProfile = (userId: string, data: Partial<Pick<TeamMember, 'name' | 'email' | 'avatarUrl'>>): Promise<TeamMember> => {
    const memberIndex = mockTeamMembers.findIndex(m => m.id === userId);
    if (memberIndex > -1) {
        mockTeamMembers[memberIndex] = { ...mockTeamMembers[memberIndex], ...data };
        
        // If email changed, we need to update localStorage for the demo to work
        if(data.email) {
            localStorage.setItem('userEmail', data.email);
        }
        
        return simulateApiCall(mockTeamMembers[memberIndex]);
    }
    return Promise.reject('User not found');
};

export const changePassword = (userId: string, currentPass: string, newPass: string): Promise<{ success: boolean }> => {
    // In a real app, this would be a secure backend call.
    // For the demo, we'll just pretend it always works if the current pass is "password".
    if (currentPass === 'password') {
        return simulateApiCall({ success: true }, 1000);
    }
    return Promise.reject('Incorrect current password');
};


export const getTeamMembers = (): Promise<TeamMember[]> => {
    const currentUserEmail = localStorage.getItem('userEmail');
    // Filter out the current user for the list view
    return simulateApiCall(mockTeamMembers.filter(m => m.email !== currentUserEmail));
};

export const inviteTeamMember = (email: string, role: 'Admin' | 'Member'): Promise<TeamMember> => {
    const newMember: TeamMember = {
        id: `user_${Math.random()}`,
        name: '(Pending)',
        email,
        role,
        status: 'Pending Invitation',
        avatarUrl: `https://i.pravatar.cc/150?u=${email}`,
    };
    mockTeamMembers.unshift(newMember);
    return simulateApiCall(newMember);
};

export const updateTeamMemberRole = (memberId: string, role: 'Admin' | 'Member'): Promise<TeamMember> => {
    const member = mockTeamMembers.find(m => m.id === memberId);
    if (member) {
        member.role = role;
        return simulateApiCall(member, 300);
    }
    return Promise.reject('Member not found');
};

export const removeTeamMember = (memberId: string): Promise<{ success: boolean }> => {
    const memberIndex = mockTeamMembers.findIndex(m => m.id === memberId);
    if (memberIndex > -1) {
        mockTeamMembers.splice(memberIndex, 1);
        return simulateApiCall({ success: true }, 800);
    }
    return Promise.reject('Member not found');
};


export const getApiKeys = (): Promise<ApiKey[]> => {
    return simulateApiCall(mockApiKeys);
};

export const generateApiKey = (name: string): Promise<ApiKey> => {
    const randomString = Math.random().toString(36).substring(2, 22);
    const newKey: ApiKey = {
        id: `key_${Math.random()}`,
        name,
        key: `dp_live_${randomString}`, // The full key
        lastFour: randomString.slice(-4),
        createdAt: new Date().toISOString(),
        status: 'active',
    };
    mockApiKeys.unshift(newKey); // Add to the beginning of the list
    return simulateApiCall(JSON.parse(JSON.stringify(newKey)), 800);
};

export const revokeApiKey = (keyId: string): Promise<void> => {
    const index = mockApiKeys.findIndex(k => k.id === keyId);
    if (index > -1) {
        mockApiKeys.splice(index, 1);
    }
    return simulateApiCall(undefined);
};

export const getCmsConnection = (): Promise<CmsConnection | null> => {
    return simulateApiCall(mockCmsConnection);
};

export const connectCms = (type: 'wordpress', siteUrl: string): Promise<{ success: boolean }> => {
    mockCmsConnection = { type, siteUrl };
    return simulateApiCall({ success: true }, 1500);
};

export const disconnectCms = (): Promise<{ success: boolean }> => {
    mockCmsConnection = null;
    return simulateApiCall({ success: true });
};


const generateGscData = (days: number, offset = 0, factor = 1): GscDataPoint[] => {
    return Array.from({ length: days }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (days - 1 - i) - offset);
        const clicks = (50 + Math.sin(i / 5) * 20 + Math.random() * 10) * factor;
        const impressions = (1000 + Math.sin(i / 5) * 300 + Math.random() * 200) * factor;
        return {
            date: date.toLocaleDateString('en-CA'), // YYYY-MM-DD
            clicks: Math.max(0, clicks),
            impressions: Math.max(0, impressions),
        };
    });
};

export const getReportData = (dateRange: { start: Date, end: Date }, compare: boolean): Promise<ReportData> => {
    const days = Math.round((dateRange.end.getTime() - dateRange.start.getTime()) / (1000 * 3600 * 24)) + 1;
    
    const data: ReportData = {
        summary: "This period saw a significant 15% increase in organic clicks, primarily driven by optimizations to blog content. The 'AI SEO Strategies' page was a top performer. AI Schema Coverage improved by 5 points, but there's still room to grow by implementing Product schema on shop pages.",
        gscPerformance: {
            current: generateGscData(days),
            previous: compare ? generateGscData(days, days, 0.85) : [],
        },
        aiCoverage: {
            current: [{ name: 'Covered', value: 78 }, { name: 'Not Covered', value: 22 }],
            previous: [{ name: 'Covered', value: 73 }, { name: 'Not Covered', value: 27 }],
        },
        topPageImprovements: mockImprovedPages.map(p => ({ url: p.url, scoreChange: Math.floor(Math.random() * 5 + 3) })),
        optimizationActivity: mockPages.slice(0, 4).map(p => ({
            pageId: p.id,
            url: p.url,
            date: new Date().toISOString(),
            scoreChange: Math.floor(Math.random() * 5 + 1),
            keywords: ['ai seo', 'optimization', 'schema'],
        })),
        annotations: [
            { date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toLocaleDateString('en-CA'), type: 'Optimization', description: 'Optimized blog pages' },
            { date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-CA'), type: 'Schema', description: 'Added FAQ Schema' }
        ],
        impactAnalysis: [
            { type: 'AI Blog Optimizations', impact: 'High', description: 'Generated a 25% lift in clicks for targeted blog posts.' },
            { type: 'FAQ Schema Rollout', impact: 'Medium', description: 'Increased SERP real estate, contributing to a 5% CTR improvement.' },
        ],
    };
    return simulateApiCall(data, 1200);
};

export const getAiVisibilityData = (): Promise<{ pages: Page[], siteProfile: string }> => {
    const profile = localStorage.getItem('siteProfile') || "DualPilot is a SaaS company providing an automated AI and Search visibility engine. It helps users audit pages, generate AI-ready metadata and schema, and maintain visibility across classic search engines and AI assistants.";
    return simulateApiCall({ pages: mockPages, siteProfile: profile });
};

export const getSiteProfile = (): Promise<string> => {
    const profile = localStorage.getItem('siteProfile') || "DualPilot is a SaaS company providing an automated AI and Search visibility engine. It helps users audit pages, generate AI-ready metadata and schema, and maintain visibility across classic search engines and AI assistants.";
    return simulateApiCall(profile);
};

export const getInitialOptimizations = (): Promise<InitialOptimizations> => {
    const result: InitialOptimizations = {
        optimizablePages: 32,
        examples: [
            { url: '/blog/old-post-1', oldTitle: 'Old Post', newTitle: 'A Much Better Title for an Old Post' },
            { url: '/services/page', oldTitle: 'Services', newTitle: 'Our Premier Services for Your Business' },
            { url: '/about-us', oldTitle: 'About', newTitle: 'About Our Company | Our Mission and Vision' },
        ],
    };
    return simulateApiCall(result, 1000);
};

export const bulkApproveOptimizations = (): Promise<{ success: boolean }> => {
    return simulateApiCall({ success: true }, 1500);
};


// --- BRANDING API ---
export const getBrandingSettings = (): Promise<BrandingSettings | null> => {
    const settingsStr = localStorage.getItem('brandingSettings');
    const settings = settingsStr ? JSON.parse(settingsStr) : null;
    return simulateApiCall(settings);
};

export const updateBrandingLogo = (logoUrl: string): Promise<BrandingSettings> => {
    const settings = { logoUrl };
    localStorage.setItem('brandingSettings', JSON.stringify(settings));
    return simulateApiCall(settings);
};

export const removeBrandingLogo = (): Promise<{ success: boolean }> => {
    localStorage.removeItem('brandingSettings');
    return simulateApiCall({ success: true });
};

// --- PASSWORD RESET API ---
export const requestPasswordReset = (email: string): Promise<{ success: boolean }> => {
    console.log(`Simulating password reset request for: ${email}`);
    // In a real app, this would generate a token and send an email.
    return simulateApiCall({ success: true }, 1000);
};

export const resetPassword = (token: string, newPassword: string): Promise<{ success: boolean }> => {
    console.log(`Simulating password reset for token: ${token} with new password.`);
    // In a real app, this would validate the token and update the user's password.
    return simulateApiCall({ success: true }, 1000);
};


// FIX: Correctly initialize GoogleGenAI as per guidelines.
const ai = new GoogleGenAI({apiKey: process.env.API_KEY || ''});
export const generateAiSummary = async (prompt: string): Promise<string> => {
    // This is the only function that would make a real API call.
    // For the demo, we'll return a mock response to avoid needing a real key.
    
    // START: Real implementation example
    /*
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (e) {
        console.error(e);
        return "Error: Could not connect to the AI model. Please check your API key.";
    }
    */
    // END: Real implementation example

    // Mock implementation for the demo
    await new Promise(res => setTimeout(res, 1500));
    if (prompt.toLowerCase().includes('summarize')) {
        return "This blog post discusses advanced strategies for AI-powered SEO. Key takeaways include leveraging natural language processing for keyword research, automating schema generation, and using AI to create contextually relevant meta descriptions that improve click-through rates.";
    }
    return "Based on the site profile, DualPilot is an AI-powered SEO tool designed to improve online visibility. Key features include automated metadata and schema generation, a proprietary 'Visibility Score', and continuous site monitoring. It competes with other SEO platforms by focusing on readiness for modern AI assistants in addition to traditional search engines.";
};