import { makeAutoObservable } from "mobx";
import {AtomDto, ModuleDto, SemesterDto} from "@/api/axios-client.types.ts";

export interface ModuleShortDto extends Omit<ModuleDto, "atoms" | "modules"> {
    atoms: number[];
    modules: number[];
}

class ComponentsStore {

    semesters: SemesterDto[] = [];
    modules: ModuleShortDto[] = [];
    atoms: AtomDto[] = [];

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

export const componentsStore = new ComponentsStore();