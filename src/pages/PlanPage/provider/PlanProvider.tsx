import {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {DragEndEvent, DragOverEvent, DragStartEvent, UniqueIdentifier} from "@dnd-kit/core";
import {Semester} from "@/pages/PlanPage/types/Semester.ts";
import {SemestersMocks} from "@/pages/PlanPage/mocks.ts";
import {
    DisplaySettings,
    ModuleSemesters,
    ModuleSemestersInfo
} from "@/pages/PlanPage/provider/types.ts";
import {PreDisplaySettings} from "@/pages/PlanPage/provider/displaySettings.ts";
import {Subject} from "@/pages/PlanPage/types/Subject.ts";

const PREFIX_ITEM_ID_KEYS = ["subjects", "selections", "semesters", "modules"] as const;

export const PlanProvider = ({ children }: { children: ReactNode }) => {

    const [activeItemId, setActiveItemId] = useState<UniqueIdentifier | null>(null);
    const [activeSubject, setActiveSubject] = useState<Subject | null>(null);
    const [overItemId, setOverItemId] = useState<UniqueIdentifier | null>(null);

    const [semesters, setSemesters] = useState<Semester[]>([]);
    const [modulesSemesters, setModulesSemesters] = useState<ModuleSemesters[]>([]);

    const [displaySettings, setDisplaySettings] = useState<DisplaySettings>(PreDisplaySettings[0].settings)

    // Добавление префиксов для контейнеров

    const addPrefixesForItems = (semesters: Semester[]) => {

        let modules: ModuleSemesters[] = [];

        const addPrefixes = (item: any, key: typeof PREFIX_ITEM_ID_KEYS[number]) => {

            let children = {};

            for (let _key of PREFIX_ITEM_ID_KEYS.filter(key => key !== "subjects")) {
                if (Array.isArray(item[_key])) {
                    children[_key] = item[_key].map(subItem => {
                        if (_key === "modules") {
                            return addPrefixes({...subItem, id: getPrefixId(`${item.id}-${subItem.id}`, key)}, _key)
                        }
                        return addPrefixes(subItem, _key)
                    })
                }
            }

            if (key === "modules") {
                if (modules.find(module => module.id === getItemIdFromPrefix(item.id))) {
                    modules = modules.map(module => module.id !== getItemIdFromPrefix(item.id) ? module : {
                        ...module,
                        semesters: [...module.semesters, getPrefixId(item.id, key)]
                    })
                }
                else {
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

        return _semesters;
    }

    useEffect(() => {
        setSemesters(addPrefixesForItems(SemestersMocks))
    }, [])

    const getModuleSemesterPosition = (id: UniqueIdentifier): ModuleSemestersInfo => {
        const module = modulesSemesters.find(module => getItemIdFromPrefix(id) === module.id);
        if (!module || module.semesters.length === 1) return { position: "single", countSemesters: 1 }
        const index = module.semesters.findIndex(module => module === id);
        return {
            position: index === 0 ? "first" : index === module?.semesters.length - 1 ? "last" : "middle",
            countSemesters: module.semesters.length
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
                    }
                    else {
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
        const { active } = event;
        const { id } = active;

        setActiveItemId(id);
    }

    function handleDragOver(event: DragOverEvent) {

        if (!event.over) return;
        const { id: overId } = event.over;

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
            }
            else if (!type) {
                item.subjects.splice(item.subjects.findIndex(_item => _item.id === parentsIdsOver[currentDeep]), 0, activeSubject)
            }
            else {
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
        setActiveSubject,
        handleDragStart,
        handleDragOver,
        handleDragEnd,
        getModuleSemesterPosition,
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
    semesters: Semester[];
    modulesSemesters: ModuleSemesters[];
    setActiveSubject(subject: Subject | null): void;
    handleDragStart(event: DragStartEvent): void;
    handleDragOver(event: DragOverEvent): void;
    handleDragEnd(event: DragEndEvent): void;
    getModuleSemesterPosition(id: UniqueIdentifier): ModuleSemestersInfo;
    onChangeDisplaySetting(key: keyof DisplaySettings): void;
    onSelectPreDisplaySetting(key: string): void;
}

const PlanContext = createContext<PlanContextValue>({
    activeItemId: null,
    activeSubject: null,
    overItemId: null,
    displaySettings: PreDisplaySettings[0].settings,
    semesters: [],
    modulesSemesters: [],
    setActiveSubject: (_subject: Subject | null) => {},
    handleDragStart: (_event: DragEndEvent) => {},
    handleDragOver: (_event: DragOverEvent) => {},
    handleDragEnd: (_event: DragEndEvent) => {},
    getModuleSemesterPosition: (_id: UniqueIdentifier) => { return { position: "single", countSemesters: 0 } },
    onChangeDisplaySetting: (_key: keyof DisplaySettings) => {},
    onSelectPreDisplaySetting: (_key: string) => {}
})