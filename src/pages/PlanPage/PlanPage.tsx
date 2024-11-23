import {SemesterProps} from "@/pages/PlanPage/Semester.tsx";
import Semester from "@/pages/PlanPage/Semester.tsx";

const SemestersMocks: SemesterProps[] = [
    {
        number: 0,
        subjects: [
            {
                id: "111",
                name: "Элективные дисциплины по физической культуре и спорту",
                credits: 3,
                attestation: "test",
                required: true,
                index: "",
                department: 100,
                type: "subject",
                notesNumber: 0,
                academicHours: [],
                competencies: [],
            },
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
            },
            {
                id: "5",
                name: "Математика",
                credits: 3,
            },
            {
                id: "6",
                name: "Математика",
                credits: 3,
            },
            {
                id: "7",
                name: "Математика",
                credits: 3,
            },
            {
                id: "8",
                name: "Математика",
                credits: 3,
            },
            {
                id: "9",
                name: "Математика",
                credits: 3,
            },
        ]
    },
    {
        number: 1,
        subjects: [
            {
                id: "111",
                name: "Элективные дисциплины по физической культуре и спорту",
                credits: 3,
                attestation: "test",
                required: true,
                index: "",
                department: 100,
                type: "subject",
                notesNumber: 0,
                academicHours: [],
                competencies: [],
            },
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
            },
            {
                id: "5",
                name: "Математика",
                credits: 3,
            },
            {
                id: "6",
                name: "Математика",
                credits: 3,
            },
            {
                id: "7",
                name: "Математика",
                credits: 3,
            },
            {
                id: "8",
                name: "Математика",
                credits: 3,
            },
            {
                id: "9",
                name: "Математика",
                credits: 3,
            },
        ]
    },
    {
        number: 2,
        subjects: [
            {
                id: "111",
                name: "Элективные дисциплины по физической культуре и спорту",
                credits: 3,
                attestation: "test",
                required: true,
                index: "",
                department: 100,
                type: "subject",
                notesNumber: 0,
                academicHours: [],
                competencies: [],
            },
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
            },
            {
                id: "5",
                name: "Математика",
                credits: 3,
            },
            {
                id: "6",
                name: "Математика",
                credits: 3,
            },
            {
                id: "7",
                name: "Математика",
                credits: 3,
            },
            {
                id: "8",
                name: "Математика",
                credits: 3,
            },
            {
                id: "9",
                name: "Математика",
                credits: 3,
            },
        ]
    }
]

const PlanPage = () => {
    return (
        <div className={"flex flex-col min-h-screen bg-stone-100"}>
            <div className={"flex flex-col shadow-lg overflow-x-auto"}>
                {
                    SemestersMocks.map(semester =>
                        <Semester {...semester} key={semester.number}/>
                    )
                }
            </div>
        </div>
    )
}

export default PlanPage;