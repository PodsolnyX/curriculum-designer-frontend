import {UniqueIdentifier} from "@dnd-kit/core";

export interface Subject {
    id: UniqueIdentifier;
    name?: string;
    credits?: number;
    attestation?: AttestationType;
    required?: boolean;
    index?: string;
    department?: number;
    type?: SubjectType;
    notesNumber?: number;
    semesterOrder?: number;
    academicHours?: AcademicHours[];
    competencies?: Competencies[];
}

export interface AcademicHours {
    key: string,
    value: number
}

export interface Competencies {
    value: string,
    name: string
}

export enum SubjectType {
    Subject = "Subject",
    Practice = "Practice",
    StateCertification = "StateCertification",
    Elective = "Elective"
}

export enum AttestationType {
    Test = "Test",
    AssessmentTest = "AssessmentTest",
    Exam = "Exam"
}

export const AttestationTypeName: Record<AttestationType, string> = {
    [AttestationType.Test]: "За",
    [AttestationType.AssessmentTest]: "ЗаО",
    [AttestationType.Exam]: "Эк"
}