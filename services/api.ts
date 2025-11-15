import {
    ScanResult, Site, PlanId, Page, PageStatus, LineChartData, StackedBarChartData,
    PieChartData, Event, ImprovedPage, PageDetails, PageOutput, Invoice, TeamMember,
    ApiKey, ReportData, CmsConnection,
    InitialOptimizations, BrandingSettings, Platform, OptimizationExample
} from '../types';
import { supabase } from '../supabaseClient';
import { seedSite } from '../data/seeds';


// --- MOCK DATABASE ---
// This will act as our in-memory "database" for the mock API.
const MOCK_DB = {
    sites: [seedSite],
    pages: {
        [seedSite.id]: [
            { id: 'page_01', url: '/blog/ai-seo-strategies', lastOptimized: '2023-10-26', score: 95, status: PageStatus.Optimized },
            { id: 'page_02', url: '/features/visibility-score', lastOptimized: '2023-10-25', score: 92, status: PageStatus.Optimized },
            { id: 'page_03', url: '/pricing', lastOptimized: '2023-10-20', score: 88, status: PageStatus.Optimized },
            { id: 'page_04', url: '/about-us', lastOptimized: null, score: 65, status: PageStatus.NeedsReview },
            { id: 'page_05', url: '/contact', lastOptimized: null, score: 70, status: PageStatus.NeedsReview },
        ]
    },
    pageDetails: {
        'page_01': {
            id: 'page_01', url: '/blog/ai-seo-strategies', lastOptimized: '2023-10-26', score: 95, status: PageStatus.Optimized,
            metaTitle: '7 Advanced AI SEO Strategies to Dominate in 2024',
            metaDescription: 'Unlock the future of search with these 7 advanced AI SEO strategies. Learn how to leverage machine learning for top rankings.',
            jsonLd: { "@context": "https://schema.org", "@type": "BlogPosting", "headline": "AI SEO" },
            userKeywords: ['ai seo', 'machine learning seo'],
            aiKeywords: ['search engine optimization', 'generative ai', 'content strategy'],
            history: [
                { id: 'out_01a', metaTitle: 'AI SEO Tips', metaDescription: 'Some tips for AI SEO.', jsonLd: {}, modelVersion: '1.0', createdAt: '2023-10-25' },
                { id: 'out_01b', metaTitle: '7 Advanced AI SEO Strategies to Dominate in 2024', metaDescription: 'Unlock the future of search with these 7 advanced AI SEO strategies. Learn how to leverage machine learning for top rankings.', jsonLd: { "@context": "https://schema.org", "@type": "BlogPosting", "headline": "AI SEO" }, modelVersion: '1.1', createdAt: '2023-10-26' },
            ]
        } as PageDetails
    },
    // FIX: Explicitly typed the array as TeamMember[] to match the type definition and resolve type errors.
    teamMembers: [
        { id: 'user_current', name: 'You', email: 'chrisley.ceme@gmail.com', role: 'Admin', status: 'Active', isOwner: true },
        { id: 'user_02', name: 'Jane Doe', email: 'jane@dualpilot.ai', role: 'Member', status: 'Active' },
        { id: 'user_03', name: 'john.doe@example.com', email: 'john.doe@example.com', role: 'Member', status: 'Pending Invitation' },
    ] as TeamMember[],
    // FIX: Explicitly typed the array as ApiKey[] to match the type definition and resolve type errors.
    apiKeys: [
        { id: 'key_01', name: 'My Main App', lastFour: 'a1b2', createdAt: new Date().toISOString(), status: 'active' }
    ] as ApiKey[],
    branding: { logoUrl: null } as BrandingSettings,
    cmsConnections: [] as (CmsConnection & { id: string; site_id: string; verification_token: string; verified: boolean })[],
};

// --- MOCK DATA GENERATORS (for features not yet connected to backend) ---
const mockImprovedPages: ImprovedPage[] = [
    { pageId: 'page_01', url: '/blog/ai-seo-strategies', oldTitle: 'AI SEO Tips', newTitle: '7 Advanced AI SEO Strategies to Dominate in 2024', oldDescription: 'Some tips for AI SEO.', newDescription: 'Unlock the future of search with these 7 advanced AI SEO strategies. Learn how to leverage machine learning for top rankings.' },
    { pageId: 'page_02', url: '/features/visibility-score', oldTitle: 'Visibility Score', newTitle: 'What is a Visibility Score? | DualPilot Feature', oldDescription: 'Our visibility score.', newDescription: 'Discover how DualPilot\'s proprietary Visibility Score measures your site\'s health for both classic search engines and modern AI assistants.' },
];
// ... (rest of mock data can be kept for now for other components)


