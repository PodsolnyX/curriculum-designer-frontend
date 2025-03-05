import {createContext, ReactNode, useCallback, useContext, useEffect, useState} from "react";
import {DragCancelEvent, DragEndEvent, DragOverEvent, DragStartEvent, UniqueIdentifier} from "@dnd-kit/core";
import {
    CursorMode,
    DisplaySettings,
    ToolsOptions,
} from "@/pages/planPage/provider/types.ts";
import {PreDisplaySettings} from "@/pages/planPage/provider/preDisplaySettings.ts";
import {
    commonSubjectParamKeys,
    Subject,
    SubjectCompetence,
    AtomUpdateParams,
} from "@/pages/planPage/types/Subject.ts";
import {
    AcademicActivityDto,
    AtomDto,
    AttestationDto,
    CompetenceDistributionType,
    CurriculumSettingsDto,
    ModuleDto, RefAtomSemesterDto,
    RefModuleSemesterDto,
    SemesterDto,
    UpdateAtomDto, ValidationError,
} from "@/api/axios-client.ts";
import {useDisplaySettings} from "@/pages/planPage/provider/useDisplaySettings.ts";
import {
    getIdFromPrefix, getParentIdFromPrefix, getSemesterIdFromPrefix, splitIds
} from "@/pages/planPage/provider/prefixIdHelpers.ts";
import {useCurriculumData} from "@/pages/planPage/provider/useCurriculumData.ts";
import {useEditSubjectWithParams} from "@/pages/planPage/hooks/useEditSubject.ts";
import {App} from "antd";
import {usePlanParams} from "@/pages/planPage/hooks/usePlanParams.ts";

export interface ModuleShortDto extends Omit<ModuleDto, "atoms" | "modules"> {
    atoms: number[];
    modules: number[];
}

