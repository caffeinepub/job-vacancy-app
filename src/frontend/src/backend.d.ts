import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface JobApplication {
    applicantName: string;
    applicationId: string;
    jobId: string;
    submittedAt: Time;
    coverLetter: string;
    email: string;
    phone: string;
}
export interface UserAccount {
    userId: string;
    createdAt: Time;
    authMethod: AuthMethod;
    fullName: string;
    email?: string;
    passwordHash: string;
    phone?: string;
}
export interface JobListing {
    status: VacancyStatus;
    title: string;
    country: string;
    salaryCurrency: string;
    jobType: JobType;
    city: string;
    jobId: string;
    description: string;
    district: string;
    company: string;
    state: string;
    datePosted: Time;
    salaryMax: bigint;
    salaryMin: bigint;
}
export type AuthResult = {
    __kind__: "ok";
    ok: UserAccount;
} | {
    __kind__: "err";
    err: string;
};
export type ApplicationResult = {
    __kind__: "ok";
    ok: string;
} | {
    __kind__: "error";
    error: string;
};
export type AuthMethod = {
    __kind__: "email";
    email: {
        email: string;
    };
} | {
    __kind__: "phone";
    phone: {
        phone: string;
    };
};
export enum JobType {
    remote = "remote",
    contract = "contract",
    partTime = "partTime",
    fullTime = "fullTime"
}
export enum VacancyStatus {
    new_ = "new",
    old = "old",
    draft = "draft"
}
export interface backendInterface {
    countJobTypes(): Promise<{
        remote: bigint;
        contract: bigint;
        partTime: bigint;
        fullTime: bigint;
    }>;
    getAllJobs(): Promise<Array<JobListing>>;
    getApplicationCount(): Promise<bigint>;
    getApplicationsForJob(jobId: string): Promise<Array<JobApplication>>;
    getJobById(jobId: string): Promise<JobListing | null>;
    getJobCount(): Promise<bigint>;
    getUserById(userId: string): Promise<UserAccount | null>;
    getVacanciesByStatus(status: VacancyStatus): Promise<Array<JobListing>>;
    loginWithEmail(email: string, passwordHash: string): Promise<AuthResult>;
    loginWithPhone(phone: string): Promise<AuthResult>;
    postVacancy(title: string, company: string, country: string, state: string, city: string, district: string, jobType: JobType, salaryMin: bigint, salaryMax: bigint, salaryCurrency: string, description: string, status: VacancyStatus): Promise<string>;
    registerWithEmail(fullName: string, email: string, passwordHash: string): Promise<AuthResult>;
    registerWithPhone(fullName: string, phone: string): Promise<AuthResult>;
    submitApplication(jobId: string, applicantName: string, email: string, phone: string, coverLetter: string): Promise<ApplicationResult>;
}
