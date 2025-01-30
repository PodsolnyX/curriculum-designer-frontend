import {Subject} from "@/pages/planPage/types/Subject.ts";

export interface Semester {
    id: string;
    number: number;
    subjects: Subject[];
    selections: Selection[];
    modules: Module[];
    trackSelection: TrackSelection[];
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
    semesterId: string;
    subjects: Subject[];
}

export interface TrackSelection {
    id: string;
    name: string;
    tracks: Track[];
}

export interface Track {
    id: string;
    name: string;
    credits: number;
    color?: string;
    subjects: Subject[];
}