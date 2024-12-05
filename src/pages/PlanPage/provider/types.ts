
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