import {UniqueIdentifier} from "@dnd-kit/core";

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

export interface ModulePosition {
    id: string;
    name: string;
    columnIndex: number;
    startSemesterNumber: number;
    semesters: UniqueIdentifier[];
}

export type ModuleSemestersPosition = "first" | "middle" | "last" | "single";

export interface ModuleSemestersInfo {
    position: ModuleSemestersPosition,
    countSemesters: number
}

export interface TrackSelectionSemestersInfo {
    position: ModuleSemestersPosition,
    semesterNumber: number,
    countSemesters: number
}

export type ItemType = typeof PREFIX_ITEM_ID_KEYS[number];

export enum CursorMode {
    Move = "move",
    Hand = "hand",
    Create = "create"
}

export interface ToolsOptions {
    cursorMode: CursorMode;
    selectedCreateEntityType: ItemType;
}