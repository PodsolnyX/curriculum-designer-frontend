import {Semester} from "@/pages/PlanPage/SemesterField/SemesterField.tsx";

export const SemestersMocks: Semester[] = [
    {
        id: "semester-1",
        number: 1,
        subjects: [
            {
                id: "222",
                name: "Математика",
                credits: 3,
            },
            {
                id: "3",
                name: "Введение в компьютерные науки",
                credits: 3,
            },
            {
                id: "4",
                name: "Безопасность жизнедеятельности",
                credits: 3,
            }
        ]
    },
    {
        id: "semester-2",
        number: 2,
        subjects: [
            {
                id: "222222",
                name: "Элективные дисциплины по физической культуре и спорту",
                credits: 3
            },
            {
                id: "2233333332",
                name: "Экология",
                credits: 3,
            },
            {
                id: "4444444444443",
                name: "Наркология",
                credits: 3,
            },
        ]
    },
    {
        id: "semester-3",
        number: 3,
        subjects: [
            {
                id: "11fffffffff1",
                name: "Математический анализ",
                credits: 3
            },
            {
                id: "2ffffffff22",
                name: "Английский язык",
                credits: 3,
            },
            {
                id: "fffffffff3",
                name: "Право",
                credits: 3,
            },
        ]
    }
]