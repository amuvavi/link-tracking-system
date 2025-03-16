export interface AnalyticsEntry {
    shortKey: string;
    timestamp: string;
    ipAddress?: string;
    userAgent?: string;
    referrer?: string;
    originalUrl: string;
}

export interface AnalyticsResponse {
    count: number;
    results: AnalyticsEntry[];
    pagination?: {
        page: number;
        limit: number;
        total: number;
    };
}
