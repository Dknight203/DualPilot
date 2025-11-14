

import { Site, PlanId } from '../types';

// FIX: Added missing properties 'platform' and 'siteProfile' to conform to the Site type.
export const seedSite: Site = {
    id: 'site_123',
    siteName: 'DualPilot Demo',
    domain: 'dualpilot.ai',
    plan: PlanId.Pro,
    optimizedPages: 180,
    totalPages: 250,
    visibilityScore: 91,
    refreshPolicy: 'Daily refresh',
    platform: 'other',
    siteProfile: 'DualPilot is an automated AI plus Search visibility engine that audits, optimizes, and keeps your site visible.',
};
