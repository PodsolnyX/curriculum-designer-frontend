import {createContext, ReactNode, useContext, useState} from "react";

interface DisplaySettings {
    index: boolean;
    credits: boolean;
    attestation: boolean;
    required: boolean;
    department: boolean;
    notesNumber: boolean;
    academicHours: boolean;
    competencies: boolean;
}

export const DisplaySettingsList: {key: keyof DisplaySettings, name: string}[] = [
    { key: "index", name: "Индексы" },
    { key: "credits", name: "ЗЕТ" },
    { key: "attestation", name: "Промежуточная аттестация" },
    { key: "required", name: "Обязательность" },
    { key: "department", name: "Кафедры" },
    { key: "notesNumber", name: "Заметки" },
    { key: "academicHours", name: "Распределение часов" },
    { key: "competencies", name: "Компетенции" }
];

interface PreDisplaySetting {
    key: string;
    name: string;
    settings: DisplaySettings
}

export const PreDisplaySettings: PreDisplaySetting[] = [
    {
        key: "subjectsCreate",
        name: "Создание дисциплин",
        settings: {
            index: false,
            credits: true,
            attestation: true,
            required: true,
            department: false,
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
            notesNumber: true,
            academicHours: true,
            competencies: true
        }
    }
]

export const PlanProvider = ({ children }: { children: ReactNode }) => {

    const [displaySettings, setDisplaySettings] = useState<DisplaySettings>(PreDisplaySettings[0].settings)

    const onChangeDisplaySetting = (key: keyof DisplaySettings) => {
        setDisplaySettings({
            ...displaySettings,
            [key]: !displaySettings[key]
        })
    }

    const onSelectPreDisplaySetting = (key: string) => {
        setDisplaySettings({
            ...PreDisplaySettings.find(setting => setting.key === key).settings
        })
    }
    
    const value: PlanContextValue = {
        displaySettings,
        onChangeDisplaySetting,
        onSelectPreDisplaySetting
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
    onSelectPreDisplaySetting(key: string): void;
}

const PlanContext = createContext<PlanContextValue>({
    displaySettings: PreDisplaySettings[0].settings,
    onChangeDisplaySetting: (key: keyof DisplaySettings) => {},
    onSelectPreDisplaySetting: (key: string) => {}
})