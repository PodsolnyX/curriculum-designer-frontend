import {Subject} from "@/pages/PlanPage/types/Subject.ts";

export interface Semester {
    id: string;
    number: number;
    subjects: Subject[];
    selections: Selection[];
    modules: Module[];
    tracks: Track[];
}

export interface Selection {
    id: string;
    name: string;
    subjects: Subject[];
    credits: number;
}

export interface Module {
    id: string;
    name: string;
    subjects: Subject[];
}

export interface Track {
    id: string;
    name: string;
    credits: number;
    color?: string;
    subjects: Subject[];
}