// --- API SIMULATION ---
const simulateApiCall = <T>(data: T, delay = 500): Promise<T> => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(JSON.parse(JSON.stringify(data))); // Deep copy to prevent mutation
        }, delay);
    });
};

// --- REAL API FUNCTIONS (MOCKED) ---

// This was a partial function. Replacing with a full mock.
/**
 * Fetches all sites belonging to a specific user.
 */
export const getSites = async (userId: string): Promise<Site[]> => {
    console.log("Mock getSites called for userId:", userId);
    return simulateApiCall(MOCK_DB.sites);
};


// FIX: ADDED MISSING FUNCTIONS
// --- SCAN ---
export const scanDomain = async (domain: string): Promise<ScanResult> => {
    await simulateApiCall({}, 1500); // Simulate network delay
    return {
        score: 72,
        classicReadiness: true,
        aiReadiness: true,
        issues: [
            '3 pages are missing meta descriptions',
            '2 product pages are missing schema markup',
            'Consider adding an FAQ section to your pricing page',
        ],
        suggestedNextStep: `We found 180 pages that can be automatically optimized.`,
    };
};

// --- CHECKOUT/BILLING ---
export const createCheckoutSession = async (planId: string): Promise<{ checkoutUrl: string }> => {
    return simulateApiCall({ checkoutUrl: `https://stripe.com/checkout/mock_session_for_${planId}` });
};

export const getBillingInfo = async (): Promise<{ invoices: Invoice[] }> => {
    return simulateApiCall({
        invoices: [
            { id: 'inv_01', date: '2023-10-01', amount: '$99.00', status: 'Paid', pdfUrl: '#' },
            { id: 'inv_02', date: '2023-09-01', amount: '$99.00', status: 'Paid', pdfUrl: '#' },
        ]
    });
};

// --- ONBOARDING & INSTALL ---
export const startGscAuth = async (domain: string): Promise<{ authUrl: string }> => {
    if (!supabase) throw new Error("Supabase client not initialized.");
    const { data, error } = await supabase.functions.invoke('gsc-start-auth', {
        body: { domain },
    });
    if (error) throw error;
    return data;
};

export const pollGscStatus = async (domain: string): Promise<'pending' | 'connected' | 'error'> => {
    if (!supabase) throw new Error("Supabase client not initialized.");
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return 'pending';

    const { data, error } = await supabase
        .from('gsc_connections')
        .select('gsc_status')
        .eq('owner_id', user.id)
        .eq('domain', domain)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
    
    if (error || !data) {
        return 'pending';
    }
    return data.gsc_status as 'pending' | 'connected' | 'error';
};

export const checkGscConnection = async (siteId?: string): Promise<boolean> => {
    if (!supabase || !siteId) return false;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data, error } = await supabase
        .from('gsc_connections')
        .select('id')
        .eq('owner_id', user.id)
        .eq('site_id', siteId)
        .eq('gsc_status', 'connected')
        .limit(1)
        .single();
        
    return !error && !!data;
};

export const verifyDomain = async (domain: string): Promise<{ verified: boolean, heartbeat: string | null }> => {
    return simulateApiCall({ verified: true, heartbeat: new Date().toISOString() });
};

export const addSite = async (domain: string, platform: Platform, plan: PlanId, siteProfile: string, totalPages: number = 0): Promise<Site> => {
    const newSite: Site = {
        id: `site_${Date.now()}`,
        siteName: domain,
        domain,
        plan,
        optimizedPages: 0,
        totalPages,
        visibilityScore: 0,
        refreshPolicy: 'Daily refresh',
        platform,
        siteProfile,
    };
    MOCK_DB.sites.push(newSite);
    MOCK_DB.pages[newSite.id] = [];
    return simulateApiCall(newSite);
};

export const createGscConnection = async (siteId: string, domain: string): Promise<void> => {
    if (!supabase) throw new Error("Supabase client not initialized.");
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User must be logged in.");

    // This finds the most recent pending GSC connection for the user and associates it with the new siteId
    const { data: conn, error: findError } = await supabase
        .from('gsc_connections')
        .select('id')
        .eq('owner_id', user.id)
        .eq('domain', domain)
        .eq('gsc_status', 'connected')
        .is('site_id', null)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

    if (findError || !conn) {
        console.warn("No pending GSC connection found to associate with site:", siteId);
        return;
    }

    const { error: updateError } = await supabase
        .from('gsc_connections')
        .update({ site_id: siteId })
        .eq('id', conn.id);

    if (updateError) {
        console.error("Error associating GSC connection with site:", updateError);
        throw updateError;
    }
};

