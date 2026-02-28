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
    title: string;
    salaryCurrency: string;
    jobType: JobType;
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
export interface backendInterface {
    getAllJobs(): Promise<Array<JobListing>>;
    getApplicationsForJob(jobId: string): Promise<Array<JobApplication>>;
    getJobById(jobId: string): Promise<JobListing>;
    submitApplication(jobId: string, applicantName: string, email: string, phone: string, coverLetter: string): Promise<ApplicationResult>;
}
