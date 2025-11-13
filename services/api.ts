import {
    ScanResult, Site, PlanId, Page, PageStatus, LineChartData, StackedBarChartData,
    PieChartData, Event, ImprovedPage, PageDetails, PageOutput, Invoice, TeamMember,
    ApiKey, ReportData, CmsConnection,
    InitialOptimizations, BrandingSettings, Platform
} from '../types';
import { supabase } from '../supabaseClient';


// --- MOCK DATA (for features not yet connected to backend) ---
const mockPages: Page[] = [
    { id: 'page_01', url: '/blog/ai-seo-strategies', lastOptimized: '2023-10-26', score: 95, status: PageStatus.Optimized },
    { id: 'page_02', url: '/features/visibility-score', lastOptimized: '2023-10-25', score: 92, status: PageStatus.Optimized },
    { id: 'page_03', url: '/pricing', lastOptimized: '2023-10-20', score: 88, status: PageStatus.Optimized },
    { id: 'page_04', url: '/about-us', lastOptimized: null, score: 65, status: PageStatus.NeedsReview },
];

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

// --- REAL API FUNCTIONS ---

/**
 * Fetches all sites belonging to a specific user.
 */
export const getSites = async (userId: string): Promise<Site[]> => {
    if (!supabase) throw new Error("Supabase client not initialized.");
    if (!userId) return []; // If no user ID is provided, there are no sites.
    
    const { data, error } = await supabase
        .from('sites')
        .select('*')
        .eq('owner_id', userId);

    if (error) {
        console.error('Error fetching sites:', error);
        throw error;
    }
    
    // Map snake_case from DB to camelCase for the app
    return (data || []).map(site => ({
        id: site.id,
        siteName: site.site_name,
        domain: site.domain,
        plan: site.plan,
        optimizedPages: site.optimized_pages || 0,
        totalPages: site.total_pages || 0,
        visibilityScore: site.visibility_score || 0,
        refreshPolicy: site.refresh_policy || 'Daily refresh',
    }));
};

/**
 * Adds a new site to the database for the currently authenticated user.
 */
export const addSite = async (
    domain: string,
    platform: Platform,
    planId: PlanId,
    siteProfile: string
): Promise<Site> => {
    if (!supabase) throw new Error("Supabase client not initialized.");
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User must be logged in to add a site.");

    const newSiteData = {
        owner_id: user.id,
        site_name: domain, // Use domain as the initial site name
        domain: domain,
        plan: planId,
        site_profile: siteProfile,
        platform: platform, // Add the platform to the data being inserted
    };
    
    const { data, error } = await supabase
        .from('sites')
        .insert(newSiteData)
        .select()
        .single();
    
    if (error) {
        console.error('Error adding site:', error);
        throw error;
    }

    return {
        id: data.id,
        siteName: data.site_name,
        domain: data.domain,
        plan: data.plan,
        optimizedPages: 0,
        totalPages: 0,
        visibilityScore: 0,
        refreshPolicy: 'Daily refresh',
    };
};


// FIX: Update function signature to accept email and handle auth email updates.
export const updateUserProfile = async (userId: string, data: Partial<{ name: string; avatarUrl: string; email: string }>): Promise<TeamMember> => {
    if (!supabase) throw new Error("Supabase client not available.");

    const profileUpdateData: { name?: string; avatar_url?: string; email?: string; } = {};
    if (data.name) profileUpdateData.name = data.name;
    if (data.avatarUrl) profileUpdateData.avatar_url = data.avatarUrl;

    // Update auth user if email is provided and has changed
    if (data.email) {
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        if (currentUser && currentUser.email !== data.email) {
            const { error: authError } = await supabase.auth.updateUser({ email: data.email });
            if (authError) {
                console.error("Error updating user email:", authError);
                throw authError;
            }
             // Also update the email in the profiles table for consistency
            profileUpdateData.email = data.email;
        }
    }

    // Only update profile if there's data to update
    if (Object.keys(profileUpdateData).length > 0) {
        const { error: profileError } = await supabase
            .from('profiles')
            .update(profileUpdateData)
            .eq('id', userId);
        
        if (profileError) throw profileError;
    }
    
    // Refetch latest profile and user data to return a consistent object
    const { data: profile, error: fetchProfileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

    if (fetchProfileError) throw fetchProfileError;

    const { data: { user } } = await supabase.auth.getUser();

    return {
        id: profile.id,
        name: profile.name,
        email: user?.email || '',
        avatarUrl: profile.avatar_url,
        role: 'Admin', // placeholder
        status: 'Active' // placeholder
    };
};

// FIX: Add and export changePassword function to resolve import error in Profile.tsx.
export const changePassword = async (userId: string, currentPassword: string, newPassword: string): Promise<void> => {
    if (!supabase) throw new Error("Supabase client not available.");
    
    // Supabase's updateUser for a logged-in user doesn't require the old password.
    // The presence of currentPassword in the function signature suggests it might be used
    // for a future backend or for reauthentication, but we'll proceed with the direct update for now.
    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
        console.error("Error changing password:", error);
        throw error;
    }
};


