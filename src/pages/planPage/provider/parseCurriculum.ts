import {AtomDto, ModuleDto, SemesterDto} from "@/api/axios-client.types.ts";
import {Module, Selection, Semester, TrackSelection} from "@/pages/planPage/types/Semester.ts";
import {Subject} from "@/pages/planPage/types/Subject.ts";
import {UniqueIdentifier} from "@dnd-kit/core";
import {PREFIX_ITEM_ID_KEYS} from "@/pages/planPage/provider/types.ts";

// ---------------------Учебный план----------------------

export const parseCurriculum = (semesters: SemesterDto[], atoms: AtomDto[], modules: ModuleDto[]): Semester[] => {

    return ([
        ...semesters.map(semester => {
            return {
                id: setPrefixToId(semester.id, "semesters"),
                number: semester.number,
                subjects: getSemesterSubjects(semester.id, atoms),
                modules: getSemesterModules(semester, modules),
                selections: getSemesterSelections(semester, modules),
                trackSelection: getSemesterTrackSelections(semester, modules)
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
    const type = String(id).split("-")[0];
    return PREFIX_ITEM_ID_KEYS.includes(type) ? type : "";
}

// ---------------------Предметы----------------------

const getSemesterSubjects = (semesterId: number, atoms: AtomDto[]): Subject[] => {

    const isSemesterAtom = (atom: AtomDto) => {
        return (!atom?.parentModuleId) && (!!atom.semesters.find(atomSemester => semesterId === atomSemester.semester.id))
    }

    return (
        atoms.filter(atom => isSemesterAtom(atom)).map(atom => parseAtomToSubject(atom, semesterId))
    )
}

export const parseAtomToSubject = (atom: AtomDto, semesterId: number): Subject => {
    const atomSemester = atom.semesters.find(atomSemester => semesterId === atomSemester.semester.id);

    let competencies: { id: number, index: string, description: string }[] = [];

    if (atom.competences.length) {
        competencies = atom.competences.map(competence => {
            return {
                id: competence.id || 0,
                index: competence.index || "",
                description: competence.name
            }
        })
    } else if (atom.competenceIndicators.length) {
        competencies = atom.competenceIndicators.map(competence => {
            return {
                id: competence.id,
                index: competence.index,
                description: competence.name
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


// ---------------------Модули----------------------

const getSemesterModules = (semester: SemesterDto, modules: ModuleDto[]): Module[] => {

    const isSemesterModule = (module: ModuleDto) => {
        return (
            !module.selection &&
            module.atoms
                .some(atom => atom.semesters
                    .some(_semester => _semester.semester.id === semester.id)
                )
        )
    }

    return (
        modules
            .filter(module => isSemesterModule(module))
            .map(module => parseModule(module, semester))
    )
}

const parseModule = (module: ModuleDto, semester: SemesterDto): Module => {

    return {
        id: setPrefixToId(`${setPrefixToId(semester.id, "semesters")}-${module.id}`, "modules"),
        name: module.name,
        semesterId: setPrefixToId(semester.id, "semesters"),
        subjects: module.atoms
            .filter(atom => atom.semesters.some(atomSemester => semester.id === atomSemester.semester.id))
            .map(atom => parseAtomToSubject(atom, semester.id))
    }
}

// ---------------------Выборы----------------------

const getSemesterSelections = (semester: SemesterDto, modules: ModuleDto[]): Selection[] => {

    const isSemesterSelection = (module: ModuleDto) => {
        return (
            module.selection && !module.parentModuleId && module.atoms.some(atom => atom.semesters.some(_semester => _semester.semester.id === semester.id))
        )
    }

    return (
        modules
            .filter(module => isSemesterSelection(module))
            .map(module => parseSelection(module, semester))
    )
}

const parseSelection = (module: ModuleDto, semester: SemesterDto): Selection => {
    return {
        id: setPrefixToId(module.id, "selections"),
        name: module.name,
        credits: module.selection?.creditPerSemester[0] || 0,
        subjects: module.atoms
            .filter(atom => atom.semesters.some(atomSemester => semester.id === atomSemester.semester.id))
            .map(atom => parseAtomToSubject(atom, semester.id))
    }
}

// ---------------------Треки----------------------

const getSemesterTrackSelections = (semester: SemesterDto, modules: ModuleDto[]): TrackSelection[] => {

    const isSemesterTrackSelection = (module: ModuleDto) => {
        return (
            module.modules.length && module.modules.some(module => module.semesters.some(_semester => _semester.semester.id === semester.id))
        )
    }

    return (
        modules
            .filter(module => isSemesterTrackSelection(module))
            .map(module => parseTrackSelection(module, semester))
    )
}

const parseTrackSelection = (module: ModuleDto, semester: SemesterDto): TrackSelection => {

    const colors = ["#25b600", "#8019f1", "#e80319", "#f56b0a"];

    return (
        {
            id: setPrefixToId(`${setPrefixToId(semester.id, "semesters")}-${module.id}`, "tracks"),
            name: module.name,
            tracks: module.modules
                .filter(module => module.semesters.some(_semester => _semester.semester.id === semester.id))
                .map((module, index) => { return { ...parseModule(module, semester), color: index < 5 ? colors[index] : colors[0], credits: 0 } })
        }
    )
}