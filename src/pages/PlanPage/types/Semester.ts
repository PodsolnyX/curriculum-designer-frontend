import {Subject} from "@/pages/PlanPage/types/Subject.ts";

export interface Semester {
    id: string;
    number: number;
    subjects: Subject[];
    selections: Selection[]
}

export interface Selection {
    id: string;
    name: string;
    subjects: Subject[];
    credits: number;
}