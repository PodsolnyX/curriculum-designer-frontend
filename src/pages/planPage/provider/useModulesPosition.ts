import {useCallback, useEffect, useState} from "react";
import {
    ModulePosition,
    ModuleSemestersInfo,
    TrackSelectionSemestersInfo
} from "@/pages/planPage/provider/types.ts";
import {ModuleDto, SemesterDto} from "@/api/axios-client.types.ts";
import {UniqueIdentifier} from "@dnd-kit/core";
import {getIdFromPrefix, setPrefixToId} from "@/pages/planPage/provider/parseCurriculum.ts";
import {useCurriculumData} from "@/pages/planPage/provider/useCurriculumData.ts";

export const useModulesPosition = () => {

    const [modulesSemesters, setModulesSemesters] = useState<ModulePosition[]>([]);
    const [selectionsSemesters, setSelectionsSemesters] = useState<ModulePosition[]>([]);
    const [tracksSelectionSemesters, setTracksSelectionSemesters] = useState<ModulePosition[]>([]);

    const {
        curriculumData,
        modulesData,
    } = useCurriculumData();

    useEffect(() => {
        if (curriculumData && modulesData) {
            const positions = parseModulesPositions(curriculumData.semesters, modulesData);
            setModulesSemesters(positions.modules)
            setSelectionsSemesters(positions.selections)
            setTracksSelectionSemesters(positions.tracksSelections)
        }
    }, [curriculumData, modulesData])

    const getModulePosition = useCallback((id: UniqueIdentifier): ModuleSemestersInfo => {
        const module = modulesSemesters.find(module => getIdFromPrefix(id) === module.id);
        if (!module || module.semesters.length === 1) return {position: "single", countSemesters: 1}
        const index = module.semesters.findIndex(module => module === id);
        return {
            position: index === 0 ? "first" : index === module?.semesters.length - 1 ? "last" : "middle",
            countSemesters: module.semesters.length
        }
    }, [modulesSemesters])

    const getTrackSelectionPosition = useCallback((id: UniqueIdentifier): TrackSelectionSemestersInfo => {

        const trackSelection = tracksSelectionSemesters.find(track => getIdFromPrefix(id) === track.id);
        if (!trackSelection || trackSelection.semesters.length === 1)
            return {position: "single", countSemesters: 1, semesterNumber: 1}
        const index = trackSelection.semesters.findIndex(module => module === id);
        return {
            position: index === 0 ? "first" : index === trackSelection?.semesters.length - 1 ? "last" : "middle",
            semesterNumber: index + 1,
            countSemesters: trackSelection.semesters.length
        }
    }, [tracksSelectionSemesters])

    return {
        modulesSemesters,
        selectionsSemesters,
        tracksSelectionSemesters,
        getModulePosition,
        getTrackSelectionPosition
    }
}

const parseModulesPositions = (semestersData: SemesterDto[], modulesData: ModuleDto[]): {
    modules: ModulePosition[],
    selections: ModulePosition[],
    tracksSelections: ModulePosition[]
} => {
    let modules: ModulePosition[] = [];
    let selections: ModulePosition[] = [];
    let tracksSelections: ModulePosition[] = [];

    modulesData
        .filter(module => (module.semesters.length || module.parentSemesterId) && !module.selection)
        .map(module => {
            let firstSemesterId = module.semesters.length ? module.semesters[0].semester.id : module.parentSemesterId;
            const startSemester = semestersData.find(semester => semester.id === firstSemesterId);
            if (!startSemester) return;

            const intersectionModules = modules.filter(_module => {
                return Math.max(_module.startSemesterNumber, startSemester.number) <= Math.min(_module.startSemesterNumber + _module.semesters.length - 1, startSemester.number + (module.semesters.length > 0 ? module.semesters.length - 1 : 0));
            })

            modules.push({
                id: String(module.id),
                name: module.name,
                startSemesterNumber: startSemester.number || 0,
                columnIndex: intersectionModules.slice(-1)[0]?.columnIndex + 1 || 0,
                semesters: module.semesters.length
                    ? module.semesters.map(semester => setPrefixToId(`${setPrefixToId(semester.semester.id, "semesters")}-${module.id}`, "modules"))
                    : [setPrefixToId(`${setPrefixToId(startSemester.id, "semesters")}-${module.id}`, "modules")]
            })
        })

    modulesData.filter(modules => modules.semesters.length && modules.selection).map(selection => {
        let firstSemesterId = selection.semesters.length ? selection.semesters[0].semester.id : selection.parentSemesterId;
        const startSemester = semestersData.find(semester => semester.id === firstSemesterId);
        if (!startSemester) return;

        const intersectionSelections = selections.filter(_selection => {
            return Math.max(_selection.startSemesterNumber, startSemester.number) <= Math.min(_selection.startSemesterNumber + _selection.semesters.length - 1, startSemester.number + selection.semesters.length - 1);
        })

        modules.push({
            id: String(selection.id),
            name: selection.selection?.name || selection.name,
            startSemesterNumber: startSemester?.number || 0,
            columnIndex: intersectionSelections.slice(-1)[0]?.columnIndex + 1 || 0,
            semesters: selection.semesters.map(semester => setPrefixToId(`${setPrefixToId(semester.semester.id, "semesters")}-${selection.id}`, "selections"))
        })
    })

    modulesData.filter(modules => modules.modules.length).map(trackSelection => {
        let firstSemesterId = trackSelection.semesters.length ? trackSelection.semesters[0].semester.id : trackSelection.parentSemesterId;
        const startSemester = semestersData.find(semester => semester.id === firstSemesterId);
        if (!startSemester) return;

        const intersectionTracksSelection = tracksSelections.filter(_module => {
            return Math.max(_module.startSemesterNumber, startSemester.number) <= Math.min(_module.startSemesterNumber + _module.semesters.length - 1, startSemester.number + trackSelection.semesters.length - 1);
        })

        tracksSelections.push({
            id: String(trackSelection.id),
            name: trackSelection.name,
            startSemesterNumber: startSemester?.number || 0,
            columnIndex: intersectionTracksSelection.slice(-1)[0]?.columnIndex + 1 || 0,
            semesters: trackSelection.semesters.map(semester => setPrefixToId(`${setPrefixToId(semester.semester.id, "semesters")}-${trackSelection.id}`, "tracks"))
        })
    })

    return {modules: [...modules], selections: [...selections], tracksSelections: [...tracksSelections]}
}