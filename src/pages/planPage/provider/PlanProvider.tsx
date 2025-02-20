import {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {DragCancelEvent, DragEndEvent, DragOverEvent, DragStartEvent, UniqueIdentifier} from "@dnd-kit/core";
import {Semester} from "@/pages/planPage/types/Semester.ts";
import {
    CursorMode,
    DisplaySettings,
    ModulePosition,
    ModuleSemestersInfo,
    PREFIX_ITEM_ID_KEYS,
    ToolsOptions,
    TrackSelectionSemestersInfo
} from "@/pages/planPage/provider/types.ts";
import {PreDisplaySettings} from "@/pages/planPage/provider/preDisplaySettings.ts";
import {commonSubjectParamKeys, Subject, SubjectUpdateParams} from "@/pages/planPage/types/Subject.ts";
import {
    AcademicActivityDto,
    AtomDto,
    AttestationDto,
    CompetenceDistributionType,
    CurriculumSettingsDto, RefModuleSemesterDto, UpdateAtomDto,
} from "@/api/axios-client.ts";
import {useDisplaySettings} from "@/pages/planPage/provider/useDisplaySettings.ts";
import {
    concatIds,
    cutSemesterIdFromId,
    getIdFromPrefix, getParentIdFromPrefix, getParentPrefixFromPrefix,
    getPrefixFromId,
    parseAtomToSubject,
    parseCurriculum, regenerateId, setPrefixToId, splitIds
} from "@/pages/planPage/provider/parseCurriculum.ts";
import {useCurriculumData} from "@/pages/planPage/provider/useCurriculumData.ts";
import {useModulesPosition} from "@/pages/planPage/provider/useModulesPosition.ts";
import {useEditSubjectWithParams} from "@/pages/planPage/hooks/useEditSubject.ts";
import {App} from "antd";

export const PlanProvider = ({children}: { children: ReactNode }) => {

    const {message} = App.useApp();

    const [semesters, setSemesters] = useState<Semester[]>([]);
    const [atomsList, setAtomsList] = useState<AtomDto[]>([]);

    const [activeItemId, setActiveItemId] = useState<UniqueIdentifier | null>(null);
    const [activeSubject, setActiveSubject] = useState<Subject | null>(null);
    const [selectedSubjectId, setSelectedSubjectId] = useState<UniqueIdentifier | null>(null);
    const [overItemId, setOverItemId] = useState<UniqueIdentifier | null>(null);
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
        isLoading
    } = useCurriculumData({});

    const {
        modulesSemesters,
        selectionsSemesters,
        tracksSelectionSemesters,
        getModulePosition,
        getSelectionPosition,
        getTrackSelectionPosition
    } = useModulesPosition();

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
        if (atomsData) setAtomsList(atomsData)
        if (curriculumData?.semesters.length && modulesData && atomsData) {
            setSemesters(parseCurriculum({
                semesters: curriculumData.semesters,
                atoms: atomsData,
                modules: modulesData,
                competences: competencesData
            }))
        }
    }, [curriculumData, modulesData, atomsData])

    useEffect(() => {
        if (toolsOptions.cursorMode === CursorMode.Replace)
            disableSettings()
        else
            enableSettings()
    }, [toolsOptions])


    // Выбор предмета

    const onSelectSubject = (id: UniqueIdentifier | null, semesterOrder?: number) => {

        if (String(selectedSubjectId) === String(id)) {
            setSelectedSubjectId(null);
            setActiveSubject(null);
            return;
        }

        setSelectedSubjectId(id);

        const atom = atomsData ? (atomsData.find(atom => String(atom.id) === String(id)) || null) : null;

        if (atom === null) return;

        const semester = atom.semesters[0];

        setActiveSubject(parseAtomToSubject(atom, semester.semester.id, competencesData))
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
                const subItem = item[type].find((_item: any) => _item.id === parentsIds[currentDeep])
                removeSubjectFromParents(subItem, currentDeep + 1, parentsIds);
            }
        }

        const addSubjectToNewParents = (item: any, currentDeep: number, parentsIds: string[]) => {
            const type = getPrefixFromId(parentsIds[currentDeep]);

            if (!type && currentDeep === parentsIds.length) {
                item.subjects = [...item.subjects, {...activeSubject, id: regenerateId(activeSubject.id, parentsIds.join("_"))}]
            } else if (type === "subjects") {
                item.subjects.splice(item.subjects.findIndex((_item: any) => _item.id === parentsIds[currentDeep]), 0,
                    {...activeSubject, id: regenerateId(activeSubject.id, parentsIds.join("_"))})
            } else {
                const subItem = item[type].find((_item: any) => _item.id === parentsIds[currentDeep]);
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

            const initialContainerId = getParentIdFromPrefix(activeId);
            const targetContainerId = getParentIdFromPrefix(overId);

            // Если перемещаем в семестры
            if (getParentPrefixFromPrefix(overId) === "semesters" && semestersData) {
                const indexTargetSemester =  semestersData.findIndex(semester => String(semester.semester.id) === targetContainerId);
                const indexInitialSemester =  semestersData.findIndex(semester => String(semester.semester.id) === initialContainerId);
                const newSubjectSemestersIndex = initialSubjectSemestersIds.map((_, index) => indexTargetSemester + index - indexOfActiveSubject)

                //Если предметы не помещаются по верхнему или нижнему пределу
                if (newSubjectSemestersIndex.includes(-1) || newSubjectSemestersIndex.includes(semestersData.length)) {
                    message.error("Невозможно переместить предметы в этот семестр")
                    return;
                }

                const idsNewSemesters = newSubjectSemestersIndex.map(index => setPrefixToId(semestersData[index].semester.id, "semesters"));

                // Если сверху вниз перемещаем
                if (indexInitialSemester < indexTargetSemester) {
                    initialSubjectSemestersIds.slice().reverse().forEach((id, index) => {
                        moveSubject(id, idsNewSemesters.slice().reverse()[index])
                    })
                }
                // Если снизу вверх перемещаем
                else if (indexInitialSemester > indexTargetSemester) {
                    initialSubjectSemestersIds.forEach((id, index) =>
                        moveSubject(id, idsNewSemesters[index]))
                }

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

                // Сохраняем на сервере
                editInfo({
                    subjectId: Number(getIdFromPrefix(activeId)),
                    data: {
                        semesterIds: arraysToDict(
                            initialSubjectSemestersIds.map(id => getIdFromPrefix(id.split("_")[0])),
                            newSubjectSemestersIndex.map(index => semestersData[index].semester.id)
                        ),
                        parentModuleId: null
                        // parentModuleId: ["modules", "selections"].includes(getPrefixFromId(parentsIdsOver[1])) ? Number(getIdFromPrefix(parentsIdsOver[1])) : null
                    }
                })
            }
        }

        moveSubjects();
        setSemesters(updateSemesters);
        resetAllActiveIds();
    }

    const value: PlanContextValue = {
        activeItemId,
        activeSubject,
        overItemId,
        semesters,
        modulesSemesters,
        selectionsSemesters,
        semestersInfo: semestersData || [],
        tracksSelectionSemesters,
        displaySettings,
        toolsOptions,
        selectedSubject: atomsData?.find(atom => String(atom.id) === selectedSubjectId) || null,
        attestationTypes: attestationTypesData,
        academicActivity: academicActivityData,
        loadingPlan: isLoading || semesters.length === 0,
        selectedCompetenceId,
        settings: curriculumData?.settings || {competenceDistributionType: CompetenceDistributionType.Competence},
        onSelectCompetence,
        onSelectSubject,
        setToolsOptions,
        setActiveSubject,
        handleDragStart,
        handleDragOver,
        handleDragEnd,
        handleDragCancel,
        updateSubject,
        getModuleSemesterPosition: getModulePosition,
        getSelectionPosition: getSelectionPosition,
        getTrackSemesterPosition: getTrackSelectionPosition,
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
    activeSubject: Subject | null;
    overItemId: UniqueIdentifier | null;
    displaySettings: DisplaySettings;
    toolsOptions: ToolsOptions;
    semestersInfo: RefModuleSemesterDto[];
    semesters: Semester[];
    attestationTypes: AttestationDto[];
    academicActivity: AcademicActivityDto[];
    modulesSemesters: ModulePosition[];
    selectionsSemesters: ModulePosition[];
    tracksSelectionSemesters: ModulePosition[];
    selectedSubject: AtomDto | null;
    loadingPlan: boolean;
    selectedCompetenceId: UniqueIdentifier | null;
    settings: CurriculumSettingsDto;

    onSelectCompetence(id: number | null): void;

    onSelectSubject(id: UniqueIdentifier | null, semesterOrder?: number): void;

    setToolsOptions(options: ToolsOptions): void;

    setActiveSubject(subject: Subject | null): void;

    handleDragStart(event: DragStartEvent): void;

    handleDragOver(event: DragOverEvent): void;

    handleDragEnd(event: DragEndEvent): void;

    handleDragCancel(event: DragCancelEvent): void;

    getModuleSemesterPosition(id: UniqueIdentifier): ModuleSemestersInfo;

    getSelectionPosition(id: UniqueIdentifier): ModuleSemestersInfo;

    getTrackSemesterPosition(id: UniqueIdentifier): TrackSelectionSemestersInfo;

    onChangeDisplaySetting(key: keyof DisplaySettings): void;

    onSelectPreDisplaySetting(key: string): void;

    updateSubject<T extends keyof SubjectUpdateParams>(id: UniqueIdentifier, paramKey: T, param: SubjectUpdateParams[T]): void;
}