export const createCmsConnection = async (siteId: string, type: Platform): Promise<{ id: string, verification_token: string }> => {
    const newConnection = {
        id: `cms_${Date.now()}`,
        site_id: siteId,
        type: type,
        verification_token: `dp_token_${Math.random().toString(36).substring(2)}`,
        verified: false,
    };
    MOCK_DB.cmsConnections.push(newConnection as any);
    return simulateApiCall({ id: newConnection.id, verification_token: newConnection.verification_token });
};

export const connectCms = async (type: 'wordpress', siteUrl: string): Promise<void> => {
    console.log(`Connecting to ${type} at ${siteUrl}`);
    return simulateApiCall(undefined);
};

export const getCmsConnectionStatus = async (connectionId: string): Promise<{ verified: boolean }> => {
    // In a real app, this polls the backend. Here, we just simulate success after a few tries.
    const shouldSucceed = Math.random() > 0.3; // 70% chance of success
    if (shouldSucceed) {
        const conn = MOCK_DB.cmsConnections.find(c => c.id === connectionId);
        if (conn) conn.verified = true;
    }
    return simulateApiCall({ verified: shouldSucceed });
};

export const getInitialOptimizations = async (): Promise<InitialOptimizations> => {
    const examples: OptimizationExample[] = mockImprovedPages.map(p => ({
        url: p.url,
        oldTitle: p.oldTitle,
        newTitle: p.newTitle,
    }));
    return simulateApiCall({
        optimizablePages: 180,
        examples: examples.slice(0, 2),
    });
};

// --- DASHBOARD ---
export const getDashboardData = async (siteId: string) => {
    const site = MOCK_DB.sites.find(s => s.id === siteId) || seedSite;
    return simulateApiCall({
        site,
        charts: {
            visibilityTrend: Array.from({ length: 30 }, (_, i) => ({
                date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                score: 75 + Math.sin(i / 4) * 10 + Math.random() * 5,
            })),
            issuesFixed: Array.from({ length: 30 }, (_, i) => ({
                date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                title: Math.floor(Math.random() * 5), description: Math.floor(Math.random() * 8), canonical: Math.floor(Math.random() * 2), schema: Math.floor(Math.random() * 4), brokenLinks: Math.floor(Math.random() * 1)
            })),
            pageStatus: [
                { name: PageStatus.Optimized, value: site.optimizedPages },
                { name: PageStatus.NeedsReview, value: site.totalPages - site.optimizedPages },
                { name: PageStatus.Pending, value: 0 },
            ]
        },
        // FIX: Explicitly typed the events array as Event[] to match the type definition and resolve type errors downstream.
        events: [
            { id: 'evt_01', type: 'Site Crawl', status: 'Success', timestamp: new Date().toISOString(), details: 'Crawled 250 pages' },
            { id: 'evt_02', type: 'Optimization', status: 'Success', timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), details: 'Optimized /blog/ai-seo-strategies' },
            { id: 'evt_03', type: 'Index Ping', status: 'In Progress', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), details: 'Pinged Google & Bing for 5 pages' },
        ] as Event[],
        topImprovedPages: mockImprovedPages,
    });
};

export const getPages = async (siteId: string, options: {}): Promise<Page[]> => {
    return simulateApiCall(MOCK_DB.pages[siteId] || []);
};

export const forceRecrawl = async (pageId: string): Promise<void> => {
    console.log(`Forcing recrawl for page ${pageId}`);
    return simulateApiCall(undefined);
};

export const pingForIndex = async (pageId: string): Promise<void> => {
    console.log(`Pinging for index for page ${pageId}`);
    return simulateApiCall(undefined);
};

export const bulkApprovePages = async (pageIds: string[]): Promise<void> => {
    console.log(`Bulk approving pages:`, pageIds);
    return simulateApiCall(undefined);
};

export const bulkApproveOptimizations = async (): Promise<void> => {
    console.log('Bulk approving initial optimizations');
    return simulateApiCall(undefined, 1000);
};

// --- PAGE DETAIL ---
export const getPageDetails = async (pageId: string): Promise<PageDetails> => {
    const details = MOCK_DB.pageDetails[pageId];
    if (details) return simulateApiCall(details);

    // Fallback for pages without specific details
    const siteId = seedSite.id;
    const page = MOCK_DB.pages[siteId]?.find(p => p.id === pageId);
    if (!page) throw new Error("Page not found");

    return simulateApiCall({
        ...page,
        metaTitle: 'Generic Page Title',
        metaDescription: 'This is a generic meta description for the page.',
        jsonLd: {},
        userKeywords: [],
        aiKeywords: ['generic', 'placeholder'],
        history: [],
    });
};

