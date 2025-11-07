// FIX: Populated this file with type definitions to resolve import errors across the application.

export enum PlanId {
    Essentials = 'essentials',
    Pro = 'pro',
    Agency = 'agency',
    Enterprise = 'enterprise',
}

export interface Plan {
    id: PlanId;
    name: string;
    price: number | 'Custom';
    pricePeriod: string;
    pages: number | 'Unlimited';
    refresh: string;
    features: string[];
}

export interface Site {
    id: string;
    siteName: string;
    domain: string;
    plan: PlanId;
    optimizedPages: number;
    totalPages: number;
    visibilityScore: number;
    refreshPolicy: string;
}

export interface ScanResult {
    score: number;
    classicReadiness: boolean;
    aiReadiness: boolean;
    issues: string[];
    suggestedNextStep: string;
}

export enum PageStatus {
    Optimized = 'Optimized',
    NeedsReview = 'Needs Review',
    Pending = 'Pending',
    Failed = 'Failed',
}

export interface Page {
    id: string;
    url: string;
    lastOptimized: string | null;
    score: number;
    status: PageStatus;
}

export interface ImprovedPage {
    pageId: string;
    url: string;
    oldTitle: string;
    newTitle: string;
    oldDescription: string;
    newDescription: string;
}

export interface LineChartData {
    date: string;
    score: number;
}

export interface StackedBarChartData {
    date: string;
    title: number;
    description: number;
    canonical: number;
    schema: number;
    brokenLinks: number;
}

export interface PieChartData {
    name: PageStatus;
    value: number;
}

export interface Event {
    id: string;
    type: string;
    status: 'Success' | 'Failed' | 'In Progress';
    timestamp: string;
    details: string;
}

export interface PageOutput {
    id: string;
    metaTitle: string;
    metaDescription: string;
    jsonLd: Record<string, any>;
    modelVersion: string;
    createdAt: string;
}

export interface PageDetails extends Page {
    metaTitle: string;
    metaDescription: string;
    jsonLd: Record<string, any>;
    userKeywords: string[];
    aiKeywords: string[];
    history: PageOutput[];
}

export interface Invoice {
    id: string;
    date: string;
    amount: string;
    status: 'Paid' | 'Due' | 'Overdue';
    pdfUrl: string;
}

export interface TeamMember {
    id: string;
    name: string;
    email: string;
    role: 'Admin' | 'Member';
    status: 'Active' | 'Pending Invitation';
    isOwner?: boolean;
}

export interface ApiKey {
  id: string;
  name: string;
  key?: string; // The full key is optional, only returned on creation
  lastFour: string;
  createdAt: string;
  status: 'active' | 'revoked';
}

export interface GscDataPoint {
    date: string;
    clicks: number;
    impressions: number;
}

export interface AiCoverageData {
    name: 'Covered' | 'Not Covered';
    value: number;
}

export interface PageImprovementData {
    url: string;
    scoreChange: number;
}

export interface OptimizationActivity {
    pageId: string;
    url: string;
    date: string;
    scoreChange: number;
    keywords: string[];
}

export interface ActionAnnotation {
    date: string;
    type: 'Optimization' | 'Schema';
    description: string;
}

export interface ImpactAnalysisItem {
    type: string;
    impact: 'High' | 'Medium' | 'Low';
    description: string;
}


export interface ReportData {
    summary: string;
    gscPerformance: {
        current: GscDataPoint[];
        previous: GscDataPoint[];
    };
    aiCoverage: {
        current: AiCoverageData[];
        previous: AiCoverageData[];
    };
    topPageImprovements: PageImprovementData[];
    optimizationActivity: OptimizationActivity[];
    annotations: ActionAnnotation[];
    impactAnalysis: ImpactAnalysisItem[];
}