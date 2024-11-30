import {createContext, ReactNode, useContext, useState} from "react";

interface DisplaySettings {
    index: boolean;
    credits: boolean;
    attestation: boolean;
    required: boolean;
    department: boolean;
    type: boolean;
    notesNumber: boolean;
    academicHours: boolean;
    competencies: boolean;
}

interface PreSetting {
    key: string;
    name: string;
    settings: DisplaySettings
}

const PreSettings: PreSetting[] = [
    {
        key: "subjectsCreate",
        name: "Создание дисциплин",
        settings: {
            index: false,
            credits: true,
            attestation: true,
            required: true,
            department: false,
            type: true,
            notesNumber: true,
            academicHours: false,
            competencies: false
        }
    },
    {
        key: "all",
        name: "Кабина пилота",
        settings: {
            index: true,
            credits: true,
            attestation: true,
            required: true,
            department: true,
            type: true,
            notesNumber: true,
            academicHours: true,
            competencies: true
        }
    }
]

export const PlanProvider = ({ children }: { children: ReactNode }) => {

    const [displaySettings, setDisplaySettings] = useState<DisplaySettings>(PreSettings[1].settings)

    const onChangeDisplaySetting = (key: keyof DisplaySettings) => {
        setDisplaySettings({
            ...displaySettings,
            key: !displaySettings[key]
        })
    }
    
    const value: PlanContextValue = {
        displaySettings,
        onChangeDisplaySetting
    }

    return (
        <PlanContext.Provider value={value}>
            {
                children
            }
        </PlanContext.Provider>
    )
}

export const usePlan = () => {
    return useContext(PlanContext);
}

interface PlanContextValue {
    displaySettings: DisplaySettings;
    onChangeDisplaySetting(key: keyof DisplaySettings): void;
}

const PlanContext = createContext<PlanContextValue>({
    displaySettings: PreSettings[0].settings,
    onChangeDisplaySetting: (key: keyof DisplaySettings) => {}
})