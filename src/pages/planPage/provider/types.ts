
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