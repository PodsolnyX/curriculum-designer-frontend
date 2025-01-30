import {useEffect, useState} from "react";
import {
    ModuleSemesters,
    ModuleSemestersInfo,
    TrackSelectionSemesters,
    TrackSelectionSemestersInfo
} from "@/pages/planPage/provider/types.ts";
import {ModuleDto, SemesterDto} from "@/api/axios-client.types.ts";
import {UniqueIdentifier} from "@dnd-kit/core";
import {getIdFromPrefix, setPrefixToId} from "@/pages/planPage/provider/parseCurriculum.ts";
import {useCurriculumData} from "@/pages/planPage/provider/useCurriculumData.ts";

export const useModulesPosition = () => {

    const [modulesSemesters, setModulesSemesters] = useState<ModuleSemesters[]>([]);
    const [tracksSelectionSemesters, setTracksSelectionSemesters] = useState<TrackSelectionSemesters[]>([]);

    const {
        curriculumData,
        modulesData,
    } = useCurriculumData();

    useEffect(() => {
        if (curriculumData && modulesData) {
            setModulesSemesters(parseModulesPositions(curriculumData.semesters, modulesData))

        }
    },[curriculumData, modulesData])

    const getModulePosition = (id: UniqueIdentifier): ModuleSemestersInfo => {
        const module = modulesSemesters.find(module => getIdFromPrefix(id) === module.id);
        if (!module || module.semesters.length === 1) return {position: "single", countSemesters: 1}
        const index = module.semesters.findIndex(module => module === id);
        return {
            position: index === 0 ? "first" : index === module?.semesters.length - 1 ? "last" : "middle",
            countSemesters: module.semesters.length
        }
    }

    const getTrackSelectionPosition = (id: UniqueIdentifier): TrackSelectionSemestersInfo => {
        const track = tracksSelectionSemesters.find(track => getIdFromPrefix(id) === track.id);
        if (!track || track.semesters.length === 1) return {position: "single", countSemesters: 1, color: "green"}
        const index = track.semesters.findIndex(module => module === id);
        return {
            position: index === 0 ? "first" : index === track?.semesters.length - 1 ? "last" : "middle",
            countSemesters: track.semesters.length,
            color: "green"
        }
    }

    return {
        modulesSemesters,
        tracksSelectionSemesters,
        getModulePosition,
        getTrackSelectionPosition
    }
}

const parseModulesPositions = (semestersData: SemesterDto[], modulesData: ModuleDto[]): ModuleSemesters[] => {
    let modules: ModuleSemesters[] = [];

    modulesData.filter(modules => modules.semesterIds.length && !modules.selection).map(module => {
        const startSemester = semestersData.find(semester => semester.id === module.semesterIds[0]);
        const intersectionModules = modules.filter(_module => {
            return Math.max(_module.startSemesterNumber, startSemester.number) <= Math.min(_module.startSemesterNumber + _module.semesters.length - 1, startSemester.number + module.semesterIds.length - 1);

        })

        modules.push({
            id: String(module.id),
            name: module.name,
            startSemesterNumber: startSemester?.number || 0,
            columnIndex: intersectionModules.slice(-1)[0]?.columnIndex + 1 || 0,
            semesters: module.semesterIds.map(id => setPrefixToId(`${setPrefixToId(id, "semesters")}-${module.id}`, "modules"))
        })
    })

    console.log(modules)

    return [...modules];
}

// let tracksSelections: TrackSelectionSemesters[] = [];

// const parseTrackSelectionPositions = () => {
//
//     if (data) {
//         data.modules.filter(modules => modules.modules.length).map(trackSelection => {
//             console.log(trackSelection)
//             const startSemester = data.semesters.find(semester => semester.id === trackSelection.semesterIds[0]);
//             const intersectionTracksSelection = modules.filter(_module => {
//                 return Math.max(_module.startSemesterNumber, startSemester.number) <= Math.min(_module.startSemesterNumber + _module.semesters.length - 1, startSemester.number + trackSelection.semesterIds.length - 1);
//             })
//
//             tracksSelections.push({
//                 id: String(trackSelection.id),
//                 tracks: [],
//                 name: trackSelection.name,
//                 startSemesterNumber: startSemester?.number || 0,
//                 columnIndex: intersectionTracksSelection.slice(-1)[0]?.columnIndex + 1 || 0,
//                 semesters: trackSelection.semesterIds.map(id => getPrefixId(`${getPrefixId(id, "semesters")}-${trackSelection.id}`, "modules"))
//             })
//         })
//     }
//
//
//     setTracksSelectionSemesters([...tracksSelections]);
// }