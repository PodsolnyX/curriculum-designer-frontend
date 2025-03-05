import {AtomDto, ModuleDto, SemesterDto} from "@/api/axios-client.types.ts";
import {makeAutoObservable} from "mobx";
import {useState} from "react";
import {SubjectCompetence} from "@/pages/planPage/types/Subject.ts";


class AcademicStore {

    competences: Dictionary<SubjectCompetence> = {};

    constructor() {
        makeAutoObservable(this);
    }

    setSemesters(semesters: SemesterDto[]) {
        this.semesters = semesters;
    }

    setModules(modulesData: ModuleDto[]) {
        this.modules = modulesData.map(module => {
            return {
                ...module,
                atoms: module.atoms.map(atom => atom.id),
                modules: modulesData
                    .filter(_module => module.id === _module.parentModuleId)
                    .map(module => module.id)
            }
        });
    }

    setAtoms(atomsData: AtomDto[]) {
        this.atoms = atomsData;
    }

}

export const academicStore = new AcademicStore();