// --- MOCK FUNCTIONS (to be replaced) ---

export const getSitePageCount = async (domain: string): Promise<number> => {
    // Simulate a quick scan to get page count for plan validation
    await new Promise(res => setTimeout(res, 2500));
    // Return a random number for demo purposes
    return Math.floor(Math.random() * 500) + 10;
};

export const scanDomain = (domain: string): Promise<ScanResult> => {
    const score = Math.floor(Math.random() * (95 - 60 + 1) + 60);
    const result: ScanResult = { score, classicReadiness: score > 70, aiReadiness: score > 80, issues: ['3 pages have no meta description', 'Missing Product schema on /shop/item-1'], suggestedNextStep: 'Automate fixes and boost your score!' };
    return simulateApiCall(result, 1500);
};

export const createCheckoutSession = (planId: string): Promise<{ checkoutUrl: string }> => {
    return simulateApiCall({ checkoutUrl: `https://stripe.com/checkout/mock_session_for_${planId}` });
};

export const getDashboardData = (siteId: string) => {
    const site = { id: siteId, siteName: 'Demo Site', domain: 'demo.com', plan: PlanId.Pro, optimizedPages: 180, totalPages: 250, visibilityScore: 91, refreshPolicy: 'Daily refresh' };
    const visibilityTrend: LineChartData[] = Array.from({ length: 30 }, (_, i) => ({ date: new Date(Date.now() - (29 - i) * 86400000).toLocaleDateString(), score: 80 + Math.sin(i / 3) * 5 }));
    const issuesFixed: StackedBarChartData[] = Array.from({ length: 30 }, (_, i) => ({ date: new Date(Date.now() - (29 - i) * 86400000).toISOString(), title: Math.floor(Math.random() * 5), description: Math.floor(Math.random() * 8), canonical: Math.floor(Math.random() * 2), schema: Math.floor(Math.random() * 4), brokenLinks: Math.floor(Math.random() * 1) }));
    const pageStatus: PieChartData[] = [{ name: PageStatus.Optimized, value: 180 }, { name: PageStatus.NeedsReview, value: 45 }, { name: PageStatus.Pending, value: 25 }];
    const events: Event[] = [{ id: 'evt_1', type: 'Site Crawl', status: 'Success', timestamp: new Date().toISOString(), details: 'Crawled 250 pages.' }];
    return simulateApiCall({ site, charts: { visibilityTrend, issuesFixed, pageStatus }, events, topImprovedPages: mockImprovedPages }, 1000);
};

export const getPages = (siteId: string, options: any): Promise<Page[]> => {
    return simulateApiCall(mockPages);
};

export const getInitialOptimizations = (): Promise<InitialOptimizations> => {
    return simulateApiCall({ optimizablePages: 32, examples: [{ url: '/blog/old-post', oldTitle: 'Old Post', newTitle: 'A Better Title' }] });
};

export const bulkApproveOptimizations = (): Promise<{ success: boolean }> => {
    return simulateApiCall({ success: true }, 1500);
};

