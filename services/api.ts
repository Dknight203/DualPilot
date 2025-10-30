import { ScanResult, LineChartData, StackedBarChartData, PieChartData, Page, Site, Event, Invoice, TeamMember, PageDetails, PageOutput } from '../types';
import { seedScanResult, seedLineChartData, seedStackedBarChartData, seedPieChartData, seedPages, seedSite, seedEvents, seedInvoices, seedTeamMembers, seedPageDetails } from '../data/seeds';

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

export const getDashboardData = async () => {
  // In a real app, these would be separate endpoints
  return Promise.all([
    simulateDelay(seedSite),
    simulateDelay(seedLineChartData),
    simulateDelay(seedStackedBarChartData),
    simulateDelay(seedPieChartData),
    simulateDelay(seedEvents)
  ]).then(([site, line, stacked, pie, events]) => ({
    site,
    charts: {
      visibilityTrend: line,
      issuesFixed: stacked,
      pageStatus: pie,
    },
    events
  }));
};

export const getPages = async (filters: { status?: string; path?: string; minScore?: number }): Promise<Page[]> => {
  console.log('Fetching pages with filters:', filters);
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
    return simulateDelay({ invoices: seedInvoices, plan: seedSite.plan, usage: seedSite.optimizedPages / seedSite.totalPages });
};

export const getTeamMembers = async (): Promise<TeamMember[]> => {
    return simulateDelay(seedTeamMembers);
};
