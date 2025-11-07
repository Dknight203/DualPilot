
import { Site, PlanId } from '../types';

export const seedSite: Site = {
    id: 'site_123',
    siteName: 'DualPilot Demo',
    domain: 'dualpilot.ai',
    plan: PlanId.Pro,
    optimizedPages: 180,
    totalPages: 250,
    visibilityScore: 91,
    refreshPolicy: 'Daily refresh',
};
