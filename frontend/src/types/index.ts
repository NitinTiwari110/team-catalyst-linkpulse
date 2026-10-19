export interface LinkItem {
  id: string;
  originalUrl: string;
  shortCode: string;
  shortUrl: string;
  title?: string;
  customAlias?: string;
  createdAt: string;
  updatedAt: string;
  expiresAt?: string | null;
  clickLimit?: number | null;
  clickCount: number;
  isActive: boolean;
  isPasswordProtected: boolean;
  tags: string[];
  campaignId?: string | null;
  campaignName?: string | null;
}

export interface CreateLinkPayload {
  originalUrl: string;
  customAlias?: string;
  title?: string;
  expiresAt?: string | null;
  clickLimit?: number | null;
  password?: string | null;
  tags?: string[];
  campaignId?: string | null;
}

export interface UpdateLinkPayload {
  title?: string;
  isActive?: boolean;
  expiresAt?: string | null;
  clickLimit?: number | null;
  tags?: string[];
  campaignId?: string | null;
}

export interface Campaign {
  id: string;
  name: string;
  description: string;
  linkCount: number;
  totalClicks: number;
  createdAt: string;
}

export interface ClickMetricItem {
  name: string;
  clicks: number;
  percentage: number;
}

export interface TimeseriesDataPoint {
  date: string;
  clicks: number;
  uniqueVisitors: number;
}

export interface LinkAnalytics {
  linkId: string;
  totalClicks: number;
  uniqueVisitors: number;
  clicksOverTime: TimeseriesDataPoint[];
  referrers: ClickMetricItem[];
  devices: ClickMetricItem[];
  browsers: ClickMetricItem[];
  countries: ClickMetricItem[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}