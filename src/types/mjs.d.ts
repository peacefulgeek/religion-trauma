declare module '../../src/lib/db.mjs' {
  export const pool: any;
  export function query(text: string, params?: any[]): Promise<any>;
  export function getPublishedArticles(opts?: { limit?: number; offset?: number; category?: string }): Promise<any[]>;
  export function getArticleBySlug(slug: string): Promise<any | null>;
  export function getCategories(): Promise<any[]>;
  export function getAssessments(): Promise<any[]>;
  export function getAssessmentBySlug(slug: string): Promise<any | null>;
  export function saveAssessmentResponse(assessmentId: number, answers: any, resultKey: string): Promise<void>;
}

declare module '../../src/lib/aeo.mjs' {
  export const SITE_NAME: string;
  export const SITE_DESCRIPTION: string;
  export const AUTHOR_NAME: string;
  export const AUTHOR_URL: string;
  export function buildCanonical(req: any, path?: string): string;
  export function buildRobotsTxt(req: any): string;
  export function buildLlmsTxt(): Promise<string>;
  export function buildLlmsFullTxt(): Promise<string>;
}
