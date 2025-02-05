import {
    AtomType, AttestationDto, HoursDistributionDto,
} from "@/api/axios-client.ts";
import {UniqueIdentifier} from "@dnd-kit/core";

export interface Subject {
    id: UniqueIdentifier;
    name: string,
    type: AtomType,
    isRequired: boolean,
    index?: string;
    credits: number;
    attestation?: AttestationDto[];
    department?: number;
    semesterOrder?: number;
    academicHours?: HoursDistributionDto[];
    competencies?: {id: number, index: string, description: string}[];
    notes?: SubjectComment[];
    semesterId?: string;
}

export interface SubjectComment {
    id: string;
    author: string;
    date: string;
    text: string;
}

export interface Competencies {
    id: string,
    value: string,
    description: string,
    indicators: CompetenceIndicator[]
}

export interface CompetenceIndicator {
    id: string,
    value: string,
    description: string
}

export enum SubjectType {
    Subject = "Subject",
    Practice = "Practice",
    Elective = "Elective",
    StateCertification = "StateCertification"
}

export enum AttestationType {
    Test = "Test",
    AssessmentTest = "AssessmentTest",
    Exam = "Exam"
}