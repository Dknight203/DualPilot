export interface TourStep {
    elementId: string;
    title: string;
    content: string;
}

export const dashboardTourSteps: TourStep[] = [
    {
        elementId: 'stat-cards-container',
        title: 'Key Metrics at a Glance',
        content: "This is your command center. Track your site's average Visibility Score, see how many pages are optimized, and monitor your plan usage right here.",
    },
    {
        elementId: 'top-pages-container',
        title: 'Top Page Improvements',
        content: 'See which pages have benefited most from AI optimization. We show you the before-and-after for meta titles and descriptions that have been recently improved.',
    },
    {
        elementId: 'visibility-chart-card',
        title: 'Track Your Visibility Over Time',
        content: 'This chart shows your average Visibility Score across all pages. Watch it climb as DualPilot continues to optimize your site!',
    },
    {
        elementId: 'pages-table-card',
        title: 'Manage Your Pages',
        content: "Here's a list of all the pages we've found on your site. You can view details, manually trigger a new optimization, or ping search engines for re-indexing.",
    },
    {
        elementId: 'view-reports-button',
        title: 'Dive Deeper with Reports',
        content: 'When you want more detail, head over to the Reports section to see advanced analytics, AI coverage, and your Google Search Console performance.',
    },
];