export const PlanProvider = ({children}: { children: ReactNode }) => {

    const {message} = App.useApp();
    const {setSidebarContent} = usePlanParams()

    const [semesters, setSemesters] = useState<SemesterDto[]>([]);
    const [atomsList, setAtomsList] = useState<AtomDto[]>([]);
    const [modulesList, setModulesList] = useState<ModuleShortDto[]>([]);
    const [competences, setCompetences] = useState<Dictionary<SubjectCompetence>>({});

    const [activeItemId, setActiveItemId] = useState<UniqueIdentifier | null>(null);
    const [overItemId, setOverItemId] = useState<UniqueIdentifier | null>(null);

    const [selectedAtom, setSelectedAtom] = useState<string | null>(null);
    const [selectedCompetenceId, setSelectedCompetenceId] = useState<UniqueIdentifier | null>(null);

    const {
        editInfo,
        setCredits,
        editAttestation,
        editAcademicHours,
        deleteAcademicHours,
        editIndicator,
        editCompetence,
        expand
    } = useEditSubjectWithParams();

    const {
        curriculumId,
        curriculumData,
        semestersData,
        atomsData,
        modulesData,
        attestationTypesData,
        academicActivityData,
        competencesData,
        competenceIndicatorsData,
        indexesData,
        validationErrorsData,
        isLoading
    } = useCurriculumData({modulesPlainList: true});

    const [toolsOptions, setToolsOptions] = useState<ToolsOptions>({
        cursorMode: CursorMode.Move,
        selectedCreateEntityType: "subjects"
    });

    const {
        displaySettings,
        disableSettings,
        enableSettings,
        onChangeDisplaySetting,
        onSelectPreDisplaySetting
    } = useDisplaySettings();

    useEffect(() => {
        if (curriculumData?.semesters.length) {
            setSemesters(curriculumData.semesters)
        }
    }, [curriculumData])

    useEffect(() => {
        if (atomsData) setAtomsList(atomsData)
    }, [atomsData])

    useEffect(() => {
        if (modulesData) {
            setModulesList(modulesData
                .map(module => {
                    return {
                        ...module,
                        atoms: module.atoms.map(atom => atom.id),
                        modules: modulesData
                            .filter(_module => module.id === _module.parentModuleId)
                            .map(module => module.id)
                    }
                })
            )
        }
    }, [modulesData])

    useEffect(() => {
        if (curriculumData && (competencesData || competenceIndicatorsData)) {
            let _competences: Dictionary<SubjectCompetence> = {};

            if (competencesData && curriculumData.settings.competenceDistributionType === CompetenceDistributionType.Competence)
                competencesData.forEach(competence => {
                    _competences[competence.id] = {id: competence.id, index: competence.index, description: competence.name};
                })
            else if (competenceIndicatorsData) competenceIndicatorsData.forEach(competence => {
                _competences[competence.id] = {id: competence.id, index: competence.index, description: competence.name};
            })

            setCompetences(_competences)
        }
    }, [curriculumData, competencesData, competenceIndicatorsData])

    useEffect(() => {
        if (toolsOptions.cursorMode === CursorMode.Replace)
            disableSettings()
        else
            enableSettings()
    }, [toolsOptions])

    const getAtom = useCallback((atomId: number): AtomDto | undefined => {
        return atomsList.find(atom => atom.id === atomId)
    }, [atomsList])

    const getAtoms = useCallback((atomId: number[]): AtomDto[] => {
        const atoms: AtomDto[] = [];
        atomsList.forEach(atom => {
            if (atomId.includes(atom.id)) atoms.push(atom)
        })
        return atoms
    }, [atomsList])

    const getModule = useCallback((moduleId: number): ModuleShortDto | undefined => {
        return modulesList.find(module => module.id === moduleId)
    }, [modulesList])

    const getIndex = useCallback((id: number): string | undefined => {
        if (!indexesData) return undefined;
        return indexesData.find(index => index.item1 === id)?.item2 || undefined
    }, [indexesData])

    const getValidationErrors = useCallback((id: string): ValidationError[] | undefined => {
        if (!validationErrorsData?.length) return undefined;
        const ids = splitIds(id).map(id => Number(getIdFromPrefix(id)));
        return validationErrorsData.filter(error => error.entities ? error.entities?.every(ent => ids.includes(ent?.id || 0)) : false)
    }, [validationErrorsData]);

    const onSelectAtom = (id: string | null) => {

        if ((id === null) || (id === selectedAtom)) {
            setSelectedAtom(null);
            setSidebarContent(undefined)
            return;
        }

        setSelectedAtom(id)
        setSidebarContent("atom", getIdFromPrefix(id))
    }

    const onSelectCompetence = (id: UniqueIdentifier | null) => {
        setSelectedCompetenceId(id);
    }

    function expandAtom(id: string, semesterNumber: number, direction: "prev" | "next") {
        const atomId = Number(getIdFromPrefix(id));
        const semesterId = semesters.find(semester => semester.number === semesterNumber)?.id;
        if (!semesterId) return;

        const newSemester: RefAtomSemesterDto = {
            semester: semesters.find(semester => semester.number === semesterNumber),
            credit: 0,
            attestations: [],
            academicActivityHours: []
        };

        setAtomsList(prev => prev.map(atom => atomId === atom.id
            ? {...atom, semesters: direction === "prev" ? [newSemester, ...atom.semesters] : [...atom.semesters, newSemester]} : atom
        ))

        expand({atomId: Number(getIdFromPrefix(id)), semesterId})
    }

    // Обновляет состояние предмета в локальном состоянии плана


    function updateAtom(
        id: string,
        paramKey: keyof AtomUpdateParams,
        param: AtomUpdateParams[typeof paramKey]
    ) {

        const atomId = Number(getIdFromPrefix(id));
        const semesterId = Number(getSemesterIdFromPrefix(id));

        const getAtomWithUpdatedParam = (atom: AtomDto): AtomDto => {
            const atomUpdated = structuredClone(atom);
            if (commonSubjectParamKeys.includes(paramKey as keyof UpdateAtomDto)) {
                atomUpdated[paramKey] = param;
            }
            else if (paramKey === "competenceIds" && curriculumData) {
                curriculumData.settings.competenceDistributionType === CompetenceDistributionType.Competence
                    ? atomUpdated.competenceIds = param as number[]
                    : atomUpdated.competenceIndicatorIds = param as number[]
            }
            else {
                const semester = atomUpdated.semesters.find(semester => semester.semester.id === semesterId);
                if (paramKey === "credit") semester.credit = param as number;
                else if (paramKey === "attestations") {
                    semester.attestations = (param as number[]).map(item =>
                        attestationTypesData
                            ? attestationTypesData.find(type => type.id === item)
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
                        const activity = academicActivityData ? academicActivityData.find(activity => activity.id === param.id) : undefined;
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
            return atomUpdated;
        };

        setAtomsList(prev => prev.map(atom => atomId === atom.id
            ? {...getAtomWithUpdatedParam(atom)} : atom
        ))

        const requestIds = {atomId, semesterId};

        const handlers: Record<string, () => void> = {
            credit: () => setCredits({ ...requestIds, dto: { credit: param as number } }),
            attestations: () => editAttestation({ ...requestIds, attestationIds: param as number[] }),
            academicHours: () => {
                param = param as {id: number, value: number | undefined};
                if (param.id && param.value === -1) {
                    deleteAcademicHours({
                        ...requestIds,
                        academicActivityId: param.id,
                        curriculumId
                    });
                } else {
                    editAcademicHours({
                        ...requestIds,
                        academicActivityId: param.id,
                        curriculumId,
                        createHoursDistribution: { value: param?.value ?? 0 }
                    });
                }
            },
            competenceIds: () => {
                if (curriculumData) {
                    if (curriculumData.settings.competenceDistributionType === CompetenceDistributionType.Competence)
                        editCompetence({...requestIds, setAtomCompetencesDto: {competenceIds: param as number[]}})
                    else
                        editIndicator({...requestIds, setAtomCompetenceIndicatorsDto: {competenceIndicatorIds: param as number[]}})
                }
            }
        };

        if (commonSubjectParamKeys.includes(paramKey as keyof UpdateAtomDto)) {
            editInfo({ subjectId: requestIds.atomId, data: { [paramKey]: param } });
        } else {
            handlers[paramKey]?.();
        }
    }

    // Обработка DnD

    function resetAllActiveIds() {
        setActiveItemId(null);
        setOverItemId(null);
    }

    function handleDragStart(event: DragStartEvent) {
        const {active} = event;
        const {id} = active;
        setActiveItemId(id);
    }

    function handleDragOver(event: DragOverEvent) {
        if (!event.over) return;
        const {id: overId} = event.over;
        setOverItemId(overId);
    }

    const handleDragCancel = (event: DragCancelEvent) => { }

    function arraysToDict(keys: string[], values: number[]): Record<string, number> {
        return keys.reduce((acc, key, index) => {
            acc[key] = values[index];
            return acc;
        }, {} as Record<string, number>);
    }

    const handleDragEnd = (event: DragEndEvent) => {
        if (!event.active?.id || !event.over?.id || event.active.id === event.over.id) return;

        const activeId = event.active?.id as string;
        const overId = event.over?.id as string;

        const atomId = Number(getIdFromPrefix(activeId));
        const activeSemesterId = Number(getSemesterIdFromPrefix(activeId));
        const activeParentModuleId = Number(getParentIdFromPrefix(activeId));
        const overSemesterId = Number(getSemesterIdFromPrefix(overId));
        const overParentModuleId = Number(getParentIdFromPrefix(overId));

        const atom = atomsList.find(atom => atom.id === atomId);

        if (!atom) return;

        const indexTargetSemester =  semesters.findIndex(semester => semester.id === overSemesterId);
        const indexInitialSemester =  atom.semesters.findIndex(semester => semester.semester.id === activeSemesterId);
        const newSubjectSemestersIndex = atom.semesters.map((_, index) => indexTargetSemester + index - indexInitialSemester)

        //Если предметы не помещаются по верхнему или нижнему пределу
        if (newSubjectSemestersIndex.includes(-1) || newSubjectSemestersIndex.includes(semesters.length)) {
            message.error("Невозможно переместить предметы в этот семестр")
            return atom;
        }

        let newAtomSemesters: SemesterDto[] = [];

        setAtomsList(prev => {
            return prev.map(atom => atom.id === atomId ? {
                ...atom,
                parentModuleId: overSemesterId === overParentModuleId ? null : overParentModuleId,
                semesters: atom.semesters.map((refSemester, index) => {
                    newAtomSemesters.push(semesters[newSubjectSemestersIndex[index]]);
                    return {
                        ...refSemester,
                        semester: semesters[newSubjectSemestersIndex[index]]
                    }
                })
            } : atom)
        })

        const concatModuleSemestersWithAtomSemesters = (moduleSemesters: RefModuleSemesterDto[]): RefModuleSemesterDto[] => {
            const mergedMap = new Map<number, SemesterDto>();

            if (moduleSemesters.length === 1 && moduleSemesters[0].semester.number === 0) {
                [...newAtomSemesters].forEach(semester => {
                    mergedMap.set(semester.number, semester);
                });
            }
            else {
                [...moduleSemesters.map(semester => semester.semester), ...newAtomSemesters].forEach(semester => {
                    mergedMap.set(semester.number, semester);
                });
            }

            const mergedArray = Array.from(mergedMap.values()).sort((a, b) => a.number - b.number);

            return mergedArray.map(semester => {
                return {
                    semester,
                    nonElective: moduleSemesters.find(sem => sem.semester.id === semester.id)?.nonElective || {
                        credit: 0, attestations: [], academicActivityHours: []
                    },
                    elective: moduleSemesters.find(sem => sem.semester.id === semester.id)?.elective || {
                        credit: 0, attestations: [], academicActivityHours: []
                    }
                }
            });
        }

        const removeAtomFromModules = (module: ModuleShortDto, atomId: number): ModuleShortDto => {

            const updatedSemesters = module.semesters
                .filter(moduleSemester => module.atoms.filter(moduleAtom => moduleAtom !== atomId)
                    .some(moduleAtom => {
                        const moduleAtomInfo = getAtom(moduleAtom);
                        if (!moduleAtomInfo) return false;
                        return !!moduleAtomInfo.semesters.find(atomSemester => atomSemester.semester.id === moduleSemester.semester.id)
                    })
                );

            if (!updatedSemesters.length) {
                updatedSemesters.push({
                    semester: semesters.find(semester => semester.id === module.parentSemesterId),
                    nonElective: {credit: 0, attestations: [], academicActivityHours: []},
                    elective: {credit: 0, attestations: [], academicActivityHours: []},
                })
            }

            return (
                {
                    ...module,
                    atoms: module.atoms.filter(moduleAtom => moduleAtom !== atomId),
                    semesters: [...updatedSemesters]
                }
            )
        }

        if ((activeParentModuleId !== overParentModuleId) && (activeSemesterId !== activeParentModuleId || overSemesterId !== overParentModuleId)) {
            setModulesList(prev => {
                return prev.map(module =>
                    module.id === activeParentModuleId ?
                        removeAtomFromModules(module, atomId) :
                        module.id === overParentModuleId ?
                            {
                                ...module,
                                atoms: [...module.atoms, atomId],
                                semesters: concatModuleSemestersWithAtomSemesters(module.semesters)
                            }
                        : module
                )
            })
        }

        editInfo({
            subjectId: atomId,
            data: {
                semesterIds: arraysToDict(
                    atom.semesters.map(semester => String(semester.semester.id)),
                    newSubjectSemestersIndex.map(index => semesters[index].id)
                ),
                parentModuleId: overSemesterId === overParentModuleId ? null : overParentModuleId
            }
        })

        resetAllActiveIds();
    }

    const value: PlanContextValue = {
        activeItemId,
        overItemId,
        semesters,
        competences,
        atomList: atomsList,
        modulesList: modulesList,
        semestersInfo: semestersData || [],
        displaySettings,
        toolsOptions,
        selectedAtom,
        validationErrors: validationErrorsData,
        attestationTypes: attestationTypesData,
        academicActivity: academicActivityData,
        loadingPlan: isLoading || semesters.length === 0,
        selectedCompetenceId,
        settings: curriculumData?.settings || {competenceDistributionType: CompetenceDistributionType.Competence},
        onSelectCompetence,
        getAtom,
        getAtoms,
        getModule,
        getIndex,
        getValidationErrors,
        onSelectSubject: onSelectAtom,
        setToolsOptions,
        setActiveSubject: setSelectedAtom,
        handleDragStart,
        handleDragOver,
        handleDragEnd,
        handleDragCancel,
        updateSubject: updateAtom,
        expandAtom,
        onChangeDisplaySetting,
        onSelectPreDisplaySetting
    }

    return (
        <PlanContext.Provider value={value}>
            {
                children
            }
        </PlanContext.Provider>
    )
}

export const usePlan = () => {
    return useContext(PlanContext);
}

interface PlanContextValue {
    activeItemId: UniqueIdentifier | null;
    overItemId: UniqueIdentifier | null;
    selectedAtom: string | null;
    selectedCompetenceId: UniqueIdentifier | null;

    semesters: SemesterDto[];
    atomList: AtomDto[];
    modulesList: ModuleShortDto[];

    competences: Dictionary<SubjectCompetence>;
    attestationTypes: AttestationDto[];
    academicActivity: AcademicActivityDto[];
    semestersInfo: RefModuleSemesterDto[];

    settings: CurriculumSettingsDto;
    displaySettings: DisplaySettings;
    toolsOptions: ToolsOptions;

    loadingPlan: boolean;
    validationErrors: ValidationError[];

    getAtom(atomId: number): AtomDto | undefined;

    getAtoms(atomIds: number[]): AtomDto[];

    getModule(moduleId: number): ModuleShortDto | undefined;

    getIndex(id: number): string | undefined;

    getValidationErrors(id: string): ValidationError[] | undefined;

    onSelectCompetence(id: number | null): void;

    onSelectSubject(id: string | null): void;

    setToolsOptions(options: ToolsOptions): void;

    setActiveSubject(subject: Subject | null): void;

    handleDragStart(event: DragStartEvent): void;

    handleDragOver(event: DragOverEvent): void;

    handleDragEnd(event: DragEndEvent): void;

    handleDragCancel(event: DragCancelEvent): void;

    onChangeDisplaySetting(key: keyof DisplaySettings): void;

    onSelectPreDisplaySetting(key: string): void;

    updateSubject<T extends keyof AtomUpdateParams>(id: UniqueIdentifier, paramKey: T, param: AtomUpdateParams[T]): void;

    expandAtom(id: string, semesterNumber: number, direction: "prev" | "next"): void;
}

const PlanContext = createContext<PlanContextValue>({
    activeItemId: null,
    overItemId: null,
    semestersInfo: [],
    competences: {},
    displaySettings: PreDisplaySettings[0].settings,
    toolsOptions: {
        cursorMode: CursorMode.Move,
        selectedCreateEntityType: "subjects"
    },
    academicActivity: [],
    semesters: [],
    selectedAtom: null,
    attestationTypes: [],
    loadingPlan: true,
    selectedCompetenceId: null,
    settings: {
        competenceDistributionType: CompetenceDistributionType.Competence,
    },
    atomList: [],
    modulesList: [],
    validationErrors: [],

    getAtom: (_id: number) => undefined,
    getAtoms: (_ids: number[]) => [],
    getModule: (_moduleId: number) => undefined,
    getIndex: (_id: number) => undefined,
    getValidationErrors: (_id: string) => undefined,
    onSelectCompetence: (_id: number | null) => { },
    onSelectSubject: (_id: string | null) => {
    },
    setToolsOptions: (_options: ToolsOptions) => {
    },
    setActiveSubject: (_subject: Subject | null) => {
    },
    handleDragStart: (_event: DragEndEvent) => {
    },
    handleDragOver: (_event: DragOverEvent) => {
    },
    handleDragEnd: (_event: DragEndEvent) => {
    },
    handleDragCancel: (_event: DragCancelEvent) => {
    },
    onChangeDisplaySetting: (_key: keyof DisplaySettings) => {
    },
    onSelectPreDisplaySetting: (_key: string) => {
    },
    updateSubject: (_id: UniqueIdentifier, paramKey: "name", _param: AtomUpdateParams) => {},

    expandAtom: (_id: string, _semesterNumber: number, _direction: "prev" | "next") => {}
})