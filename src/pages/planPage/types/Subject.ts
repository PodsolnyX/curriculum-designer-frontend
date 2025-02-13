import {
    AtomType, AttestationDto, HoursDistributionDto, UpdateAtomDto,
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
    department?: {id: number, name: string};
    semesterOrder?: number;
    academicHours?: HoursDistributionDto[];
    competencies?: {id: number, index: string, description: string}[];
    notes?: SubjectComment[];
    semesterId?: string;
    semestersIds?: number[];
    neighboringSemesters: {
        prev: number | null;
        next: number | null;
    }
}

export interface SubjectUpdateParams {
    name?: string,
    type?: AtomType,
    isRequired?: boolean,
    credits?: number;
    attestation?: number[];
}

export const commonSubjectParamKeys = Object.keys({
    parentModuleId: null,
    name: null,
    isRequired: null,
    order: null,
    type: null,
    semesterIds: null
}) as Array<keyof UpdateAtomDto>;

export interface SubjectComment {
    id: string;
    author: string;
    date: string;
    text: string;
}