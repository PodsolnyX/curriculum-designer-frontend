import {DisplaySettings, PreDisplaySetting} from "@/pages/PlanView/types/types.ts";

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

export const ReplacePreDisplaySetting: PreDisplaySetting =  {
    key: "replace",
    name: "Перемещение",
    settings: {
        index: false,
        credits: true,
        attestation: true,
        required: false,
        department: false,
        notesNumber: false,
        academicHours: false,
        competencies: false
    }
};

export const PreDisplaySettings: PreDisplaySetting[] = [
    {
        key: "disableAll",
        name: "Отключить всё",
        settings: {
            index: false,
            credits: false,
            attestation: false,
            required: false,
            department: false,
            notesNumber: false,
            academicHours: false,
            competencies: false
        }
    },
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
        name: "Отобразить всё",
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