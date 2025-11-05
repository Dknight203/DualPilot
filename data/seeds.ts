import { PlanId, Site, Page, PageStatus, ScanResult, LineChartData, StackedBarChartData, PieChartData, Event, Invoice, TeamMember, PageDetails, PageOutput, AiCoverageData, ReportsData, ImprovedPage, GscDataPoint, PageImprovementData, OptimizationActivity } from '../types';

export const seedSites: Site[] = [
  {
    id: 'site_1',
    ownerUserId: 'user_1',
    domain: 'awesomesite.com',
    siteName: 'My Awesome Site',
    plan: PlanId.Pro,
    refreshPolicy: 'Daily',
    verified: true,
    createdAt: '2023-10-01T10:00:00Z',
    totalPages: 250,
    optimizedPages: 180,
  },
  {
    id: 'site_2',
    ownerUserId: 'user_1',
    domain: 'superblog.io',
    siteName: 'My Super Blog',
    plan: PlanId.Essentials,
    refreshPolicy: 'Weekly',
    verified: true,
    createdAt: '2023-11-15T10:00:00Z',
    totalPages: 50,
    optimizedPages: 35,
  }
];

export const seedSite: Site = seedSites[0];

export const seedPages: Page[] = [
  { id: 'page_1', siteId: 'site_1', url: '/', lastOptimized: '2023-10-26T10:00:00Z', score: 95, issuesCount: 1, status: PageStatus.Optimized },
  { id: 'page_2', siteId: 'site_1', url: '/about', lastOptimized: '2023-10-26T11:00:00Z', score: 92, issuesCount: 2, status: PageStatus.Optimized },
  { id: 'page_3', siteId: 'site_1', url: '/blog', lastOptimized: '2023-10-25T09:00:00Z', score: 88, issuesCount: 3, status: PageStatus.Optimized },
  { id: 'page_4', siteId: 'site_1', url: '/blog/post-1', lastOptimized: '2023-10-24T14:00:00Z', score: 75, issuesCount: 5, status: PageStatus.NeedsReview },
  { id: 'page_5', siteId: 'site_1', url: '/contact', lastOptimized: null, score: 40, issuesCount: 8, status: PageStatus.Pending },
  { id: 'page_6', siteId: 'site_1', url: '/products', lastOptimized: null, score: 35, issuesCount: 10, status: PageStatus.Pending },
  { id: 'page_7', siteId: 'site_1', url: '/products/widget-a', lastOptimized: '2023-10-23T10:00:00Z', score: 65, issuesCount: 6, status: PageStatus.Failed },
  { id: 'page_8', siteId: 'site_1', url: '/services', lastOptimized: null, score: 55, issuesCount: 7, status: PageStatus.Pending },
  { id: 'page_9', siteId: 'site_1', url: '/pricing', lastOptimized: '2023-10-26T12:00:00Z', score: 98, issuesCount: 0, status: PageStatus.Optimized },
  { id: 'page_10', siteId: 'site_1', url: '/faq', lastOptimized: '2023-10-22T10:00:00Z', score: 81, issuesCount: 4, status: PageStatus.NeedsReview },
];

const seedPageHistory: PageOutput[] = [
    { id: 'out_1', metaTitle: 'Old Title', metaDescription: 'Old description.', canonicalUrl: 'https://example.com/about', jsonLd: {}, aiSummary: 'Old summary.', modelVersion: 'gemini-1.0', approved: true, createdAt: '2023-10-20T10:00:00Z' },
    { id: 'out_2', metaTitle: 'Slightly Newer Title', metaDescription: 'Slightly newer description.', canonicalUrl: 'https://example.com/about', jsonLd: {}, aiSummary: 'Newer summary.', modelVersion: 'gemini-1.5', approved: true, createdAt: '2023-10-25T11:00:00Z' },
];

export const seedPageDetails: PageDetails = {
    ...seedPages[1],
    metaTitle: "About Us | My Awesome Site",
    metaDescription: "Learn more about the team and mission behind My Awesome Site.",
    canonicalUrl: "https://example.com/about",
    jsonLd: { "@context": "https://schema.org", "@type": "WebPage", "name": "About Us" },
    aiSummary: "My Awesome Site is a leading provider of innovative solutions, driven by a passionate team dedicated to excellence and customer success.",
    userKeywords: ['company history', 'our team'],
    aiKeywords: ['about us', 'mission', 'company values', 'leadership'],
    history: seedPageHistory,
};

export const seedScanResult: ScanResult = {
  score: 78,
  aiReadiness: true,
  classicReadiness: false,
  issues: [
    'Meta description is too short on 5 pages',
    'Missing JSON-LD Schema on 8 pages',
    '3 pages have a low text-to-HTML ratio',
    'No SearchAction specified on homepage',
  ],
  suggestedNextStep: 'Automate fixes with DualPilot to instantly improve your score.'
};

