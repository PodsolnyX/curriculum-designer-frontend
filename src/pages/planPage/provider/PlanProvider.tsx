import {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {DragEndEvent, DragOverEvent, DragStartEvent, UniqueIdentifier} from "@dnd-kit/core";
import {Module, Selection, Semester} from "@/pages/planPage/types/Semester.ts";
import {
    DisplaySettings,
    ModuleSemesters,
    ModuleSemestersInfo, PREFIX_ITEM_ID_KEYS, ToolsOptions, TrackSemesters, TrackSemestersInfo
} from "@/pages/planPage/provider/types.ts";
import {PreDisplaySettings} from "@/pages/planPage/provider/displaySettings.ts";
import {Subject} from "@/pages/planPage/types/Subject.ts";
import {useGetCurriculumQuery} from "@/api/axios-client/CurriculumQuery.ts";
import {useSearchAttestationsQuery} from "@/api/axios-client/AttestationQuery.ts";
import {AtomDto, AttestationDto, CompetenceDto, ModuleDto, SemesterDto} from "@/api/axios-client.ts";
import {useParams} from "react-router-dom";

export const PlanProvider = ({children}: { children: ReactNode }) => {

    const [activeItemId, setActiveItemId] = useState<UniqueIdentifier | null>(null);
    const [activeSubject, setActiveSubject] = useState<Subject | null>(null);
    const [selectedSubjectId, setSelectedSubjectId] = useState<UniqueIdentifier | null>(null);
    const [overItemId, setOverItemId] = useState<UniqueIdentifier | null>(null);

    const {id} = useParams<{ id: string | number }>();

    const {data, isLoading: loadingPlan} = useGetCurriculumQuery({id: Number(id)});
    const {data: attestationTypes} = useSearchAttestationsQuery();

    const [semesters, setSemesters] = useState<Semester[]>([]);
    const [modulesSemesters, setModulesSemesters] = useState<ModuleSemesters[]>([]);
    const [tracksSemesters, setTracksSemesters] = useState<TrackSemesters[]>([]);

    const [toolsOptions, setToolsOptions] = useState<ToolsOptions>({
        editMode: false,
        selectedEditItem: "subjects"
    });
    const [displaySettings, setDisplaySettings] = useState<DisplaySettings>(PreDisplaySettings[0].settings)

    // Выбор предмета

    const onSelectSubject = (id: UniqueIdentifier | null) => {
        setSelectedSubjectId(id);
    }

    // Добавление префиксов для контейнеров

    const addPrefixesForItems = (semesters: Semester[]) => {

        let modules: ModuleSemesters[] = [];
        let tracks: TrackSemesters[] = [];

        const addPrefixes = (item: any, key: typeof PREFIX_ITEM_ID_KEYS[number]) => {

            let children = {};

            for (let _key of PREFIX_ITEM_ID_KEYS.filter(key => key !== "subjects")) {
                if (Array.isArray(item[_key])) {
                    children[_key] = item[_key].map(subItem => {
                        if (_key === "modules" || _key === "tracks") {
                            return addPrefixes({...subItem, id: getPrefixId(`${item.id}-${subItem.id}`, key)}, _key)
                        }
                        return addPrefixes(subItem, _key)
                    })
                }
            }

            if (key === "tracks") {
                if (tracks.find(track => track.id === getItemIdFromPrefix(item.id))) {
                    tracks = tracks.map(track => track.id !== getItemIdFromPrefix(item.id) ? track : {
                        ...track,
                        semesters: [...track.semesters, getPrefixId(item.id, key)]
                    })
                } else {
                    tracks.push({
                        id: getItemIdFromPrefix(item.id),
                        name: item.name,
                        color: item.color || "#000000",
                        semesters: [getPrefixId(item.id, key)]
                    })
                }
            }

            if (key === "modules") {
                if (modules.find(module => module.id === getItemIdFromPrefix(item.id))) {
                    modules = modules.map(module => module.id !== getItemIdFromPrefix(item.id) ? module : {
                        ...module,
                        semesters: [...module.semesters, getPrefixId(item.id, key)]
                    })
                } else {
                    modules.push({
                        id: getItemIdFromPrefix(item.id),
                        name: item.name,
                        semesters: [getPrefixId(item.id, key)]
                    })
                }
            }


            return {
                ...item,
                id: getPrefixId(item.id, key),
                ...children
            }
        }

        const _semesters = addPrefixes({semesters: semesters}, "semesters").semesters;

        setModulesSemesters([...modules]);
        setTracksSemesters([...tracks]);

        return _semesters;
    }

    useEffect(() => {

        let modules: ModuleSemesters[] = [];

        const parseModules2 = () => {

            if (data) {
                data.modules.filter(modules => modules.semesterIds.length && !modules.selection).map(module => {
                    const startSemester = data.semesters.find(semester => semester.id === module.semesterIds[0]);
                    const intersectionModules = modules.filter(_module => {
                        return Math.max(_module.startSemesterNumber, startSemester.number) <= Math.min(_module.startSemesterNumber + _module.semesters.length - 1, startSemester.number + module.semesterIds.length - 1);

                    })

                    modules.push({
                        id: String(module.id),
                        name: module.name,
                        startSemesterNumber: startSemester?.number || 0,
                        columnIndex: intersectionModules.slice(-1)[0]?.columnIndex + 1 || 0,
                        semesters: module.semesterIds.map(id => getPrefixId(`${getPrefixId(id, "semesters")}-${module.id}`, "modules"))
                    })
                })
            }


            setModulesSemesters([...modules]);
        }

        const parseModule = (module: ModuleDto, semester: SemesterDto): Module => {

            return {
                id: getPrefixId(`${getPrefixId(semester.id, "semesters")}-${module.id}`, "modules"),
                name: module.name,
                subjects: module.atoms
                    .filter(atom => atom.semesters.some(atomSemester => semester.id === atomSemester.semester.id))
                    .map(atom => parseAtomToSubject(atom, semester.id))
            }
        }

        if (data) {
            setSemesters([
                ...data.semesters?.map(semester => {
                    return {
                        id: getPrefixId(semester.id, "semesters"),
                        number: semester.number,
                        subjects: data.atoms
                            ? data.atoms.filter(atom => atom.semesters
                                ? (!atom?.parentModuleId && (!!atom.semesters.find(atomSemester => semester.id === atomSemester.semester.id)))
                                : false).map(atom => parseAtomToSubject(atom, semester.id))
                            : [],
                        selections: data.modules
                            .filter(module => module.selection && module.atoms.some(atom => atom.semesters.some(_semester => _semester.semester.id === semester.id)))
                            .map(module => parseSelection(module, semester.id)),
                        modules: data.modules
                            .filter(module => !module.selection && module.atoms.some(atom => atom.semesters.some(_semester => _semester.semester.id === semester.id)))
                            .map(module => parseModule(module, semester)),
                        tracks: []
                    }
                })
            ])

            setModulesSemesters([...modules]);
            parseModules2()
        }
    }, [data])

    const parseAtomToSubject = (atom: AtomDto, semesterId: number): Subject => {
        const atomSemester = atom.semesters.find(atomSemester => semesterId === atomSemester.semester.id);

        let competencies: { id: number, index: string, description: string }[] = [];

        if (atom.competences.length) {
            competencies = atom.competences.map(competence => {
                return {
                    id: competence.id || 0,
                    index: competence.index || "",
                    description: competence.description
                }
            })
        } else if (atom.competenceIndicators.length) {
            competencies = atom.competenceIndicators.map(competence => {
                return {
                    id: competence.id,
                    index: competence.index,
                    description: competence.description
                }
            })
        }

        return {
            id: `${atom.id}`,
            name: atom.name,
            type: atom.type,
            isRequired: atom.isRequired,
            credits: atomSemester.credit,
            attestation: atomSemester.attestations,
            competencies: competencies,
            academicHours: atomSemester.academicActivityHours,
            semesterOrder: atom.semesters.length > 1 ? atom.semesters.findIndex(atomSemester => semesterId === atomSemester.semester.id) + 1 : undefined,
        }
    }

    const parseSelection = (module: ModuleDto, semesterId: number): Selection => {
        return {
            id: getPrefixId(module.id, "selections"),
            name: module.name,
            credits: module.selection?.creditPerSemester[0] || 0,
            subjects: module.atoms
                .filter(atom => atom.semesters.some(atomSemester => semesterId === atomSemester.semester.id))
                .map(atom => parseAtomToSubject(atom, semesterId))
        }
    }

    const getModuleSemesterPosition = (id: UniqueIdentifier): ModuleSemestersInfo => {
        const module = modulesSemesters.find(module => getItemIdFromPrefix(id) === module.id);
        if (!module || module.semesters.length === 1) return {position: "single", countSemesters: 1}
        const index = module.semesters.findIndex(module => module === id);
        return {
            position: index === 0 ? "first" : index === module?.semesters.length - 1 ? "last" : "middle",
            countSemesters: module.semesters.length
        }
    }

    const getTrackSemesterPosition = (id: UniqueIdentifier): TrackSemestersInfo => {
        const track = tracksSemesters.find(track => getItemIdFromPrefix(id) === track.id);
        if (!track || track.semesters.length === 1) return {position: "single", countSemesters: 1, color: track.color}
        const index = track.semesters.findIndex(module => module === id);
        return {
            position: index === 0 ? "first" : index === track?.semesters.length - 1 ? "last" : "middle",
            countSemesters: track.semesters.length,
            color: track.color
        }
    }

    // Обработка DnD

    function resetAllActiveIds() {
        setActiveItemId(null);
        setOverItemId(null);
    }

    const getItemTypeById = (id: UniqueIdentifier): string => {
        const type = String(id).split("-")[0];
        return PREFIX_ITEM_ID_KEYS.includes(type) ? type : "";
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

    const handleDragEnd = (event: DragEndEvent) => {
        if (!event.active?.id || !event?.over?.id || event.active.id === event.over.id) return;

        const parentsIdsActive = getParentsIdsByChildId(event.active.id);
        const parentsIdsOver = getParentsIdsByChildId(event.over.id);

        const updateSemesters = JSON.parse(JSON.stringify(semesters));

        let activeSubject;

        const removeSubjectFromParents = (item: any, currentDeep: number) => {
            const type = getItemTypeById(parentsIdsActive[currentDeep]);
            if (!type)
                item.subjects = item.subjects.filter(item => {
                    if (item.id !== parentsIdsActive[currentDeep]) return true
                    else {
                        activeSubject = item;
                        return false;
                    }
                })
            else {
                const subItem = item[type].find(_item => _item.id === parentsIdsActive[currentDeep])
                removeSubjectFromParents(subItem, currentDeep + 1);
            }
        }

        const addSubjectToNewParents = (item: any, currentDeep: number) => {
            const type = getItemTypeById(parentsIdsOver[currentDeep]);

            if (!type && currentDeep === parentsIdsOver.length) {
                item.subjects = [...item.subjects, activeSubject]
            } else if (!type) {
                item.subjects.splice(item.subjects.findIndex(_item => _item.id === parentsIdsOver[currentDeep]), 0, activeSubject)
            } else {
                const subItem = item[type].find(_item => _item.id === parentsIdsOver[currentDeep])
                addSubjectToNewParents(subItem, currentDeep + 1);
            }
        }

        removeSubjectFromParents({semesters: updateSemesters}, 0)
        addSubjectToNewParents({semesters: updateSemesters}, 0)

        setSemesters(JSON.parse(JSON.stringify(updateSemesters)))
        resetAllActiveIds()
    }

    // Изменение настроек отображения

    const onChangeDisplaySetting = (key: keyof DisplaySettings) => {
        setDisplaySettings({
            ...displaySettings,
            [key]: !displaySettings[key]
        })
    }

    const onSelectPreDisplaySetting = (key: string) => {
        setDisplaySettings({
            ...PreDisplaySettings.find(setting => setting.key === key).settings
        })
    }

    const value: PlanContextValue = {
        activeItemId,
        activeSubject,
        overItemId,
        semesters,
        modulesSemesters,
        displaySettings,
        toolsOptions,
        selectedSubject: data?.atoms ? data.atoms.find(atom => String(atom.id) === selectedSubjectId) || null : null,
        attestationTypes,
        competences: data?.competences || [],
        loadingPlan,
        onSelectSubject,
        setToolsOptions,
        setActiveSubject,
        handleDragStart,
        handleDragOver,
        handleDragEnd,
        getModuleSemesterPosition,
        getTrackSemesterPosition,
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

const getPrefixId = (id: UniqueIdentifier, key: typeof PREFIX_ITEM_ID_KEYS[number]): string => {
    return `${key}-${id}`
}

const getItemIdFromPrefix = (id: UniqueIdentifier): string => {
    const _result = String(id).split("-");
    return _result[_result.length - 1];
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
    semesters: Semester[];
    attestationTypes: AttestationDto[];
    modulesSemesters: ModuleSemesters[];
    selectedSubject: AtomDto | null;
    competences: CompetenceDto[];
    loadingPlan: boolean;

    onSelectSubject(is: UniqueIdentifier | null): void;

    setToolsOptions(options: ToolsOptions): void;

    setActiveSubject(subject: Subject | null): void;

    handleDragStart(event: DragStartEvent): void;

    handleDragOver(event: DragOverEvent): void;

    handleDragEnd(event: DragEndEvent): void;

    getModuleSemesterPosition(id: UniqueIdentifier): ModuleSemestersInfo;

    getTrackSemesterPosition(id: UniqueIdentifier): TrackSemestersInfo;

    onChangeDisplaySetting(key: keyof DisplaySettings): void;

    onSelectPreDisplaySetting(key: string): void;
}

const PlanContext = createContext<PlanContextValue>({
    activeItemId: null,
    activeSubject: null,
    overItemId: null,
    displaySettings: PreDisplaySettings[0].settings,
    toolsOptions: {
        editMode: false,
        selectedEditItem: "subjects"
    },
    semesters: [],
    modulesSemesters: [],
    selectedSubject: null,
    attestationTypes: [],
    competences: [],
    loadingPlan: true,
    onSelectSubject: (_id: number | null) => {
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
    getModuleSemesterPosition: (_id: UniqueIdentifier) => {
        return {position: "single", countSemesters: 0}
    },
    getTrackSemesterPosition: (_id: UniqueIdentifier) => {
        return {position: "single", countSemesters: 0, color: "#000000"}
    },
    onChangeDisplaySetting: (_key: keyof DisplaySettings) => {
    },
    onSelectPreDisplaySetting: (_key: string) => {
    }
})