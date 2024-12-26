import {DisplaySettings, PreDisplaySetting} from "@/pages/planPage/provider/types.ts";

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