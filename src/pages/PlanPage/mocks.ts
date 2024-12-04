import {Semester} from "@/pages/PlanPage/types/Semester.ts";
import {AttestationType, SubjectType} from "@/pages/PlanPage/types/Subject.ts";
import {AcademicType} from "@/pages/PlanPage/types/AcademicTypes.ts";

export const AcademicTypes: AcademicType[] = [
    {
        key: "Лек",
        name: "Лек",
    },
    {
        key: "Лаб",
        name: "Лаб",
    },
    {
        key: "Пр",
        name: "Пр",
    },
    {
        key: "Сем",
        name: "Сем",
    },
    {
        key: "КРто",
        name: "КРто",
    },
    {
        key: "КРи",
        name: "КРи",
    },
    {
        key: "КРатт",
        name: "КРатт",
    },
    {
        key: "Контр",
        name: "Контр",
    },
    {
        key: "СР",
        name: "СР",
    },
    {
        key: "Конт",
        name: "Конт",
    }
]

export const SemestersMocks: Semester[] = [
    {
        id: "semesters-1",
        number: 1,
        subjects: [
            {
                id: "2424242",
                name: "Математика для компьютерных наук",
                credits: 4,
                required: true,
                semesterOrder: 1,
                attestation: AttestationType.Exam,
                index: "Б1.О.05.01"
            },
            {
                id: "3",
                name: "Введение в компьютерные науки",
                credits: 3,
            },
            {
                id: "4",
                name: "Безопасность жизнедеятельности",
                credits: 2,
            }
        ],
        selections: [
            {
                name: "Выбор 1",
                credits: 3,
                id: "selections-1",
                subjects: []
            }
        ]
    },
    {
        id: "semesters-2",
        number: 2,
        selections: [
            {
                name: "Выбор 2",
                credits: 3,
                id: "selections-2",
                subjects: []
            }
        ],
        subjects: [
            {
                id: "222222",
                name: "Элективные дисциплины по физической культуре и спорту",
                credits: 3,
                type: SubjectType.Practice
            },
            {
                id: "2233333332",
                name: "Экология",
                credits: 3,
            },
            {
                id: "222",
                name: "Математика для компьютерных наук",
                credits: 10,
                required: true,
                semesterOrder: 2,
                department: 143,
                index: "Б1.О.05.01",
                competencies: [
                    { value: "БК-1", name: "БК-1" },
                    { value: "БК-2", name: "БК-2" },
                    { value: "УК-1", name: "УК-1" },
                    { value: "УК-3", name: "УК-3" },
                    { value: "ОПК-3", name: "ОПК-3" }
                ],
                academicHours: [
                    {
                        key: "Лек",
                        value: 12,
                    },
                    {
                        key: "Лаб",
                        value: 22,
                    },
                    {
                        key: "Пр",
                        value: 33,
                    },
                    {
                        key: "Сем",
                        value: 0,
                    },
                    {
                        key: "КРто",
                        value: 4,
                    },
                    {
                        key: "КРи",
                        value: 5,
                    },
                    {
                        key: "КРатт",
                        value: 6,
                    },
                    {
                        key: "Контр",
                        value: 4.5,
                    },
                    {
                        key: "СР",
                        value: 44,
                    },
                    {
                        key: "Конт",
                        value: 123,
                    }
                ]
            },
            {
                id: "4444444444443",
                name: "Наркология",
                credits: 3,
                type: SubjectType.Elective
            },
        ]
    },
    {
        id: "semesters-3",
        number: 3,
        selections: [],
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
                type: SubjectType.StateCertification
            },
        ]
    },
    {
        id: "semesters-4",
        number: 4,
        selections: [],
        subjects: []
    },
    {
        id: "semesters-5",
        number: 5,
        selections: [],
        subjects: []
    },
    {
        id: "semesters-6",
        number: 6,
        selections: [],
        subjects: []
    },
    {
        id: "semesters-7",
        number: 7,
        selections: [],
        subjects: []
    },
    {
        id: "semesters-8",
        number: 8,
        selections: [],
        subjects: []
    }
]