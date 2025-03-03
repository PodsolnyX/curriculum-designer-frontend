import {Subject} from "@/pages/planPage/types/Subject.ts";


export interface Selection {
    id: string;
    name: string;
    subjects: Subject[];
    credits: number;
}

export interface Module {
    id: string;
    name: string;
    semesterId: string;
    subjects: Subject[];
}