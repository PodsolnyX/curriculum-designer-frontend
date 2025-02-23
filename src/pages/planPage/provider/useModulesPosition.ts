import {useCallback, useState} from "react";
import {
    ModulePosition,
    ModuleSemestersInfo,
    TrackSelectionSemestersInfo
} from "@/pages/planPage/provider/types.ts";
import {CurriculumDto, ModuleDto, SemesterDto} from "@/api/axios-client.types.ts";
import {UniqueIdentifier} from "@dnd-kit/core";
import {concatIds, getIdFromPrefix, setPrefixToId} from "@/pages/planPage/provider/parseCurriculum.ts";

export const useModulesPosition = () => {

    const [modulesSemesters, setModulesSemesters] = useState<ModulePosition[]>([]);
    const [selectionsSemesters, setSelectionsSemesters] = useState<ModulePosition[]>([]);
    const [tracksSelectionSemesters, setTracksSelectionSemesters] = useState<ModulePosition[]>([]);

    const parsePositions = (curriculumData: CurriculumDto, modulesData: ModuleDto[]) => {
        if (curriculumData?.semesters && modulesData) {
            const positions = parseModulesPositions(curriculumData.semesters, modulesData);
            setModulesSemesters(positions.modules)
            setSelectionsSemesters(positions.selections)
            setTracksSelectionSemesters(positions.tracksSelections)
        }
    };

    const getModulePosition = useCallback((id: UniqueIdentifier): ModuleSemestersInfo => {
        const module = modulesSemesters.find(module => getIdFromPrefix(id as string) === module.id);
        if (!module || module.semesters.length === 1) return {position: "single", countSemesters: 1}
        const index = module.semesters.findIndex(module => module === id);
        return {
            position: index === 0 ? "first" : index === module?.semesters.length - 1 ? "last" : "middle",
            countSemesters: module.semesters.length
        }
    }, [modulesSemesters])

    const getSelectionPosition = useCallback((id: UniqueIdentifier): ModuleSemestersInfo => {
        const selection = selectionsSemesters.find(module => getIdFromPrefix(id as string) === module.id);
        if (!selection || selection.semesters.length === 1) return {position: "single", countSemesters: 1}
        const index = selection.semesters.findIndex(module => module === id);
        return {
            position: index === 0 ? "first" : index === selection?.semesters.length - 1 ? "last" : "middle",
            countSemesters: selection.semesters.length
        }
    }, [selectionsSemesters])

    const getTrackSelectionPosition = useCallback((id: UniqueIdentifier): TrackSelectionSemestersInfo => {

        const trackSelection = tracksSelectionSemesters.find(track => getIdFromPrefix(id as string) === track.id);
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
        parsePositions,
        modulesSemesters,
        selectionsSemesters,
        tracksSelectionSemesters,
        getModulePosition,
        getSelectionPosition,
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
                    ? module.semesters.map(semester => concatIds(setPrefixToId(semester.semester.id, "semesters"), setPrefixToId(module.id, "modules")))
                    : [concatIds(setPrefixToId(startSemester.id, "semesters"), setPrefixToId(module.id, "modules"))]
            })
        })

    modulesData
        .filter(modules => (modules.semesters.length || modules.parentSemesterId) && !modules.modules.length && modules.selection)
        .map(selection => {
            let firstSemesterId = selection.semesters.length ? selection.semesters[0].semester.id : selection.parentSemesterId;
            const startSemester = semestersData.find(semester => semester.id === firstSemesterId);
            if (!startSemester) return;

            const intersectionSelections = selections.filter(_selection => {
                return Math.max(_selection.startSemesterNumber, startSemester.number) <= Math.min(_selection.startSemesterNumber + _selection.semesters.length - 1, startSemester.number + (selection.semesters.length > 0 ? selection.semesters.length - 1 : 0));
            })

            selections.push({
                id: String(selection.id),
                name: selection.selection?.name || selection.name,
                startSemesterNumber: startSemester?.number || 0,
                columnIndex: intersectionSelections.slice(-1)[0]?.columnIndex + 1 || 0,
                semesters: selection.semesters.length
                    ? selection.semesters.map(semester => concatIds(setPrefixToId(semester.semester.id, "semesters"), setPrefixToId(selection.id, "selections")))
                    : [concatIds(setPrefixToId(startSemester.id, "semesters"), setPrefixToId(selection.id, "selections"))]
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
            semesters: trackSelection.semesters.length
                ? trackSelection.semesters.map(semester => concatIds(setPrefixToId(semester.semester.id, "semesters"), setPrefixToId(trackSelection.id, "tracks")))
                : [concatIds(setPrefixToId(startSemester.id, "semesters"), setPrefixToId(trackSelection.id, "tracks"))]
        })
    })

    return {modules: [...modules], selections: [...selections], tracksSelections: [...tracksSelections]}
}