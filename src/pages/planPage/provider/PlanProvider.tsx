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
import {Subject, SubjectUpdateParams} from "@/pages/planPage/types/Subject.ts";
import {
    AcademicActivityDto,
    AtomDto,
    AttestationDto,
    CompetenceDistributionType,
    CurriculumSettingsDto, RefModuleSemesterDto,
} from "@/api/axios-client.ts";
import {useDisplaySettings} from "@/pages/planPage/provider/useDisplaySettings.ts";
import {
    getIdFromPrefix,
    getPrefixFromId,
    parseAtomToSubject,
    parseCurriculum
} from "@/pages/planPage/provider/parseCurriculum.ts";
import {useCurriculumData} from "@/pages/planPage/provider/useCurriculumData.ts";
import {useModulesPosition} from "@/pages/planPage/provider/useModulesPosition.ts";
import {useEditSubjectWithParams} from "@/pages/planPage/hooks/useEditSubject.ts";

export const PlanProvider = ({children}: { children: ReactNode }) => {

    const [semesters, setSemesters] = useState<Semester[]>([]);

    const [activeItemId, setActiveItemId] = useState<UniqueIdentifier | null>(null);
    const [activeSubject, setActiveSubject] = useState<Subject | null>(null);
    const [selectedSubjectId, setSelectedSubjectId] = useState<UniqueIdentifier | null>(null);
    const [overItemId, setOverItemId] = useState<UniqueIdentifier | null>(null);
    const [selectedCompetenceId, setSelectedCompetenceId] = useState<UniqueIdentifier | null>(null);

    const editSubject = useEditSubjectWithParams();

    const {
        curriculumData,
        semestersData,
        atomsData,
        modulesData,
        attestationTypesData,
        academicActivityData,
        isLoading
    } = useCurriculumData();

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
        if (curriculumData?.semesters.length && modulesData && atomsData) {
            setSemesters(parseCurriculum(curriculumData.semesters, atomsData, modulesData))
        }
    }, [curriculumData, modulesData, atomsData])

    useEffect(() => {
        if (toolsOptions.cursorMode === CursorMode.Replace)
            disableSettings()
        else
            enableSettings()
    }, [toolsOptions])

    console.log(semesters)

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

        setActiveSubject(parseAtomToSubject(atom, semester.semester.id))
    }

    const onSelectCompetence = (id: UniqueIdentifier | null) => {
        setSelectedCompetenceId(id);
    }

    // Обработка DnD

    function resetAllActiveIds() {
        setActiveItemId(null);
        setOverItemId(null);
    }

    const updateSubject = (id: UniqueIdentifier, params: SubjectUpdateParams) => {
        const parentsIdsActive = getParentsIdsByChildId(id);
        console.log(parentsIdsActive);

        const updateSemesters = JSON.parse(JSON.stringify(semesters));

        const findSubjectAndUpdate = (item: any, currentDeep: number) => {
            const type = getPrefixFromId(parentsIdsActive[currentDeep]);

            if (!type && currentDeep === parentsIdsActive.length) {
                item.subjects = item.subjects.map(subject => subject.id !== id ? subject : {...subject, ...params})
            }
            else if (!type) {
                item.subjects = item.subjects.map(subject => subject.id !== id ? subject : {...subject, ...params})
                console.log(item.subjects)
            }
            else {
                console.log(4444, type, item, currentDeep)
                const subItem = item[type].find((_item: any) => _item.id === parentsIdsActive[currentDeep])
                findSubjectAndUpdate(subItem, currentDeep + 1);
            }
        }

        findSubjectAndUpdate({semesters: updateSemesters}, 0)
        setSemesters(JSON.parse(JSON.stringify(updateSemesters)))

    }

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

    const handleDragEnd = (event: DragEndEvent) => {
        if (!event.active?.id || !event?.over?.id || event.active.id === event.over.id) {
            return;
        }

        const parentsIdsActive = getParentsIdsByChildId(event.active.id);
        const parentsIdsOver = getParentsIdsByChildId(event.over.id);

        const updateSemesters = JSON.parse(JSON.stringify(semesters));

        let activeSubject: any;

        const removeSubjectFromParents = (item: any, currentDeep: number) => {
            const type = getPrefixFromId(parentsIdsActive[currentDeep]);
            if (!type)
                item.subjects = item.subjects.filter((item: any) => {
                    if (item.id !== parentsIdsActive[currentDeep]) return true
                    else {
                        activeSubject = item;
                        return false;
                    }
                })
            else {
                const subItem = item[type].find((_item: any) => _item.id === parentsIdsActive[currentDeep])
                removeSubjectFromParents(subItem, currentDeep + 1);
            }
        }

        const addSubjectToNewParents = (item: any, currentDeep: number) => {
            const type = getPrefixFromId(parentsIdsOver[currentDeep]);

            if (!type && currentDeep === parentsIdsOver.length) {
                item.subjects = [...item.subjects, activeSubject]
            } else if (!type) {
                item.subjects.splice(item.subjects.findIndex((_item: any) => _item.id === parentsIdsOver[currentDeep]), 0, activeSubject)
            } else {
                const subItem = item[type].find((_item: any) => _item.id === parentsIdsOver[currentDeep])
                addSubjectToNewParents(subItem, currentDeep + 1);
            }
        }

        removeSubjectFromParents({semesters: updateSemesters}, 0)
        addSubjectToNewParents({semesters: updateSemesters}, 0)

        setSemesters(JSON.parse(JSON.stringify(updateSemesters)))
        resetAllActiveIds()

        // editSubject({
        //     subjectId: event.active.id,
        //     data: {
        //         semesterIds: {
        //             [`${Number(getIdFromPrefix(parentsIdsActive[0]))}`]: Number(getIdFromPrefix(parentsIdsOver[0]))
        //         },
        //         parentModuleId: ["modules", "selections"].includes(getPrefixFromId(parentsIdsOver[1])) ? Number(getIdFromPrefix(parentsIdsOver[1])) : null
        //     }
        // })
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

    updateSubject(id: UniqueIdentifier, params: SubjectUpdateParams): void;
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
    updateSubject: (_id: UniqueIdentifier, _params: SubjectUpdateParams) => {}
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