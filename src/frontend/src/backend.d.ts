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
export interface UserProfile {
    name: string;
}
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
    createArticle(title: string, body: string, coverImage: ExternalBlob | null): Promise<Article>;
    getArticleById(id: string): Promise<Article | null>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getPublishedArticles(): Promise<Array<Article>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    publishArticle(id: string): Promise<Article>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    unpublishArticle(id: string): Promise<Article>;
    updateArticle(id: string, title: string, body: string, coverImage: ExternalBlob | null): Promise<Article>;
}
