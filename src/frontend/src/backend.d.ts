import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface MechanicApplication {
    serviceType: string;
    dateOfBirth: string;
    name: string;
    experience: string;
    address: string;
    motivation: string;
    timestamp: Time;
    phone: string;
}
export interface ContactInquiry {
    serviceType: string;
    name: string;
    description: string;
    email: string;
    address: string;
    preferredTime: string;
    timestamp: Time;
    phone: string;
}
export type Time = bigint;
export interface backendInterface {
    getAllApplications(): Promise<Array<MechanicApplication>>;
    getAllInquiries(): Promise<Array<ContactInquiry>>;
    getApplicationByName(name: string): Promise<MechanicApplication>;
    getInquiryByName(name: string): Promise<ContactInquiry>;
    submitApplication(name: string, dateOfBirth: string, phone: string, serviceType: string, experience: string, address: string, motivation: string): Promise<void>;
    submitInquiry(name: string, phone: string, email: string, serviceType: string, address: string, description: string, preferredTime: string): Promise<void>;
}
