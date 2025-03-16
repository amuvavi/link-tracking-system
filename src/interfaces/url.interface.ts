export interface UrlEntry {
    shortKey: string;
    originalUrl: string;
    createdAt: string;
}

export interface ShortenResponse {
    originalUrl: string;
    shortUrl: string;
}