export const seedLineChartData: LineChartData[] = Array.from({ length: 90 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (89 - i));
  return {
    date: date.toISOString().split('T')[0],
    score: 65 + Math.sin(i / 5) * 10 + Math.random() * 5 - (i/20),
  };
});

export const seedStackedBarChartData: StackedBarChartData[] = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return {
      date: date.toISOString().split('T')[0],
      title: Math.floor(Math.random() * 5),
      description: Math.floor(Math.random() * 4),
      canonical: Math.floor(Math.random() * 2),
      schema: Math.floor(Math.random() * 6),
      brokenLinks: Math.floor(Math.random() * 1),
    };
});

export const seedPieChartData: PieChartData[] = [
    { name: PageStatus.Optimized, value: 450 },
    { name: PageStatus.NeedsReview, value: 120 },
    { name: PageStatus.Pending, value: 300 },
    { name: PageStatus.Failed, value: 80 },
];

export const seedEvents: Event[] = [
    { id: 'evt_1', type: 'Index Ping', status: 'Success', timestamp: '2023-10-26T12:05:00Z', details: 'URL: /pricing' },
    { id: 'evt_2', type: 'Optimize', status: 'Success', timestamp: '2023-10-26T12:00:00Z', details: 'URL: /pricing' },
    { id: 'evt_3', type: 'Crawl', status: 'Success', timestamp: '2023-10-26T11:05:00Z', details: 'Finished crawling 250 pages.' },
    { id: 'evt_4', type: 'Optimize', status: 'Failed', timestamp: '2023-10-26T11:00:00Z', details: 'URL: /about - Timeout' },
    { id: 'evt_5', type: 'Verification', status: 'Success', timestamp: '2023-10-01T10:00:00Z', details: 'Domain example.com verified' },
];

export const seedInvoices: Invoice[] = [
    { id: 'inv_1', date: '2023-10-01', amount: '$99.00', status: 'Paid', pdfUrl: '#' },
    { id: 'inv_2', date: '2023-09-01', amount: '$99.00', status: 'Paid', pdfUrl: '#' },
    { id: 'inv_3', date: '2023-08-01', amount: '$99.00', status: 'Paid', pdfUrl: '#' },
];

export const seedTeamMembers: TeamMember[] = [
    { id: 'tm_1', name: 'You', email: 'owner@example.com', role: 'Owner' },
    { id: 'tm_2', name: 'Jane Doe', email: 'jane@example.com', role: 'Admin' },
];

export const seedAiCoverageData: AiCoverageData[] = [
    { name: 'Covered', value: 85 },
    { name: 'Not Covered', value: 15 },
];

export const seedGscData: GscDataPoint[] = Array.from({ length: 90 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (89 - i));
    return {
        date: date.toISOString().split('T')[0],
        clicks: 300 + Math.sin(i/4) * 50 + Math.random() * 20,
        impressions: 8000 + Math.sin(i/2) * 1000 + Math.random() * 500,
    };
});

export const seedPageImprovements: PageImprovementData[] = [
    { url: '/pricing', scoreChange: 18 },
    { url: '/about', scoreChange: 15 },
    { url: '/', scoreChange: 12 },
    { url: '/blog', scoreChange: 9 },
    { url: '/faq', scoreChange: 5 },
    { url: '/contact', scoreChange: 4 },
    { url: '/services', scoreChange: 2 },
];

export const seedOptimizationActivity: OptimizationActivity[] = Array.from({ length: 15 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (5 + i * 4)); // Spread out over the last ~65 days
    const page = seedPages[i % seedPages.length];
    return {
        pageId: page.id,
        url: page.url,
        date: date.toISOString(),
        scoreChange: 5 + Math.floor(Math.random() * 15),
        keywords: ['ai', 'seo', 'optimization', `keyword${i}`],
    };
});


export const seedReportsData: ReportsData = {
    visibilityTrend: seedLineChartData,
    aiCoverage: seedAiCoverageData,
    gscPerformance: seedGscData,
    pageImprovements: seedPageImprovements,
    optimizationActivity: seedOptimizationActivity,
};

export const seedImprovedPages: ImprovedPage[] = [
    {
        pageId: 'page_1',
        url: '/',
        oldTitle: 'My Awesome Site',
        newTitle: 'My Awesome Site | Homepage',
        oldDescription: 'Welcome to my awesome site.',
        newDescription: 'Discover the best of My Awesome Site on our official homepage. Explore our products, services, and blog.',
    },
    {
        pageId: 'page_2',
        url: '/about',
        oldTitle: 'About',
        newTitle: 'About Us | Our Mission and Team',
        oldDescription: 'Learn about us.',
        newDescription: 'Discover the story behind our company, meet the team, and learn about our mission to deliver excellence.',
    },
    {
        pageId: 'page_3',
        url: '/blog',
        oldTitle: 'Blog',
        newTitle: 'Official Company Blog | News & Updates',
        oldDescription: 'Read our blog.',
        newDescription: 'Stay up-to-date with the latest company news, product updates, and industry insights on our official blog.',
    },
];