// ... keep other mock functions for now
export const verifyDomain = (domain: string): Promise<{ verified: boolean; heartbeat: string }> => {
    return simulateApiCall({ verified: true, heartbeat: new Date().toISOString() });
};
export const forceRecrawl = (pageId: string): Promise<void> => simulateApiCall(undefined);
export const pingForIndex = (pageId: string): Promise<void> => simulateApiCall(undefined);
export const bulkApprovePages = (pageIds: string[]): Promise<{ success: boolean }> => simulateApiCall({ success: true }, 1000);
export const getPageDetails = (pageId: string): Promise<PageDetails> => {
    const basePage = mockPages.find(p => p.id === pageId) || { id: pageId, url: `/unknown/page/${pageId}`, lastOptimized: null, score: 50, status: PageStatus.NeedsReview };
    const details: PageDetails = { ...basePage, metaTitle: 'Original Title', metaDescription: 'Original Description', jsonLd: {}, userKeywords: [], aiKeywords: [], history: [] };
    return simulateApiCall(details);
}
export const saveKeywords = (pageId: string, keywords: string[], includeAiKeywords: boolean): Promise<{ success: boolean }> => simulateApiCall({ success: true });
export const optimizePage = (pageId: string): Promise<PageOutput> => simulateApiCall({ id: 'out_1', metaTitle: 'New AI Title', metaDescription: 'New AI Description', jsonLd: {}, modelVersion: 'gemini-2.5-pro', createdAt: new Date().toISOString() });
export const approveOptimization = (pageId: string, newOutput: PageOutput): Promise<{ success: boolean }> => simulateApiCall({ success: true });
export const getBillingInfo = (): Promise<{ invoices: Invoice[] }> => simulateApiCall({ invoices: [] });
export const saveSiteSettings = (siteId: string, newSiteName: string, newDomain: string): Promise<Site> => {
    const updatedSite = { id: siteId, siteName: newSiteName, domain: newDomain, plan: PlanId.Pro, optimizedPages: 180, totalPages: 250, visibilityScore: 91, refreshPolicy: 'Daily refresh' };
    return simulateApiCall(updatedSite);
}
export const getTeamMembers = (): Promise<TeamMember[]> => simulateApiCall([]);
export const inviteTeamMember = (email: string, role: 'Admin' | 'Member'): Promise<TeamMember> => {
    const newMember: TeamMember = { id: 'user_new', name: '(Pending)', email, role, status: 'Pending Invitation' };
    return simulateApiCall(newMember);
}
export const updateTeamMemberRole = (memberId: string, role: 'Admin' | 'Member'): Promise<TeamMember> => {
    const updatedMember: TeamMember = { id: memberId, name: 'Jane Doe', email: 'jane@example.com', role, status: 'Active' };
    return simulateApiCall(updatedMember);
}
export const removeTeamMember = (memberId: string): Promise<{ success: boolean }> => simulateApiCall({ success: true });
export const getApiKeys = (): Promise<ApiKey[]> => simulateApiCall([]);
export const generateApiKey = (name: string): Promise<ApiKey> => simulateApiCall({ id: 'key_new', name, lastFour: 'abcd', createdAt: new Date().toISOString(), status: 'active', key: 'dp_live_1234' });
export const revokeApiKey = (keyId: string): Promise<void> => simulateApiCall(undefined);
export const getCmsConnection = (): Promise<CmsConnection | null> => simulateApiCall(null);
export const connectCms = (type: 'wordpress', siteUrl: string): Promise<{ success: boolean }> => simulateApiCall({ success: true });
export const disconnectCms = (): Promise<{ success: boolean }> => simulateApiCall({ success: true });
export const getReportData = (dateRange: { start: Date, end: Date }, compare: boolean): Promise<ReportData> => {
    return simulateApiCall({ summary: 'Report data is loading.', gscPerformance: { current: [], previous: [] }, aiCoverage: { current: [], previous: [] }, topPageImprovements: [], optimizationActivity: [], annotations: [], impactAnalysis: [] });
}
export const getAiVisibilityData = (): Promise<{ pages: Page[], siteProfile: string }> => simulateApiCall({ pages: mockPages, siteProfile: 'This is a demo site profile.' });
export const getSiteProfile = (): Promise<string> => simulateApiCall('This is a demo site profile.');
export const getBrandingSettings = (): Promise<BrandingSettings | null> => simulateApiCall(null);
export const updateBrandingLogo = (logoUrl: string): Promise<BrandingSettings> => simulateApiCall({ logoUrl });
export const removeBrandingLogo = (): Promise<{ success: boolean }> => simulateApiCall({ success: true });
export const disconnectSite = (siteId: string): Promise<{ success: boolean }> => simulateApiCall({ success: true });

export const generateAiSummary = async (domain: string): Promise<string> => {
    if (!supabase) throw new Error("Supabase client not initialized.");

    try {
        const { data, error } = await supabase.functions.invoke('generate-summary', {
            body: { domain },
        });

        if (error) {
            console.error('Error invoking Supabase function:', error);
            throw error;
        }

        if (data.error) {
            console.error('Error from Supabase function:', data.error);
            throw new Error(data.error);
        }

        return data.summary || "No summary returned.";
    } catch (error: any) {
        console.error('Error generating AI summary:', error);
        // Return the specific error message from the backend if available, otherwise a generic one.
        return error?.message || "An error occurred while generating the summary. Please try again later.";
    }
};