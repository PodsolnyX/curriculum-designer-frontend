import {AtomDto, CompetenceDto, ModuleDto, SemesterDto} from "@/api/axios-client.types.ts";
import {Module, Selection, Semester, TrackSelection} from "@/pages/planPage/types/Semester.ts";
import {Subject} from "@/pages/planPage/types/Subject.ts";
import {UniqueIdentifier} from "@dnd-kit/core";
import {PREFIX_ITEM_ID_KEYS, PrefixItemId} from "@/pages/planPage/provider/types.ts";

// ---------------------Учебный план----------------------

interface ParseCurriculumParams {
    semesters: SemesterDto[];
    atoms: AtomDto[];
    modules: ModuleDto[];
    competences: Dictionary<CompetenceDto>;
}

interface ParseEntityParams {
    parentId: string;
    competences: Dictionary<CompetenceDto>;
}

interface ParseAtomParams extends ParseEntityParams {
    semesterId: number,
    neighboringSemesters?: Array<number | null>
}

interface ParseModuleParams extends ParseEntityParams {
    semester: SemesterDto
}

export const parseCurriculum = (params: ParseCurriculumParams): Semester[] => {

    const {
        semesters,
        atoms,
        modules,
        competences
    } = params;

    return ([
        ...semesters.map((semester, index) => {

            const semesterId = setPrefixToId(semester.id, "semesters");

            return {
                id: semesterId,
                number: semester.number,
                subjects: getSemesterSubjects(
                    atoms,
                    {
                        parentId: semesterId,
                        semesterId: semester.id,
                        competences,
                        neighboringSemesters: [
                            index > 0 ? (semesters[index - 1]?.id || 0) : null,
                            index < semesters.length - 1 ? (semesters[index + 1]?.id || 0) : null
                        ]
                    }
                ),
                modules: getSemesterModules(modules, {parentId: semesterId, semester, competences}),
                selections: getSemesterSelections(modules, {parentId: semesterId, semester, competences}),
                trackSelection: getSemesterTrackSelections(modules, {parentId: semesterId, semester, competences})
            }
        })
    ])
}

// ---------------------Общее----------------------

export const setPrefixToId = (id: UniqueIdentifier, key: typeof PREFIX_ITEM_ID_KEYS[number]): string => {
    return `${key}-${id}`
}

export const getIdFromPrefix = (id: string): string => {
    if (!id) return "";
    const ids = id.split("_");
    return ids.at(-1).split("-")[1] as PrefixItemId;
}

export const getParentIdFromPrefix = (id: string): string => {
    if (!id) return "";
    const ids = id.split("_");
    if (getPrefixFromId(ids.at(-1)) === "subjects") return getIdFromPrefix(ids.at(-2));
    return getIdFromPrefix(ids.at(-1));
}

export const getPrefixFromId = (id: string): string => {
    if (!id) return "";
    const ids = id.split("_");
    const type: PrefixItemId = ids.at(-1).split("-")[0] as PrefixItemId;
    return PREFIX_ITEM_ID_KEYS.includes(type) ? type : "";
}

export const getParentPrefixFromPrefix = (id: string): string => {
    if (!id) return "";
    const ids = id.split("_");
    if (getPrefixFromId(ids.at(-1)) === "subjects") return getIdFromPrefix(ids.at(-2));
    return getPrefixFromId(ids.at(-1));
}

export const concatIds = (parentId: string, childId: string): string => {
    return `${parentId}_${childId}`;
}

export const splitIds = (id: string): string[] => {
    const parts = id.split("_");
    const result: string[] = [];

    for (let i = 1; i <= parts.length; i += 1) {
        result.push(parts.slice(0, i).join("_"));
    }

    return result;
}

export const cutSemesterIdFromId = (id: string): string => {
    return id.split("_").slice(1).join("_");
}

export const regenerateId = (id: string, overId: string): string => {
    const parts = id.split("_");
    const overParts = overId.split("_");

    if (getPrefixFromId(overParts.at(-1)) === "subjects") {
        return concatIds(overParts.slice(0, -1).join("_"), parts.at(-1));
    }
    else {
        return concatIds(overParts.join("_"), parts.at(-1));
    }
}

// ---------------------Предметы----------------------

const getSemesterSubjects = (atoms: AtomDto[], params: ParseAtomParams): Subject[] => {

    const isSemesterAtom = (atom: AtomDto) => {
        return (!atom?.parentModuleId) && (!!atom.semesters.find(atomSemester => params.semesterId === atomSemester.semester.id))
    }

    return (
        atoms.filter(atom => isSemesterAtom(atom)).map(atom => parseAtomToSubject(atom, params))
    )
}

