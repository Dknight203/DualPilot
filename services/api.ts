import { ScanResult, LineChartData, StackedBarChartData, PieChartData, Page, Site, Event, Invoice, TeamMember, PageDetails, PageOutput, ReportsData, ImprovedPage } from '../types';
import { seedScanResult, seedLineChartData, seedStackedBarChartData, seedPieChartData, seedPages, seedSites, seedEvents, seedInvoices, seedTeamMembers, seedPageDetails, seedReportsData, seedImprovedPages } from '../data/seeds';

const simulateDelay = <T,>(data: T, delay = 500): Promise<T> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(data);
    }, delay);
  });
};

// TODO: All functions in this file should be replaced with actual API calls 
// to a backend like Supabase Edge Functions or a dedicated server.

export const scanDomain = async (domain: string): Promise<ScanResult> => {
  console.log(`Scanning domain: ${domain}`);
  // TODO: Implement actual call to Google AI Studio for analysis
  return simulateDelay(seedScanResult, 2000);
};

// --- Multi-Site ---
export const getSites = async (): Promise<Site[]> => {
    return simulateDelay(seedSites);
};

export const getDashboardData = async (siteId: string) => {
  console.log(`Fetching dashboard data for site: ${siteId}`);
  // In a real app, these would be separate endpoints filtered by siteId
  const site = seedSites.find(s => s.id === siteId) || seedSites[0];
  return Promise.all([
    simulateDelay(site),
    simulateDelay(seedLineChartData),
    simulateDelay(seedStackedBarChartData),
    simulateDelay(seedPieChartData),
    simulateDelay(seedEvents),
    getTopImprovedPages()
  ]).then(([site, line, stacked, pie, events, improvedPages]) => ({
    site,
    charts: {
      visibilityTrend: line,
      issuesFixed: stacked,
      pageStatus: pie,
    },
    events,
    topImprovedPages: improvedPages,
  }));
};

export const getReportsData = async (siteId: string): Promise<ReportsData> => {
    console.log(`Fetching reports data for site: ${siteId}`);
    return simulateDelay(seedReportsData, 1200);
}

export const getTopImprovedPages = async (): Promise<ImprovedPage[]> => {
    return simulateDelay(seedImprovedPages, 800);
};

export const getPages = async (siteId: string, filters: { status?: string; path?: string; minScore?: number }): Promise<Page[]> => {
  console.log(`Fetching pages for site ${siteId} with filters:`, filters);
  // Basic filtering for demo purposes
  let pages = seedPages;
  if (filters.status) {
    pages = pages.filter(p => p.status === filters.status);
  }
  if (filters.path) {
    pages = pages.filter(p => p.url.startsWith(filters.path));
  }
  if (filters.minScore) {
    pages = pages.filter(p => p.score >= filters.minScore!);
  }
  return simulateDelay(pages);
};

export const getPageDetails = async (pageId: string): Promise<PageDetails> => {
  console.log(`Fetching details for page: ${pageId}`);
  // Find the base page and merge with detailed seed data
  const basePage = seedPages.find(p => p.id === pageId) || seedPages[0];
  const details = { ...seedPageDetails, ...basePage, id: pageId };
  return simulateDelay(details);
};

export const optimizePage = async (pageId: string): Promise<PageOutput> => {
    console.log(`Optimizing page: ${pageId}`);
    // TODO: This would call Google AI Studio (Gemini API) to generate content
    const newOutput: PageOutput = {
        id: `out_${Math.random()}`,
        metaTitle: "AI-Optimized Title for Your Page",
        metaDescription: "This is a new, AI-generated meta description designed to improve click-through rates and search engine ranking by targeting relevant keywords.",
        canonicalUrl: seedPageDetails.canonicalUrl,
        jsonLd: { "@context": "https://schema.org", "@type": "WebPage", "name": "AI-Optimized Title" },
        aiSummary: "A new, concise AI summary highlighting the key points of the page content for better understanding by AI assistants.",
        modelVersion: 'gemini-2.5-flash',
        approved: false,
        createdAt: new Date().toISOString()
    };
    return simulateDelay(newOutput, 1500);
};

// --- Per-Page Actions ---
export const forceRecrawl = async (pageId: string): Promise<{ success: boolean }> => {
    console.log(`Forcing recrawl for page: ${pageId}`);
    return simulateDelay({ success: true }, 1000);
};

export const pingForIndex = async (pageId: string): Promise<{ success: boolean }> => {
    console.log(`Pinging for indexing for page: ${pageId}`);
    return simulateDelay({ success: true }, 700);
};


export const verifyDomain = async (domain: string): Promise<{ verified: boolean, heartbeat: string }> => {
    console.log(`Verifying domain: ${domain}`);
    return simulateDelay({ verified: true, heartbeat: new Date().toISOString() });
};

export const createCheckoutSession = async (planId: string): Promise<{ checkoutUrl: string }> => {
    console.log(`Creating checkout session for plan: ${planId}`);
    // TODO: Integrate with Stripe API
    return simulateDelay({ checkoutUrl: 'https://buy.stripe.com/test_12345' });
};

export const getBillingInfo = async (): Promise<{ invoices: Invoice[], plan: Site['plan'], usage: number }> => {
    return simulateDelay({ invoices: seedInvoices, plan: seedSites[0].plan, usage: seedSites[0].optimizedPages / seedSites[0].totalPages });
};

export const getTeamMembers = async (): Promise<TeamMember[]> => {
    return simulateDelay(seedTeamMembers);
};

export const connectGsc = async (): Promise<{ success: true }> => {
    console.log("Simulating GSC connection...");
    return simulateDelay({ success: true }, 1500);
};
