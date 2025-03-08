import { makeAutoObservable } from "mobx";
import {
    AtomDto,
    ModuleDto,
    RefModuleSemesterDto,
    SemesterDto,
    TupleOfIntegerAndString
} from "@/api/axios-client.types.ts";

export interface ModuleShortDto extends Omit<ModuleDto, "atoms" | "modules"> {
    atoms: number[];
    modules: number[];
}

class ComponentsStore {

    activeId: string | null;
    overId: string | null;

    semesters: SemesterDto[] = [];
    semestersActivity: RefModuleSemesterDto[] = [];
    modules: ModuleShortDto[] = [];
    atoms: AtomDto[] = [];
    indexes: TupleOfIntegerAndString[] = [];

    constructor() {
        makeAutoObservable(this);
    }

    setSemesters(semesters: SemesterDto[]) {
        this.semesters = semesters;
    }

    setSemestersActivity(semesters: RefModuleSemesterDto[]) {
        this.semestersActivity = semesters;
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

    setIndexes(indexesData: TupleOfIntegerAndString[]) {
        this.indexes = indexesData;
    }

    getAtom(atomId: number): AtomDto | undefined {
        return this.atoms.find(atom => atom.id === atomId)
    }

    getAtoms(atomId: number[]): AtomDto[] {
        const atoms: AtomDto[] = [];
        this.atoms.forEach(atom => {
            if (atomId.includes(atom.id)) atoms.push(atom)
        })
        return atoms
    }

    getModule(moduleId: number): ModuleShortDto | undefined {
        return this.modules.find(module => module.id === moduleId)
    }

    getIndex(id: number): string | undefined {
        return this.indexes.find(index => index.item1 === id)?.item2 || undefined
    }

    moveAtoms(activeId: string, overId: string) {

    }
}



export const componentsStore = new ComponentsStore();