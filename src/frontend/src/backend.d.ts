import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface Article {
    id: string;
    status: ContentStatus;
    title: string;
    body: string;
    createdAt: Time;
    coverImage?: ExternalBlob;
    updatedAt: Time;
}
export type Time = bigint;
export enum ContentStatus {
    published = "published",
    draft = "draft"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createArticle(title: string, body: string, coverImage: ExternalBlob | null, sessionToken: string | null): Promise<Article>;
    getAllArticles(sessionToken: string | null): Promise<Array<Article>>;
    getArticleById(id: string, sessionToken: string | null): Promise<Article | null>;
    getCallerUserRole(): Promise<UserRole>;
    getPublishedArticles(): Promise<Array<Article>>;
    isCallerAdmin(): Promise<boolean>;
    login(username: string, password: string): Promise<string>;
    logout(sessionToken: string): Promise<void>;
    publishArticle(id: string, sessionToken: string | null): Promise<Article>;
    /**
     * / Overwrite current admin credentials with default admin account
     * / SECURITY: This function requires admin authorization when credentials already exist.
     * / For first-time setup, it requires the caller to be an admin via AccessControl.
     */
    resetDefaultAdminCredential(): Promise<void>;
    unpublishArticle(id: string, sessionToken: string | null): Promise<Article>;
    updateArticle(id: string, title: string, body: string, coverImage: ExternalBlob | null, sessionToken: string | null): Promise<Article>;
}