export const optimizePage = async (pageId: string): Promise<PageOutput> => {
    const newOutput: PageOutput = {
        id: `out_${Date.now()}`,
        metaTitle: `AI Optimized Title for ${pageId} at ${new Date().toLocaleTimeString()}`,
        metaDescription: `This is a new, AI-generated meta description that is highly optimized for user engagement and SEO best practices.`,
        jsonLd: { "@context": "https://schema.org", "@type": "WebPage", "headline": "New AI Content" },
        modelVersion: '1.2',
        createdAt: new Date().toISOString(),
    };
    return simulateApiCall(newOutput, 1500);
};

export const approveOptimization = async (pageId: string, output: PageOutput): Promise<void> => {
    console.log(`Approving optimization for page ${pageId}:`, output);
    if (MOCK_DB.pageDetails[pageId]) {
        MOCK_DB.pageDetails[pageId].history.push(output);
        MOCK_DB.pageDetails[pageId].metaTitle = output.metaTitle;
        MOCK_DB.pageDetails[pageId].metaDescription = output.metaDescription;
        MOCK_DB.pageDetails[pageId].jsonLd = output.jsonLd;
    }
    return simulateApiCall(undefined);
};

export const saveKeywords = async (pageId: string, keywords: string[], includeAi: boolean): Promise<void> => {
    console.log(`Saving keywords for page ${pageId}:`, { keywords, includeAi });
    if (MOCK_DB.pageDetails[pageId]) {
        MOCK_DB.pageDetails[pageId].userKeywords = keywords;
    }
    return simulateApiCall(undefined);
};

// --- REPORTS & AI ---
export const getReportData = async (dateRange: { start: Date, end: Date }, compare: boolean): Promise<ReportData> => {
    const generateGscData = (days: number, offset = 0) => {
        return Array.from({ length: days }, (_, i) => ({
            date: new Date(Date.now() - (days - 1 - i + offset) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            clicks: 100 + Math.sin(i / 5) * 20 + Math.random() * 10,
            impressions: 2000 + Math.sin(i / 5) * 300 + Math.random() * 200,
        }));
    };
    const days = Math.round((dateRange.end.getTime() - dateRange.start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    return simulateApiCall({
        summary: "Your visibility score trended upwards, driven by a 15% increase in clicks. The 'AI SEO Strategies' blog post was your top performer. We recommend implementing FAQ schema on your pricing page to capture more search real estate.",
        gscPerformance: {
            current: generateGscData(days),
            previous: compare ? generateGscData(days, days) : [],
        },
        aiCoverage: {
            current: [{ name: 'Covered', value: 78 }, { name: 'Not Covered', value: 22 }],
            previous: [{ name: 'Covered', value: 72 }, { name: 'Not Covered', value: 28 }],
        },
        topPageImprovements: [],
        optimizationActivity: [
            { pageId: 'page_01', url: '/blog/ai-seo', date: new Date().toISOString(), scoreChange: 8, keywords: ['ai seo', 'serp'] },
            { pageId: 'page_02', url: '/features/score', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), scoreChange: 5, keywords: ['visibility'] },
        ],
        annotations: [
            { date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], type: 'Optimization', description: 'Bulk-approved 15 pages.' },
            { date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], type: 'Schema', description: 'Added FAQ schema to pricing page.' },
        ],
        impactAnalysis: [
            { type: 'Title Optimizations', impact: 'High', description: 'Changes to meta titles on blog posts led to a 25% CTR increase.' },
            { type: 'Schema Implementation', impact: 'Medium', description: 'Product schema is now appearing in search results, boosting impressions.' },
        ]
    }, 1000);
};

export const getBrandingSettings = async (): Promise<BrandingSettings> => {
    return simulateApiCall(MOCK_DB.branding);
};

export const getAiVisibilityData = async (): Promise<{ pages: Page[], siteProfile: string }> => {
    return simulateApiCall({
        pages: MOCK_DB.pages[seedSite.id] || [],
        siteProfile: seedSite.siteProfile,
    });
};

