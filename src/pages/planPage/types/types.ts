import {AtomType, DepartmentDto, ModuleDto, UpdateAtomDto} from "@/api/axios-client.types.ts";

export type PrefixItemId = "subjects" | "selections" | "semesters" | "modules" | "tracks";
export const PREFIX_ITEM_ID_KEYS = ["subjects", "selections", "semesters", "modules", "tracks"] as const;

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

export type ModuleSemestersPosition = "first" | "middle" | "last" | "single";

export type ItemType = typeof PREFIX_ITEM_ID_KEYS[number];

export enum CursorMode {
    Move = "move",
    Hand = "hand",
    Replace = "replace",
    Create = "create"
}

export interface ToolsOptions {
    cursorMode: CursorMode;
    selectedCreateEntityType: ItemType;
}

export interface AtomCompetence {
    id: number;
    index: string;
    description: string;
}

export interface AtomUpdateParams {
    name?: string,
    type?: AtomType,
    isRequired?: boolean,
    credit?: number;
    attestations?: number[];
    // id of academic activity or id of new activity. If value is -1 then activity will be deleted
    academicHours?: { id: number, value: number | undefined };
    competenceIds?: number[];
    department?: DepartmentDto;
}

export const commonSubjectParamKeys = Object.keys({
    parentModuleId: null,
    name: null,
    isRequired: null,
    order: null,
    department: null,
    type: null,
    semesterIds: null
}) as Array<keyof UpdateAtomDto>;

export type CompetenceTypeName = {
    name: string,
    shortName: string
}

export interface ModuleShortDto extends Omit<ModuleDto, "atoms" | "modules"> {
    atoms: number[];
    modules: number[];
}

export type SidebarContent = "validation" | "atom";