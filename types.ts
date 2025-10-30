export enum PlanId {
  Essentials = 'essentials',
  Pro = 'pro',
  Agency = 'agency',
  Enterprise = 'enterprise',
}

export interface Plan {
  id: PlanId;
  name: string;
  price: number | string;
  pricePeriod: string;
  pages: number | string;
  refresh: string;
  features: string[];
}

export interface Site {
  id: string;
  ownerUserId: string;
  domain: string;
  siteName: string;
  plan: PlanId;
  refreshPolicy: string;
  verified: boolean;
  createdAt: string;
  totalPages: number;
  optimizedPages: number;
}

export enum PageStatus {
  Optimized = 'Optimized',
  Pending = 'Pending',
  NeedsReview = 'Needs Review',
  Failed = 'Failed',
}

export interface Page {
  id: string;
  siteId: string;
  url: string;
  lastOptimized: string | null;
  score: number;
  issuesCount: number;
  status: PageStatus;
}

export interface PageDetails extends Page {
  metaTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  jsonLd: Record<string, any>;
  aiSummary: string;
  userKeywords: string[];
  aiKeywords: string[];
  history: PageOutput[];
}

export interface PageOutput {
  id: string;
  metaTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  jsonLd: Record<string, any>;
  aiSummary: string;
  modelVersion: string;
  approved: boolean;
  createdAt: string;
}

export interface ScanResult {
  score: number;
  aiReadiness: boolean;
  classicReadiness: boolean;
  issues: string[];
  suggestedNextStep: string;
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
  type: 'Optimize' | 'Index Ping' | 'Verification';
  status: 'Success' | 'Failed' | 'In Progress';
  timestamp: string;
  details: string;
}

export interface Invoice {
  id: string;
  date: string;
  amount: string;
  status: 'Paid' | 'Due';
  pdfUrl: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'Owner' | 'Admin' | 'Member';
}
