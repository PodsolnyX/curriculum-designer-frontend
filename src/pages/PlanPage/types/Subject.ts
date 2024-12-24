import {
    AtomType,
    IAtomDto,
    IAttestationDto,
    IHoursDistributionDto
} from "@/api/axios-client.ts";
import {UniqueIdentifier} from "@dnd-kit/core";

export interface Subject {
    id: UniqueIdentifier;
    name: string,
    type: AtomType,
    isRequired: boolean,
    index?: string;
    credits: number;
    attestation?: IAttestationDto[];
    department?: number;
    semesterOrder?: number;
    academicHours?: IHoursDistributionDto[];
    competencies?: {id: number, index: string, description: string}[];
    notes?: SubjectComment[];
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