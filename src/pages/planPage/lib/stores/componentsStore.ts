import {makeAutoObservable, runInAction} from "mobx";
import {
    AtomDto, CompetenceDistributionType,
    ModuleDto, RefAtomSemesterDto,
    RefModuleSemesterDto,
    SemesterDto,
    TupleOfIntegerAndString, UpdateAtomDto
} from "@/api/axios-client.types.ts";
import {AtomUpdateParams, commonSubjectParamKeys} from "@/pages/planPage/types/Subject.ts";
import {
    getIdFromPrefix,
    getParentIdFromPrefix,
    getSemesterIdFromPrefix
} from "@/pages/planPage/provider/prefixIdHelpers.ts";
import {commonStore} from "@/pages/planPage/lib/stores/commonStore.ts";
import {Client as AtomClient} from "@/api/axios-client/AtomQuery.ts";
import {Client as AtomInSemesterClient} from "@/api/axios-client/AtomInSemesterQuery.ts";
import {Client as HoursDistributionClient} from "@/api/axios-client/HoursDistributionQuery.ts";
import {Client as AtomCompetenceClient} from "@/api/axios-client/AtomCompetenceQuery.ts";
import {Client as AttestationClient} from "@/api/axios-client/AttestationQuery.ts";
import { message } from "antd";
import {arraysToDict} from "@/shared/lib/helpers/common.ts";

export interface ModuleShortDto extends Omit<ModuleDto, "atoms" | "modules"> {
    atoms: number[];
    modules: number[];
}