const PlanContext = createContext<PlanContextValue>({
    activeItemId: null,
    activeSubject: null,
    overItemId: null,
    semestersInfo: [],
    displaySettings: PreDisplaySettings[0].settings,
    toolsOptions: {
        cursorMode: CursorMode.Move,
        selectedCreateEntityType: "subjects"
    },
    academicActivity: [],
    semesters: [],
    modulesSemesters: [],
    selectionsSemesters: [],
    tracksSelectionSemesters: [],
    selectedSubject: null,
    attestationTypes: [],
    loadingPlan: true,
    selectedCompetenceId: null,
    settings: {
        competenceDistributionType: CompetenceDistributionType.Competence,
    },

    onSelectCompetence: (_id: number | null) => { },
    onSelectSubject: (_id: number | null, semesterOrder?: number) => {
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
    getModuleSemesterPosition: (_id: UniqueIdentifier) => {
        return {position: "single", countSemesters: 0}
    },
    getSelectionPosition: (_id: UniqueIdentifier) => {
        return {position: "single", countSemesters: 0}
    },
    getTrackSemesterPosition: (_id: UniqueIdentifier) => {
        return {position: "single", countSemesters: 0, semesterNumber: 0}
    },
    onChangeDisplaySetting: (_key: keyof DisplaySettings) => {
    },
    onSelectPreDisplaySetting: (_key: string) => {
    },
    updateSubject: (_id: UniqueIdentifier, paramKey: "name", _param: SubjectUpdateParams) => {}
})

// Добавление префиксов для контейнеров

// const addPrefixesForItems = (semesters: Semester[]) => {
//
//     let modules: ModuleSemesters[] = [];
//     let tracks: TrackSemesters[] = [];
//
//     const addPrefixes = (item: any, key: typeof PREFIX_ITEM_ID_KEYS[number]) => {
//
//         let children = {};
//
//         for (let _key of PREFIX_ITEM_ID_KEYS.filter(key => key !== "subjects")) {
//             if (Array.isArray(item[_key])) {
//                 children[_key] = item[_key].map(subItem => {
//                     if (_key === "modules" || _key === "tracks") {
//                         return addPrefixes({...subItem, id: getPrefixId(`${item.id}-${subItem.id}`, key)}, _key)
//                     }
//                     return addPrefixes(subItem, _key)
//                 })
//             }
//         }
//
//         if (key === "tracks") {
//             if (tracks.find(track => track.id === getItemIdFromPrefix(item.id))) {
//                 tracks = tracks.map(track => track.id !== getItemIdFromPrefix(item.id) ? track : {
//                     ...track,
//                     semesters: [...track.semesters, getPrefixId(item.id, key)]
//                 })
//             } else {
//                 tracks.push({
//                     id: getItemIdFromPrefix(item.id),
//                     name: item.name,
//                     color: item.color || "#000000",
//                     semesters: [getPrefixId(item.id, key)]
//                 })
//             }
//         }
//
//         if (key === "modules") {
//             if (modules.find(module => module.id === getItemIdFromPrefix(item.id))) {
//                 modules = modules.map(module => module.id !== getItemIdFromPrefix(item.id) ? module : {
//                     ...module,
//                     semesters: [...module.semesters, getPrefixId(item.id, key)]
//                 })
//             } else {
//                 modules.push({
//                     id: getItemIdFromPrefix(item.id),
//                     name: item.name,
//                     semesters: [getPrefixId(item.id, key)]
//                 })
//             }
//         }
//
//
//         return {
//             ...item,
//             id: getPrefixId(item.id, key),
//             ...children
//         }
//     }
//
//     const _semesters = addPrefixes({semesters: semesters}, "semesters").semesters;
//
//     setModulesSemesters([...modules]);
//     setTracksSemesters([...tracks]);
//
//     return _semesters;
// }

// Поиск предметов длящихся в других семестрах
// const findSubjectsInAnotherEntities = (): string[] => {
//     const ids: string[] = [];
//
//     const deepFindSearch = (item: any, currentDeep: number) => {
//         if (!item) return;
//         if (currentDeep === parentsIdsActive.length - 1) {
//             const foundId = item.subjects.find(item =>
//                 cutSemesterIdFromId(item.id as string) === cutSemesterIdFromId(activeId))?.id;
//             if (foundId) ids.push(foundId as string);
//         }
//         else {
//             console.log(getPrefixFromId(parentsIdsActive[currentDeep]))
//             deepFindSearch(item[getPrefixFromId(parentsIdsActive[currentDeep])].find(_item =>
//                 cutSemesterIdFromId(_item.id as string) === cutSemesterIdFromId(parentsIdsActive[currentDeep])), currentDeep + 1);
//         }
//     }
//
//     semesters.forEach(semester => deepFindSearch(semester, 1))
//
//     return ids;
// }