export const parseAtomToSubject = (atom: AtomDto, params: ParseAtomParams): Subject => {
    const atomSemester = atom.semesters.find(atomSemester => params.semesterId === atomSemester.semester.id);

    if (!atomSemester) throw new Error("Предмет не найден")

    let competencies: { id: number, index: string, description: string }[] = [];

    if (atom.competenceIds.length) {
        competencies = atom.competenceIds.map(competence => {
            return {
                id: competence || 0,
                index: String(competence) || "",
                description: String(competence)
            }
        })
    } else if (atom.competenceIndicatorIds.length) {
        competencies = atom.competenceIndicatorIds.map(competence => {
            return {
                id: competence || 0,
                index: String(competence) || "",
                description: String(competence)
            }
        })
    }

    return {
        id: concatIds(params.parentId, setPrefixToId(atom.id, "subjects")),
        name: atom.name,
        type: atom.type,
        isRequired: atom.isRequired,
        credits: atomSemester.credit,
        attestation: atomSemester.attestations,
        competencies: competencies,
        department: atom?.department,
        academicHours: atomSemester.academicActivityHours,
        semesterId: setPrefixToId(params.semesterId, "semesters"),
        semestersIds: atom.semesters.map(atomSemester => atomSemester.semester.id),
        semesterOrder: atom.semesters.length > 1 ? atom.semesters.findIndex(atomSemester => params.semesterId === atomSemester.semester.id) + 1 : undefined,
        neighboringSemesters: {
            prev: params.neighboringSemesters?.[0],
            next:params. neighboringSemesters?.[1]
        }
    }
}


// ---------------------Модули----------------------

const getSemesterModules = (modules: ModuleDto[], params: ParseModuleParams): Module[] => {

    const isSemesterModule = (module: ModuleDto) => {
        return (
            !module.selection &&
            ((module.parentSemesterId === params.semester.id && !module.atoms.length) ||
            module.atoms
                .some(atom => atom.semesters
                    .some(_semester => _semester.semester.id === params.semester.id)
                ))
        )
    }

    return (
        modules
            .filter(module => isSemesterModule(module))
            .map(module => parseModule(module, params))
    )
}

const parseModule = (module: ModuleDto, params: ParseModuleParams): Module => {

    const moduleId = concatIds(params.parentId, setPrefixToId(module.id, "modules"));

    return {
        id: moduleId,
        name: module.name,
        semesterId: setPrefixToId(params.semester.id, "semesters"),
        subjects: module.atoms
            .filter(atom => atom.semesters.some(atomSemester => params.semester.id === atomSemester.semester.id))
            .map(atom => parseAtomToSubject(atom, {semesterId: params.semester.id, competences: params.competences, parentId: moduleId}))
    }
}

// ---------------------Выборы----------------------

const getSemesterSelections = (modules: ModuleDto[], params: ParseModuleParams): Selection[] => {

    const isSemesterSelection = (module: ModuleDto) => {
        return (
            !module.modules.length &&
            module.selection &&
            !module.parentModuleId &&
            module.atoms.some(atom => atom.semesters
                .some(_semester => _semester.semester.id === params.semester.id))
        )
    }

    return (
        modules
            .filter(module => isSemesterSelection(module))
            .map(module => parseSelection(module, params))
    )
}

const parseSelection = (module: ModuleDto, params: ParseModuleParams): Selection => {

    const selectionId = concatIds(params.parentId, setPrefixToId(module.id, "selections"));

    return {
        id: selectionId,
        name: module.name,
        credits: module.selection?.semesters[0].credit || 0,
        subjects: module.atoms
            .filter(atom => atom.semesters.some(atomSemester => params.semester.id === atomSemester.semester.id))
            .map(atom => parseAtomToSubject(atom, {semesterId: params.semester.id, competences: params.competences, parentId: selectionId}))
    }
}

// ---------------------Треки----------------------

const getSemesterTrackSelections = (modules: ModuleDto[], params: ParseModuleParams): TrackSelection[] => {

    const isSemesterTrackSelection = (module: ModuleDto) => {
        return (
            module.modules.length && module.modules.some(module => module.semesters.some(_semester => _semester.semester.id === params.semester.id))
        )
    }

    return (
        modules
            .filter(module => isSemesterTrackSelection(module))
            .map(module => parseTrackSelection(module, params))
    )
}

const parseTrackSelection = (module: ModuleDto, params: ParseModuleParams): TrackSelection => {

    const colors = ["#25b600", "#8019f1", "#e80319", "#f56b0a"];
    const trackSelectionId = concatIds(params.parentId, setPrefixToId(module.id, "tracks"));

    return (
        {
            id: trackSelectionId,
            name: module.name,
            credits: module.semesters.find(_semester => _semester.semester.id === params.semester.id)?.nonElective.credit || 0,
            tracks: module.modules
                .filter(module => module.semesters.some(_semester => _semester.semester.id === params.semester.id))
                .map((module, index) => { return {
                    ...parseModule(module, {...params, parentId: trackSelectionId}),
                    color: index < 5 ? colors[index] : colors[0]
                }})
        }
    )
}