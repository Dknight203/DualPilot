import {
  ScanResult,
  Site,
  Page,
  PageDetails,
  PageOutput,
  Invoice,
  TeamMember,
  ReportsData,
  LineChartData,
  StackedBarChartData,
  PieChartData,
  Event as AppEvent,
  ImprovedPage,
} from '../types';
import {
  seedScanResult,
  seedSites,
  seedPages,
  seedPageDetails,
  seedInvoices,
  seedTeamMembers,
  seedReportsData,
  seedEvents,
  seedImprovedPages,
  seedLineChartData,
  seedPieChartData,
  seedStackedBarChartData,
} from '../data/seeds';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const scanDomain = async (domain: string): Promise<ScanResult> => {
  console.log(`Scanning domain: ${domain}`);
  await delay(1500);
  return seedScanResult;
};

export const createCheckoutSession = async (planId: string): Promise<{ checkoutUrl: string }> => {
  console.log(`Creating checkout session for plan: ${planId}`);
  await delay(1000);
  return { checkoutUrl: `https://stripe.com/checkout/session_for_${planId}` };
};

export const verifyDomain = async (domain: string): Promise<{ verified: boolean; heartbeat: string | null }> => {
  console.log(`Verifying domain: ${domain}`);
  await delay(1000);
  // Simulate a 50/50 chance of being verified on first try
  const isVerified = Math.random() > 0.5;
  return {
    verified: isVerified,
    heartbeat: isVerified ? new Date().toISOString() : null,
  };
};

export const getSites = async (): Promise<Site[]> => {
  await delay(500);
  return seedSites;
};

export const getDashboardData = async (siteId: string): Promise<{
  site: Site;
  charts: {
    visibilityTrend: LineChartData[];
    issuesFixed: StackedBarChartData[];
    pageStatus: PieChartData[];
  };
  events: AppEvent[];
  topImprovedPages: ImprovedPage[];
}> => {
  console.log(`Fetching dashboard data for site: ${siteId}`);
  await delay(800);
  const site = seedSites.find(s => s.id === siteId) || seedSites[0];
  return {
    site,
    charts: {
      visibilityTrend: seedLineChartData,
      issuesFixed: seedStackedBarChartData,
      pageStatus: seedPieChartData,
    },
    events: seedEvents,
    topImprovedPages: seedImprovedPages.slice(0, 3),
  };
};

export const getPages = async (siteId: string, options: any): Promise<Page[]> => {
  console.log(`Fetching pages for site: ${siteId} with options`, options);
  await delay(600);
  return seedPages.filter(p => p.siteId === siteId);
};

export const forceRecrawl = async (pageId: string): Promise<void> => {
  console.log(`Forcing recrawl for page: ${pageId}`);
  await delay(500);
};

export const pingForIndex = async (pageId: string): Promise<void> => {
  console.log(`Pinging for index for page: ${pageId}`);
  await delay(500);
};

export const getPageDetails = async (pageId: string): Promise<PageDetails> => {
  console.log(`Fetching details for page: ${pageId}`);
  await delay(700);
  // NOTE: Returning the same details for any pageId for this demo.
  return seedPageDetails;
};

export const optimizePage = async (pageId: string): Promise<PageOutput> => {
  console.log(`Optimizing page: ${pageId}`);
  await delay(2000);
  const newOutput: PageOutput = {
    id: `out_${Date.now()}`,
    metaTitle: "AI Optimized Title for My Awesome Site",
    metaDescription: "This is an AI-generated meta description that is perfectly optimized for search engines and user engagement, highlighting key aspects of My Awesome Site.",
    canonicalUrl: "https://example.com/about-optimized",
    jsonLd: { "@context": "https://schema.org", "@type": "WebPage", "name": "Optimized About Us", "description": "A new, better description." },
    aiSummary: "Leveraging advanced AI, this summary provides a concise and compelling overview of My Awesome Site's mission and team.",
    modelVersion: 'gemini-2.5-flash',
    approved: false,
    createdAt: new Date().toISOString(),
  };
  return newOutput;
};

export const getBillingInfo = async (): Promise<{ invoices: Invoice[] }> => {
  await delay(400);
  return { invoices: seedInvoices };
};

export const getTeamMembers = async (): Promise<TeamMember[]> => {
  await delay(400);
  return seedTeamMembers;
};

export const getReportsData = async (siteId: string, days: number): Promise<ReportsData> => {
  console.log(`Fetching reports data for site: ${siteId} for last ${days} days`);
  await delay(1200);
  // Here you could filter data based on 'days', for the demo we'll return the full set.
  return seedReportsData;
};

export const connectGsc = async (): Promise<void> => {
  console.log('Simulating GSC connection flow...');
  await delay(1500);
};
