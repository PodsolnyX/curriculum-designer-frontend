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

export const parseCurriculum = (params: ParseCurriculumParams): Semester[] => {

    const {
        semesters,
        atoms,
        modules,
        competences
    } = params;

    return ([
        ...semesters.map((semester, index) => {
            return {
                id: setPrefixToId(semester.id, "semesters"),
                number: semester.number,
                subjects: getSemesterSubjects(
                    semester.id,
                    atoms,
                    competences,
                    [
                        index > 0 ? (semesters[index - 1]?.id || 0) : null,
                        index < semesters.length - 1 ? (semesters[index + 1]?.id || 0) : null
                    ]
                ),
                modules: getSemesterModules(semester, modules, competences),
                selections: getSemesterSelections(semester, modules, competences),
                trackSelection: getSemesterTrackSelections(semester, modules, competences)
            }
        })
    ])
}

// ---------------------Общее----------------------


export const setPrefixToId = (id: UniqueIdentifier, key: typeof PREFIX_ITEM_ID_KEYS[number]): string => {
    return `${key}-${id}`
}

export const getIdFromPrefix = (id: UniqueIdentifier): string => {
    const _result = String(id).split("-");
    return _result[_result.length - 1];
}

export const getPrefixFromId = (id: UniqueIdentifier): string => {
    const type: PrefixItemId = String(id).split("-")[0] as PrefixItemId;
    return PREFIX_ITEM_ID_KEYS.includes(type) ? type : "";
}

// ---------------------Предметы----------------------

const getSemesterSubjects = (semesterId: number, atoms: AtomDto[], competences: Dictionary<CompetenceDto>, neighboringSemesters?: Array<number | null>): Subject[] => {

    const isSemesterAtom = (atom: AtomDto) => {
        return (!atom?.parentModuleId) && (!!atom.semesters.find(atomSemester => semesterId === atomSemester.semester.id))
    }

    return (
        atoms.filter(atom => isSemesterAtom(atom)).map(atom => parseAtomToSubject(atom, semesterId, competences, neighboringSemesters))
    )
}

export const parseAtomToSubject = (atom: AtomDto, semesterId: number, competences: Dictionary<CompetenceDto>, neighboringSemesters?: Array<number | null>): Subject => {
    const atomSemester = atom.semesters.find(atomSemester => semesterId === atomSemester.semester.id);

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
        id: `${atom.id}`,
        name: atom.name,
        type: atom.type,
        isRequired: atom.isRequired,
        credits: atomSemester.credit,
        attestation: atomSemester.attestations,
        competencies: competencies,
        department: atom?.department,
        academicHours: atomSemester.academicActivityHours,
        semesterId: setPrefixToId(semesterId, "semesters"),
        semestersIds: atom.semesters.map(atomSemester => atomSemester.semester.id),
        semesterOrder: atom.semesters.length > 1 ? atom.semesters.findIndex(atomSemester => semesterId === atomSemester.semester.id) + 1 : undefined,
        neighboringSemesters: {
            prev: neighboringSemesters?.[0],
            next: neighboringSemesters?.[1]
        }
    }
}


// ---------------------Модули----------------------

const getSemesterModules = (semester: SemesterDto, modules: ModuleDto[], competences: Dictionary<CompetenceDto>): Module[] => {

    const isSemesterModule = (module: ModuleDto) => {
        return (
            !module.selection &&
            ((module.parentSemesterId === semester.id && !module.atoms.length) ||
            module.atoms
                .some(atom => atom.semesters
                    .some(_semester => _semester.semester.id === semester.id)
                ))
        )
    }

    return (
        modules
            .filter(module => isSemesterModule(module))
            .map(module => parseModule(module, semester, competences))
    )
}

const parseModule = (module: ModuleDto, semester: SemesterDto, competences: Dictionary<CompetenceDto>): Module => {

    return {
        id: setPrefixToId(`${setPrefixToId(semester.id, "semesters")}-${module.id}`, "modules"),
        name: module.name,
        semesterId: setPrefixToId(semester.id, "semesters"),
        subjects: module.atoms
            .filter(atom => atom.semesters.some(atomSemester => semester.id === atomSemester.semester.id))
            .map(atom => parseAtomToSubject(atom, semester.id, competences))
    }
}

// ---------------------Выборы----------------------

const getSemesterSelections = (semester: SemesterDto, modules: ModuleDto[], competences: Dictionary<CompetenceDto>): Selection[] => {

    const isSemesterSelection = (module: ModuleDto) => {
        return (
            !module.modules.length &&
            module.selection &&
            !module.parentModuleId &&
            module.atoms.some(atom => atom.semesters
                .some(_semester => _semester.semester.id === semester.id))
        )
    }

    return (
        modules
            .filter(module => isSemesterSelection(module))
            .map(module => parseSelection(module, semester, competences))
    )
}

const parseSelection = (module: ModuleDto, semester: SemesterDto, competences: Dictionary<CompetenceDto>): Selection => {
    return {
        id: setPrefixToId(`${setPrefixToId(semester.id, "semesters")}-${module.id}`, "selections"),
        name: module.name,
        credits: module.selection?.semesters[0].credit || 0,
        subjects: module.atoms
            .filter(atom => atom.semesters.some(atomSemester => semester.id === atomSemester.semester.id))
            .map(atom => parseAtomToSubject(atom, semester.id, competences))
    }
}

// ---------------------Треки----------------------

const getSemesterTrackSelections = (semester: SemesterDto, modules: ModuleDto[], competences: Dictionary<CompetenceDto>): TrackSelection[] => {

    const isSemesterTrackSelection = (module: ModuleDto) => {
        return (
            module.modules.length && module.modules.some(module => module.semesters.some(_semester => _semester.semester.id === semester.id))
        )
    }

    return (
        modules
            .filter(module => isSemesterTrackSelection(module))
            .map(module => parseTrackSelection(module, semester, competences))
    )
}

const parseTrackSelection = (module: ModuleDto, semester: SemesterDto, competences: Dictionary<CompetenceDto>): TrackSelection => {

    const colors = ["#25b600", "#8019f1", "#e80319", "#f56b0a"];

    return (
        {
            id: setPrefixToId(`${setPrefixToId(semester.id, "semesters")}-${module.id}`, "tracks"),
            name: module.name,
            credits: module.semesters.find(_semester => _semester.semester.id === semester.id)?.nonElective.credit || 0,
            tracks: module.modules
                .filter(module => module.semesters.some(_semester => _semester.semester.id === semester.id))
                .map((module, index) => { return {
                    ...parseModule(module, semester, competences),
                    color: index < 5 ? colors[index] : colors[0]
                }})
        }
    )
}