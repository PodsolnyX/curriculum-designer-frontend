import {UniqueIdentifier} from "@dnd-kit/core";

export interface DisplaySettings {
    index: boolean;
    credits: boolean;
    attestation: boolean;
    required: boolean;
    department: boolean;
    notesNumber: boolean;
    academicHours: boolean;
    competencies: boolean;
}

export interface PreDisplaySetting {
    key: string;
    name: string;
    settings: DisplaySettings
}

export interface ModuleSemesters {
    id: string;
    name: string;
    semesters: UniqueIdentifier[];
}

export type ModuleSemestersPosition = "first" | "middle" | "last" | "single";

export interface ModuleSemestersInfo {
    position: ModuleSemestersPosition,
    countSemesters: number
}