const ATOM_SUCCESS_UPDATE_MESSAGE = "Предмет успешно обновлён";

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

    updateAtom(
        id: string,
        paramKey: keyof AtomUpdateParams,
        param: AtomUpdateParams[typeof paramKey]
    ) {

        const atomId = Number(getIdFromPrefix(id));
        const semesterId = Number(getSemesterIdFromPrefix(id));

        const updateParam = (atom?: AtomDto): AtomDto => {
            if (!atom) return;

            runInAction(() => {
                if (commonSubjectParamKeys.includes(paramKey as keyof UpdateAtomDto)) {
                    atom![paramKey] = param;
                }
                else if (paramKey === "competenceIds" && commonStore.curriculumData) {
                    commonStore.curriculumData.settings.competenceDistributionType === CompetenceDistributionType.Competence
                        ? atom.competenceIds = param as number[]
                        : atom.competenceIndicatorIds = param as number[]
                }
                else {
                    const semester = atom.semesters.find(semester => semester.semester.id === semesterId);
                    if (paramKey === "credit") semester.credit = param as number;
                    else if (paramKey === "attestations") {
                        semester.attestations = (param as number[]).map(item =>
                            commonStore.attestationTypes
                                ? commonStore.attestationTypes.find(type => type.id === item)
                                : { id: item, name: "", shortName: "" }
                        );
                    }
                    else if (paramKey === "academicHours") {
                        param = param as {id: number, value: number | undefined};
                        if (param.id && param.value === -1) {
                            semester.academicActivityHours = semester.academicActivityHours.filter(hour => hour.academicActivity.id !== param.id);
                        }
                        else if (param.id && (param.value >= 0)) {
                            semester.academicActivityHours = semester.academicActivityHours.map(hour => hour.academicActivity.id === param.id ? { ...hour, value: param?.value || 0 } : hour);
                        }
                        else {
                            const activity = commonStore.academicActivity ? commonStore.academicActivity.find(activity => activity.id === param.id) : undefined;
                            if (activity) {
                                semester.academicActivityHours.push({
                                    academicActivity: activity,
                                    value: 0,
                                    isCalculated: false
                                });
                            }
                        }
                    }
                }
            })
        };

        updateParam(this.atoms.find(atom => atom.id === atomId));

        const handlers: Record<string, () => void> = {
            credit: () => AtomInSemesterClient.setAtomCredit(atomId, semesterId, { credit: param as number })
                .then(() => message.success(ATOM_SUCCESS_UPDATE_MESSAGE)),
            attestations: () => AttestationClient.setAttestation({ atomId, semesterId, attestationIds: param as number[] })
                .then(() => message.success(ATOM_SUCCESS_UPDATE_MESSAGE)),
            academicHours: () => {
                param = param as {id: number, value: number | undefined};
                if (param.id && param.value === -1) {
                    HoursDistributionClient.deleteHoursDistribution(commonStore.curriculumData.id, param.id, semesterId, atomId )
                        .then(() => message.success(ATOM_SUCCESS_UPDATE_MESSAGE));
                } else {
                    HoursDistributionClient.createUpdateHoursDistribution(commonStore.curriculumData.id, param.id, { value: param?.value ?? 0 }, semesterId, atomId )
                        .then(() => message.success(ATOM_SUCCESS_UPDATE_MESSAGE));
                }
            },
            competenceIds: () => {
                if (commonStore.curriculumData) {
                    if (commonStore.curriculumData.settings.competenceDistributionType === CompetenceDistributionType.Competence)
                        AtomCompetenceClient.setAtomCompetences(atomId, { competenceIds: param as number[]})
                            .then(() => message.success(ATOM_SUCCESS_UPDATE_MESSAGE));
                    else
                        AtomCompetenceClient.setAtomCompetenceIndicators(atomId, { competenceIndicatorIds: param as number[]})
                            .then(() => message.success(ATOM_SUCCESS_UPDATE_MESSAGE));
                }
            }
        };

        if (commonSubjectParamKeys.includes(paramKey as keyof UpdateAtomDto)) {
            AtomClient.updateAtom(atomId, { [paramKey]: param })
                .then(() => message.success(ATOM_SUCCESS_UPDATE_MESSAGE));
        } else {
            handlers[paramKey]?.();
        }
    }

    expandAtom(id: string, semesterNumber: number, direction: "prev" | "next") {
        const atomId = Number(getIdFromPrefix(id));
        const semesterId = this.semesters.find(semester => semester.number === semesterNumber)?.id;
        const atom = this.atoms.find(atom => atom.id === atomId);

        if (!atom || !semesterId) return;

        const newSemester: RefAtomSemesterDto = {
            semester: this.semesters.find(semester => semester.number === semesterNumber),
            credit: 0,
            attestations: [],
            academicActivityHours: []
        };

        runInAction(() => {
            atom.semesters = direction === "prev" ? [newSemester, ...atom.semesters] : [...atom.semesters, newSemester];
        })

        AtomInSemesterClient.createAtomInSemester(atomId, semesterId)
            .then(() => message.success(ATOM_SUCCESS_UPDATE_MESSAGE))
    }

    moveAtoms(activeId: string, overId: string) {
        const atomId = Number(getIdFromPrefix(activeId));
        const activeSemesterId = Number(getSemesterIdFromPrefix(activeId));
        const activeParentModuleId = Number(getParentIdFromPrefix(activeId));
        const overSemesterId = Number(getSemesterIdFromPrefix(overId));
        const overParentModuleId = Number(getParentIdFromPrefix(overId));

        const atom = this.atoms.find(atom => atom.id === atomId);

        if (!atom) return;

        const indexTargetSemester =  this.semesters.findIndex(semester => semester.id === overSemesterId);
        const indexInitialSemester =  atom.semesters.findIndex(semester => semester.semester.id === activeSemesterId);
        const initialSubjectSemestersIndex = atom.semesters.map(semester => semester.semester.number - 1);
        const newSubjectSemestersIndex = atom.semesters.map((_, index) => indexTargetSemester + index - indexInitialSemester)

        //Если предметы не помещаются по верхнему или нижнему пределу
        if (newSubjectSemestersIndex.includes(-1) || newSubjectSemestersIndex.includes(this.semesters.length)) {
            message.error("Невозможно переместить предметы в этот семестр")
        }

        let newAtomSemesters: SemesterDto[] = [];

        runInAction(() => {
            atom.parentModuleId = overSemesterId === overParentModuleId ? null : overParentModuleId;
            atom.semesters = atom.semesters.map((refSemester, index) => {
                newAtomSemesters.push(this.semesters[newSubjectSemestersIndex[index]]);
                return {
                    ...refSemester,
                    semester: this.semesters[newSubjectSemestersIndex[index]]
                }
            });
        })

        const concatModuleSemestersWithAtomSemesters = (module: ModuleShortDto) => {
            const mergedMap = new Map<number, SemesterDto>();

            if (module.semesters.length === 1 && module.semesters[0].semester.number === 0) {
                [...newAtomSemesters].forEach(semester => {
                    mergedMap.set(semester.number, semester);
                });
            }
            else {
                [...module.semesters.map(semester => semester.semester), ...newAtomSemesters].forEach(semester => {
                    mergedMap.set(semester.number, semester);
                });
            }

            const mergedArray = Array.from(mergedMap.values()).sort((a, b) => a.number - b.number);

            const mergedSemesters = mergedArray.map(semester => {
                return {
                    semester,
                    nonElective: module.semesters.find(sem => sem.semester.id === semester.id)?.nonElective || {
                        credit: 0, attestations: [], academicActivityHours: []
                    },
                    elective: module.semesters.find(sem => sem.semester.id === semester.id)?.elective || {
                        credit: 0, attestations: [], academicActivityHours: []
                    }
                }
            });

            runInAction(() => {
                module.atoms = [...module.atoms, atomId];
                module.semesters = mergedSemesters;
            })
        }

        const removeAtomFromModules = (module: ModuleShortDto, atomId: number) => {

            const updatedSemesters = module.semesters
                .filter(moduleSemester => module.atoms.filter(moduleAtom => moduleAtom !== atomId)
                    .some(moduleAtom => {
                        const moduleAtomInfo = this.getAtom(moduleAtom);
                        if (!moduleAtomInfo) return false;
                        return !!moduleAtomInfo.semesters.find(atomSemester => atomSemester.semester.id === moduleSemester.semester.id)
                    })
                );

            if (!updatedSemesters.length) {
                updatedSemesters.push({
                    semester: this.semesters.find(semester => semester.id === module.parentSemesterId),
                    nonElective: {credit: 0, attestations: [], academicActivityHours: []},
                    elective: {credit: 0, attestations: [], academicActivityHours: []},
                })
            }

            runInAction(() => {
                module.atoms = module.atoms.filter(moduleAtom => moduleAtom !== atomId);
                module.semesters = updatedSemesters;
            });
        }

        runInAction(() => {
            if ((activeParentModuleId !== overParentModuleId) && (activeSemesterId !== activeParentModuleId || overSemesterId !== overParentModuleId)) {
                this.modules.forEach(module => {
                    if (module.id === activeParentModuleId)
                        removeAtomFromModules(module, atomId);
                    else if (module.id === overParentModuleId)
                        concatModuleSemestersWithAtomSemesters(module);
                });
            }
        })

        AtomClient.updateAtom(atomId, {
            semesterIds: arraysToDict(
                initialSubjectSemestersIndex.map(index => this.semesters[index].id),
                newSubjectSemestersIndex.map(index => this.semesters[index].id)
            ) as {[p: string]: number},
            parentModuleId: overSemesterId === overParentModuleId ? null : overParentModuleId
        }).then(() => message.success(ATOM_SUCCESS_UPDATE_MESSAGE))

        runInAction(() => {
            this.resetAllActiveIds();
        })
    }
}



export const componentsStore = new ComponentsStore();