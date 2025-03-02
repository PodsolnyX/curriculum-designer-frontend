import {createContext, ReactNode, useCallback, useContext, useEffect, useState} from "react";
import {DragCancelEvent, DragEndEvent, DragOverEvent, DragStartEvent, UniqueIdentifier} from "@dnd-kit/core";
import {
    CursorMode,
    DisplaySettings,
    PREFIX_ITEM_ID_KEYS,
    ToolsOptions,
} from "@/pages/planPage/provider/types.ts";
import {PreDisplaySettings} from "@/pages/planPage/provider/preDisplaySettings.ts";
import {
    commonSubjectParamKeys,
    Subject,
    SubjectCompetence,
    SubjectUpdateParams
} from "@/pages/planPage/types/Subject.ts";
import {
    AcademicActivityDto,
    AtomDto,
    AttestationDto,
    CompetenceDistributionType,
    CurriculumSettingsDto, ModuleDto, RefModuleSemesterDto, SemesterDto, UpdateAtomDto,
} from "@/api/axios-client.ts";
import {useDisplaySettings} from "@/pages/planPage/provider/useDisplaySettings.ts";
import {
    concatIds, cutAtomIdFromId,
    cutSemesterIdFromId,
    getIdFromPrefix, getParentIdFromPrefix, getParentPrefixFromPrefix,
    getPrefixFromId, getSemesterIdFromPrefix, regenerateId, setPrefixToId, splitIds
} from "@/pages/planPage/provider/prefixIdHelpers.ts";
import {useCurriculumData} from "@/pages/planPage/provider/useCurriculumData.ts";
import {useEditSubjectWithParams} from "@/pages/planPage/hooks/useEditSubject.ts";
import {App} from "antd";

