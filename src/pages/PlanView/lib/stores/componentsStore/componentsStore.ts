import {makeAutoObservable} from "mobx";
import {
    AtomDto,
    ModuleDto,
    RefModuleSemesterDto,
    SemesterDto,
    TupleOfIntegerAndString,
} from "@/api/axios-client.types.ts";
import { AtomUpdateParams, ModuleShortDto } from "@/pages/PlanView/types/types.ts";
import { AtomModuleMoveService } from "@/pages/PlanView/lib/stores/componentsStore/atomMoveService/atomMoveService.ts";
import { AtomUpdateService } from "@/pages/PlanView/lib/stores/componentsStore/atomUpdateService/atomUpdateService.ts";
import {
    ModuleUpdateService
} from "@/pages/PlanView/lib/stores/componentsStore/moduleUpdateService/moduleUpdateService.ts";
import { commonStore } from "@/pages/PlanView/lib/stores/commonStore.ts";
import { optionsStore } from "@/pages/PlanView/lib/stores/optionsStore.ts";
import { ModuleMoveService } from "@/pages/PlanView/lib/stores/componentsStore/moduleMoveService/moduleMoveService.ts";

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

    get moveService(): AtomModuleMoveService {
        return new AtomModuleMoveService(
          this.atoms,
          this.semesters,
          this.modules,
          this.getAtom.bind(this),
          this.resetAllActiveIds.bind(this)
        );
    }

    get moveModuleService(): ModuleMoveService {
        return new ModuleMoveService(
          this.atoms,
          this.semesters,
          this.modules,
          this.resetAllActiveIds.bind(this)
        );
    }

    get atomUpdateService(): AtomUpdateService {
        return new AtomUpdateService(commonStore.curriculumData.id, this.atoms, this.semesters, this.modules);
    }

    get moduleUpdateService(): ModuleUpdateService {
        return new ModuleUpdateService(commonStore.curriculumData.id, this.atoms, this.modules, this.semesters);
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

    setActiveId(id: string | null) {
        this.activeId = id;
    }

    setOverId(id: string | null) {
        this.overId = id;
    }

    isActive(id: string) {
        return this.activeId === id;
    }

    isOver(id: string) {
        return this.overId === id;
    }

    resetAllActiveIds() {
        this.activeId = null;
        this.overId = null;
    }

    createEntity(targetId: string) {

        const entityType = optionsStore.toolsOptions.selectedCreateEntityType;

        const serviceMap = {
            subjects: (id) => this.atomUpdateService.createAtom(id),
            modules: (id) => this.moduleUpdateService.createModule(id),
            selections: (id) => this.moduleUpdateService.createModule(id, true),
        };

        const createMethod = serviceMap[entityType];
        if (createMethod) {
            createMethod(targetId);
        }
    }

    createAtom(parentId: string) {
        this.atomUpdateService.createAtom(parentId);
    }

    updateAtom(
        id: string,
        paramKey: keyof AtomUpdateParams,
        param: AtomUpdateParams[typeof paramKey]
    ) {
        this.atomUpdateService.updateAtom(id, paramKey, param);
    }

    expandAtom(id: string, semesterNumber: number, direction: "prev" | "next") {
        this.atomUpdateService.expandAtom(id, semesterNumber, direction);
    }

    removeAtom(id: string) {
        this.atomUpdateService.removeAtom(id);
    }

    moveAtoms(activeId: string, overId: string) {
        this.moveService.moveAtoms(activeId, overId);
    }

    updateModuleName(id: string, newName: string) {
        this.moduleUpdateService.updateModuleName(id, newName);
    }

    transformModuleToSelection(id: string) {
        this.moduleUpdateService.transformModuleToSelection(id);
    }

    transformSelectionToModule(id: string) {
        this.moduleUpdateService.transformSelectionToModule(id);
    }

    removeModule(id: string) {
        this.moduleUpdateService.removeModule(id);
    }

    moveModule(activeId: string, overId: string) {
        this.moveModuleService.moveModule(activeId, overId);
    }
}



export const componentsStore = new ComponentsStore();