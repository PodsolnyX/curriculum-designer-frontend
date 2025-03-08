import {createContext, ReactNode, useCallback, useContext, useEffect, useState} from "react";
import {DragCancelEvent, DragEndEvent, DragOverEvent, DragStartEvent, UniqueIdentifier} from "@dnd-kit/core";
import {
    CursorMode,
    DisplaySettings,
    ToolsOptions,
} from "@/pages/planPage/provider/types.ts";
import {
    Subject,
} from "@/pages/planPage/types/Subject.ts";
import {
    AtomDto,
    ModuleDto, RefAtomSemesterDto,
    RefModuleSemesterDto,
    SemesterDto,
    ValidationError,
} from "@/api/axios-client.ts";
import {useDisplaySettings} from "@/pages/planPage/provider/useDisplaySettings.ts";
import {
    getIdFromPrefix, getParentIdFromPrefix, getSemesterIdFromPrefix, splitIds
} from "@/pages/planPage/provider/prefixIdHelpers.ts";
import {useCurriculumData} from "@/pages/planPage/provider/useCurriculumData.ts";
import {useEditSubjectWithParams} from "@/pages/planPage/hooks/useEditSubject.ts";
import {App} from "antd";

export interface ModuleShortDto extends Omit<ModuleDto, "atoms" | "modules"> {
    atoms: number[];
    modules: number[];
}

export const PlanProvider = ({children}: { children: ReactNode }) => {

    const {message} = App.useApp();

    const [semesters, setSemesters] = useState<SemesterDto[]>([]);
    const [atomsList, setAtomsList] = useState<AtomDto[]>([]);
    const [modulesList, setModulesList] = useState<ModuleShortDto[]>([]);

    const [activeItemId, setActiveItemId] = useState<UniqueIdentifier | null>(null);
    const [overItemId, setOverItemId] = useState<UniqueIdentifier | null>(null);

    const [selectedAtom, setSelectedAtom] = useState<string | null>(null);

    const {
        editInfo,
        expand
    } = useEditSubjectWithParams();

    const {
        indexesData,
        validationErrorsData
    } = useCurriculumData({modulesPlainList: true});

    const [toolsOptions, setToolsOptions] = useState<ToolsOptions>({
        cursorMode: CursorMode.Move,
        selectedCreateEntityType: "subjects"
    });

    const {
        disableSettings,
        enableSettings,
        onChangeDisplaySetting,
        onSelectPreDisplaySetting
    } = useDisplaySettings();

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
            // setSidebarContent(undefined)
            return;
        }

        setSelectedAtom(id)
        // setSidebarContent("atom", getIdFromPrefix(id))
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

    getAtom(atomId: number): AtomDto | undefined;

    getAtoms(atomIds: number[]): AtomDto[];

    getModule(moduleId: number): ModuleShortDto | undefined;

    getIndex(id: number): string | undefined;

    getValidationErrors(id: string): ValidationError[] | undefined;

    onSelectSubject(id: string | null): void;

    setToolsOptions(options: ToolsOptions): void;

    setActiveSubject(subject: Subject | null): void;

    handleDragStart(event: DragStartEvent): void;

    handleDragOver(event: DragOverEvent): void;

    handleDragEnd(event: DragEndEvent): void;

    handleDragCancel(event: DragCancelEvent): void;

    onChangeDisplaySetting(key: keyof DisplaySettings): void;

    onSelectPreDisplaySetting(key: string): void;

    expandAtom(id: string, semesterNumber: number, direction: "prev" | "next"): void;
}

const PlanContext = createContext<PlanContextValue>({
    activeItemId: null,
    overItemId: null,

    getAtom: (_id: number) => undefined,
    getAtoms: (_ids: number[]) => [],
    getModule: (_moduleId: number) => undefined,
    getIndex: (_id: number) => undefined,
    getValidationErrors: (_id: string) => undefined,
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

    expandAtom: (_id: string, _semesterNumber: number, _direction: "prev" | "next") => {}
})