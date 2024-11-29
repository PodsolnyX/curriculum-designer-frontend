import {Subject} from "@/pages/PlanPage/types/Subject.ts";

export interface Semester {
    id: string;
    number: number;
    subjects: Subject[];
}