export const generateAiSummary = async (promptOrDomain: string): Promise<string> => {
  try {
    const { data, error } = await supabase.functions.invoke("generate-summary", {
      body: { domain: promptOrDomain },
    });

    if (error) {
      console.error("Error from generate-summary function", error);
      throw error;
    }

    // Preferred response shape: { summary: string }
    if (data && typeof (data as any).summary === "string") {
      return (data as any).summary;
    }

    // Fallback if the function ever returns a bare string
    if (typeof data === "string") {
      return data;
    }
  } catch (err) {
    console.error("Falling back to local summary text in generateAiSummary", err);
  }

  // Fallback behavior if the edge function is unavailable
  if (promptOrDomain.includes(".")) {
    return `DualPilot is an AI powered search visibility engine that crawls ${promptOrDomain} and continuously improves visibility across classic search engines and modern AI assistants.`;
  }

  return `Based on your input "${promptOrDomain}", DualPilot helps your site appear more often in both traditional search and AI assistants by auditing pages, rewriting metadata, and keeping structured data in shape.`;
};

export const getSiteProfile = async (): Promise<string> => {
    return simulateApiCall(seedSite.siteProfile);
};


// --- SETTINGS ---
export const saveSiteSettings = async (siteId: string, siteName: string, domain: string): Promise<Site> => {
    const siteIndex = MOCK_DB.sites.findIndex(s => s.id === siteId);
    if (siteIndex === -1) throw new Error("Site not found");
    MOCK_DB.sites[siteIndex] = { ...MOCK_DB.sites[siteIndex], siteName, domain };
    return simulateApiCall(MOCK_DB.sites[siteIndex]);
};

export const getTeamMembers = async (): Promise<TeamMember[]> => {
    // Filter out current user, as they are handled separately in the UI
    return simulateApiCall(MOCK_DB.teamMembers.filter(m => !m.isOwner));
};

export const inviteTeamMember = async (email: string, role: 'Admin' | 'Member'): Promise<TeamMember> => {
    const newMember: TeamMember = {
        id: `user_${Date.now()}`,
        name: email,
        email,
        role,
        status: 'Pending Invitation',
    };
    MOCK_DB.teamMembers.push(newMember);
    return simulateApiCall(newMember);
};

export const updateTeamMemberRole = async (memberId: string, role: 'Admin' | 'Member'): Promise<TeamMember> => {
    const member = MOCK_DB.teamMembers.find(m => m.id === memberId);
    if (!member) throw new Error("Member not found");
    member.role = role;
    return simulateApiCall(member);
};

export const removeTeamMember = async (memberId: string): Promise<void> => {
    MOCK_DB.teamMembers = MOCK_DB.teamMembers.filter(m => m.id !== memberId);
    return simulateApiCall(undefined);
};

export const updateBrandingLogo = async (base64Url: string): Promise<BrandingSettings> => {
    MOCK_DB.branding.logoUrl = base64Url;
    return simulateApiCall(MOCK_DB.branding);
};

export const removeBrandingLogo = async (): Promise<void> => {
    MOCK_DB.branding.logoUrl = null;
    return simulateApiCall(undefined);
};

export const getApiKeys = async (): Promise<ApiKey[]> => {
    return simulateApiCall(MOCK_DB.apiKeys);
};

export const generateApiKey = async (name: string): Promise<ApiKey> => {
    const newKey: ApiKey = {
        id: `key_${Date.now()}`,
        name,
        key: `dp_live_${Math.random().toString(36).substring(2)}`,
        lastFour: Math.random().toString(36).substring(2, 6),
        createdAt: new Date().toISOString(),
        status: 'active',
    };
    MOCK_DB.apiKeys.push(newKey);
    return simulateApiCall(newKey);
};

export const revokeApiKey = async (keyId: string): Promise<void> => {
    const key = MOCK_DB.apiKeys.find(k => k.id === keyId);
    if (key) key.status = 'revoked';
    MOCK_DB.apiKeys = MOCK_DB.apiKeys.filter(k => k.id !== keyId); // Or just remove it
    return simulateApiCall(undefined);
};

export const disconnectSite = async (siteId: string): Promise<void> => {
    MOCK_DB.sites = MOCK_DB.sites.filter(s => s.id !== siteId);
    delete MOCK_DB.pages[siteId];
    return simulateApiCall(undefined, 1000);
};

export const updateUserProfile = async (userId: string, updates: { name?: string; email?: string; avatarUrl?: string }): Promise<void> => {
    console.log(`Updating profile for ${userId} with`, updates);
    return simulateApiCall(undefined);
};

export const changePassword = async (userId: string, current: string, newPass: string): Promise<void> => {
    console.log(`Changing password for ${userId}`);
    if (current === 'wrongpassword') throw new Error("Incorrect current password");
    return simulateApiCall(undefined);
};