export const PlanProvider = ({children}: { children: ReactNode }) => {

    const {message} = App.useApp();

    const [semesters, setSemesters] = useState<SemesterDto[]>([]);
    const [atomsList, setAtomsList] = useState<AtomDto[]>([]);
    const [modulesList, setModulesList] = useState<ModuleDto[]>([]);
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
        deleteAcademicHours
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
        isLoading
    } = useCurriculumData({modulesPlainList: false});

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
            // setSemesters(parseCurriculum({
            //     semesters: curriculumData.semesters,
            //     atoms: atomsData,
            //     modules: modulesData,
            //     competences: competences
            // }))
        }
    }, [curriculumData])

    useEffect(() => {
        if (atomsData) setAtomsList(atomsData)
        if (modulesData) setModulesList(modulesData)
    }, [modulesData, atomsData])

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


    // Выбор предмета

    const getAtom = useCallback((atomId: number): AtomDto | undefined => {
        return atomsList.find(atom => atom.id === atomId)
    }, [atomsList])

    const onSelectSubject = (id: string | null) => {

        if ((id === null) || (id === selectedAtom)) {
            setSelectedAtom(null);
            return;
        }

        setSelectedAtom(id)
    }

    const onSelectCompetence = (id: UniqueIdentifier | null) => {
        setSelectedCompetenceId(id);
    }

    // Возвращает список id родителей по id текущего элемента

    const getParentsIdsByChildId = (id: UniqueIdentifier): UniqueIdentifier[] => {

        let parentIds: (UniqueIdentifier)[] = [];

        const checkKeys = (obj: any) => {
            return PREFIX_ITEM_ID_KEYS.some(key => Object.keys(obj).includes(key));
        }

        const findParentIdActiveItem = (item: any): boolean => {
            for (let key of PREFIX_ITEM_ID_KEYS) {
                if (Array.isArray(item[key])) {
                    if (item[key].find(item => item.id === id)) {
                        parentIds.unshift(id);
                        item.id && parentIds.unshift(item.id);
                        return true;
                    } else {
                        for (let subItem of item[key]) {
                            if (checkKeys(subItem) && findParentIdActiveItem(subItem)) {
                                item.id && parentIds.unshift(item.id);
                                return true;
                            }
                        }
                    }
                }
            }
            return false;
        };

        findParentIdActiveItem({semesters})
        return parentIds;
    }

    // Обновляет состояние предмета в локальном состоянии плана

    function updateSubject(
        id: UniqueIdentifier,
        paramKey: keyof SubjectUpdateParams,
        param: SubjectUpdateParams[typeof paramKey]
    ) {
        const parentsIdsActive = splitIds(id as string);
        const updateSemesters = structuredClone(semesters);

        const getLocalParams = (subject: Subject) => {
            if (paramKey === "attestation") {
                return (param as number[]).map(item =>
                    attestationTypesData ? attestationTypesData.find(type => type.id === item) : { id: item }
                );
            }
            if (paramKey === "academicHours") {
                if (param?.id && param.value === -1) {
                    return subject.academicHours ? subject.academicHours?.filter(hour => hour.academicActivity.id !== param.id) : [];
                }
                if (param?.id && param?.value) {
                    return subject.academicHours?.map(hour =>
                        hour.academicActivity.id === param.id ? { ...hour, value: param.value } : hour
                    );
                }
                return [
                    ...(subject.academicHours || []),
                    {
                        academicActivity: academicActivityData ? academicActivityData.find(activity => activity.id === param) : { id: param },
                        value: 0
                    }
                ];
            }
            return param;
        };

        const findSubjectAndUpdate = (item: any, currentDeep: number) => {
            const type = getPrefixFromId(parentsIdsActive[currentDeep]);
            if (type === "subjects") {
                item.subjects = item.subjects.map((subject: Subject) =>
                    subject.id !== id ? subject : { ...subject, [paramKey]: getLocalParams(subject) }
                );
            } else {
                const subItem = item[type].find((_item: any) => _item.id === parentsIdsActive[currentDeep]);
                if (subItem) findSubjectAndUpdate(subItem, currentDeep + 1);
            }
        };

        findSubjectAndUpdate({ semesters: updateSemesters }, 0);
        setSemesters(structuredClone(updateSemesters));

        const requestIds = {
            atomId: Number(getIdFromPrefix(id as string)),
            semesterId: Number(getIdFromPrefix(parentsIdsActive[0]))
        };

        const handlers: Record<string, () => void> = {
            credits: () => setCredits({ ...requestIds, dto: { credit: param as number } }),
            attestation: () => editAttestation({ ...requestIds, attestationIds: param as number[] }),
            academicHours: () => {
                if (param?.id && param?.value === -1) {
                    deleteAcademicHours({
                        ...requestIds,
                        academicActivityId: param.id as number,
                        curriculumId
                    });
                } else {
                    editAcademicHours({
                        ...requestIds,
                        academicActivityId: (param?.id as number) ?? (param as number),
                        curriculumId,
                        createHoursDistribution: { value: param?.value ?? 0 }
                    });
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

    const handleDragCancel = (event: DragCancelEvent) => {

    }

    function arraysToDict(keys: string[], values: number[]): Record<string, number> {
        return keys.reduce((acc, key, index) => {
            acc[key] = values[index];
            return acc;
        }, {} as Record<string, number>);
    }

    const handleDragEnd = (event: DragEndEvent) => {
        if (!event.active?.id || !event.over?.id || event.active.id === event.over.id) {
            return;
        }

        const activeId = event.active?.id as string;
        const overId = event.over?.id as string;

        const updateSemesters = structuredClone(semesters);
        const updateModulesList = structuredClone(modulesList);
        let activeSubject: any;

        const removeSubjectFromParents = (item: any, currentDeep: number, parentsIds: string[]) => {
            const type = getPrefixFromId(parentsIds[currentDeep]);
            if (type === "subjects")
                item.subjects = item.subjects.filter((item: any) => {
                    if (item.id !== parentsIds[currentDeep]) return true
                    else {
                        activeSubject = item;
                        return false;
                    }
                })
            else {
                if (!item[type]) console.log(item, parentsIds[currentDeep], parentsIds)
                const subItem = item[type].find((_item: any) => _item.id === parentsIds[currentDeep])
                removeSubjectFromParents(subItem, currentDeep + 1, parentsIds);
            }
        }

        const addSemesterModule = (item: any, currentDeep: number, parentsIds: string[]): any => {

            if (!semestersData) return;

            const newItem = { id: parentsIds[currentDeep], subjects: [], semesterId: parentsIds[0] };

            item[getPrefixFromId(parentsIds[currentDeep])] = [
                ...item[getPrefixFromId(parentsIds[currentDeep])], newItem
            ]

            const moduleInList = updateModulesList.find(module => module.id === Number(getIdFromPrefix(parentsIds[currentDeep])));
            const newSemester: RefModuleSemesterDto = {
                semester: {
                    ...semestersData.find(semester =>
                        semester.semester.id === Number(getIdFromPrefix(parentsIds[0]))
                    ).semester
                },
                elective: {
                    credit: 0,
                    attestations: [],
                    academicActivityHours: []
                },
                nonElective: {
                    credit: 0,
                    attestations: [],
                    academicActivityHours: []
                }
            };

            const insertIndex = moduleInList.semesters.findIndex(semester => semester.semester.number > newSemester.semester.number);

            if (insertIndex === -1) moduleInList.semesters.push(newSemester);
            else moduleInList.semesters.splice(insertIndex, 0, newSemester);

            return newItem;
        }

        const addSubjectToNewParents = (item: any, currentDeep: number, parentsIds: string[]) => {
            const type = getPrefixFromId(parentsIds[currentDeep]);

            if (!type && currentDeep === parentsIds.length) {
                item.subjects = [...item.subjects, {...activeSubject, id: regenerateId(activeSubject.id, parentsIds.at(-1))}]
            } else if (type === "subjects") {
                item.subjects.splice(item.subjects.findIndex((_item: any) => _item.id === parentsIds[currentDeep]), 0,
                    {...activeSubject, id: regenerateId(activeSubject.id, parentsIds.at(-1))})
            } else {
                let subItem = item[type].find((_item: any) => _item.id === parentsIds[currentDeep]);
                if (!subItem) {
                    subItem = addSemesterModule(item, currentDeep, parentsIds);
                }
                addSubjectToNewParents(subItem, currentDeep + 1, parentsIds);
            }
        }

        const moveSubject = (activeId: string, overId: string) => {
            removeSubjectFromParents({semesters: updateSemesters}, 0, splitIds(activeId))
            addSubjectToNewParents({semesters: updateSemesters}, 0, splitIds(overId))
        }

        const findSubjectsInAnotherEntities = () => {
            const ids: string[] = [];
            let indexOfActiveSubject = 0;
            if (!atomsData) return ids;

            atomsList
                .find(atom => String(atom.id) === getIdFromPrefix(activeId)).semesters
                .forEach(semester => {
                    const subjectId = concatIds(setPrefixToId(semester.semester.id, "semesters"), cutSemesterIdFromId(activeId));
                    if (subjectId === activeId) indexOfActiveSubject = ids.length;
                    ids.push(subjectId)
                })

            return [indexOfActiveSubject, ids];
        }

        const [indexOfActiveSubject, initialSubjectSemestersIds] = findSubjectsInAnotherEntities();

        const moveSubjects = () => {
            if (!initialSubjectSemestersIds.length) return;

            const initialContainerId = getSemesterIdFromPrefix(activeId);
            const targetContainerId = getSemesterIdFromPrefix(overId);

            // Если перемещаем в семестры
            if (semestersData) {
                const indexTargetSemester =  semestersData.findIndex(semester => String(semester.semester.id) === targetContainerId);
                const indexInitialSemester =  semestersData.findIndex(semester => String(semester.semester.id) === initialContainerId);
                const newSubjectSemestersIndex = initialSubjectSemestersIds.map((_, index) => indexTargetSemester + index - indexOfActiveSubject)

                //Если предметы не помещаются по верхнему или нижнему пределу
                if (newSubjectSemestersIndex.includes(-1) || newSubjectSemestersIndex.includes(semestersData.length)) {
                    message.error("Невозможно переместить предметы в этот семестр")
                    return;
                }

                const targetParentIdPart = cutSemesterIdFromId(cutAtomIdFromId(overId));

                const idsNewSemesters = newSubjectSemestersIndex.map(index => {
                    const _semesterId = setPrefixToId(semestersData[index].semester.id, "semesters");
                    if (targetParentIdPart.length) return concatIds(_semesterId, targetParentIdPart);
                    return _semesterId;
                });

                const shouldReverse = indexInitialSemester < indexTargetSemester;
                const initialIds = shouldReverse ? [...initialSubjectSemestersIds].reverse() : initialSubjectSemestersIds;
                const targetIds = shouldReverse ? [...idsNewSemesters].reverse() : idsNewSemesters;

                //Перемещаем предметы в новые места

                initialIds.forEach((id, index) => moveSubject(id, targetIds[index]));

                //Обновляем состояние списка предметов

                setAtomsList(atomsList.map(atom => atom.id === Number(getIdFromPrefix(activeId))
                    ? {
                    ...atom,
                        semesters: atom.semesters.map((refSemester, index) => {
                            return {
                                ...refSemester,
                                semester: {...refSemester.semester, id: semestersData[newSubjectSemestersIndex[index]].semester.id, number: semestersData[newSubjectSemestersIndex[index]].semester.number}
                            }
                        })
                    }
                    : atom
                ))

                //Сохраняем на сервере
                editInfo({
                    subjectId: Number(getIdFromPrefix(activeId)),
                    data: {
                        semesterIds: arraysToDict(
                            initialSubjectSemestersIds.map(id => getIdFromPrefix(id.split("_")[0])),
                            newSubjectSemestersIndex.map(index => semestersData[index].semester.id)
                        ),
                        parentModuleId: ["modules", "selections"].includes(getParentPrefixFromPrefix(overId)) ? Number(getParentIdFromPrefix(overId)) : null
                    }
                })
            }
        }

        moveSubjects();
        setSemesters(updateSemesters);
        setModulesList(updateModulesList);
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
        attestationTypes: attestationTypesData,
        academicActivity: academicActivityData,
        loadingPlan: isLoading || semesters.length === 0,
        selectedCompetenceId,
        settings: curriculumData?.settings || {competenceDistributionType: CompetenceDistributionType.Competence},
        onSelectCompetence,
        getAtom,
        onSelectSubject,
        setToolsOptions,
        setActiveSubject: setSelectedAtom,
        handleDragStart,
        handleDragOver,
        handleDragEnd,
        handleDragCancel,
        updateSubject,
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
    modulesList: ModuleDto[];

    competences: Dictionary<SubjectCompetence>;
    attestationTypes: AttestationDto[];
    academicActivity: AcademicActivityDto[];
    semestersInfo: RefModuleSemesterDto[];

    settings: CurriculumSettingsDto;
    displaySettings: DisplaySettings;
    toolsOptions: ToolsOptions;

    loadingPlan: boolean;

    getAtom(atomId: number): AtomDto | undefined;

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

    updateSubject<T extends keyof SubjectUpdateParams>(id: UniqueIdentifier, paramKey: T, param: SubjectUpdateParams[T]): void;
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

    getAtom: (_id: number) => undefined,
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
    updateSubject: (_id: UniqueIdentifier, paramKey: "name", _param: SubjectUpdateParams) => {}
})