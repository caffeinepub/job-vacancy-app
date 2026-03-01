import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface JobApplication {
    applicantName: string;
    applicationId: string;
    jobId: string;
    submittedAt: Time;
    coverLetter: string;
    email: string;
    phone: string;
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
export type Time = bigint;
export type ApplicationResult = {
    __kind__: "ok";
    ok: string;
} | {
    __kind__: "error";
    error: string;
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
    getVacanciesByStatus(status: VacancyStatus): Promise<Array<JobListing>>;
    postVacancy(title: string, company: string, country: string, state: string, city: string, district: string, jobType: JobType, salaryMin: bigint, salaryMax: bigint, salaryCurrency: string, description: string, status: VacancyStatus): Promise<string>;
    submitApplication(jobId: string, applicantName: string, email: string, phone: string, coverLetter: string): Promise<ApplicationResult>;
}
