import {UniqueIdentifier} from "@dnd-kit/core";
import {
    AtomType,
    CompetenceDto,
    CompetenceIndicatorDto,
    IAtomDto, IAttestationDto, IHoursDistributionDto,
    RefComponentSemesterDto
} from "@/api/axios-client.ts";

export interface Subject extends IAtomDto {
    index?: string;
    credits: number;
    attestation?: IAttestationDto;
    department?: number;
    semesterOrder?: number;
    academicHours?: IHoursDistributionDto[];
    competencies?: {id: string, value: string, description: string}[];
    notes?: SubjectComment[];
}

export interface SubjectComment {
    id: string;
    author: string;
    date: string;
    text: string;
}

export interface AcademicHours {
    key: string,
    value: number
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

export const AttestationTypeName: Record<AttestationType, string> = {
    [AttestationType.Test]: "За",
    [AttestationType.AssessmentTest]: "ЗаО",
    [AttestationType.Exam]: "Эк"
}

export const AttestationTypeFullName: Record<AttestationType, string> = {
    [AttestationType.Test]: "Зачёт",
    [AttestationType.AssessmentTest]: "Зачёт с оценкой",
    [AttestationType.Exam]: "Экзамен"
}

export const SubjectTypeFullName: Record<SubjectType, {name: string, color: string}> = {
    [SubjectType.Subject]: {name: "Дисциплина", color: "blue"},
    [SubjectType.Practice]: {name: "Практика", color: "orange"},
    [SubjectType.StateCertification]: {name: "ГИА", color: "red"},
    [SubjectType.Elective]: {name: "Факультатив", color: "purple"}
}