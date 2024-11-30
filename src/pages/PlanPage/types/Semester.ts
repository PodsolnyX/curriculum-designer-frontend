import {Subject} from "@/pages/PlanPage/types/Subject.ts";

export interface Semester {
    id: string;
    number: number;
    subjects: Subject[];
    selection?: Selection[]
}

export interface Selection {
    id: string;
    name: string;
    subjects: Subject[];
    credits: number;
}