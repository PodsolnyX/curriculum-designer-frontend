import {
    AcademicActivityDto,
    AttestationDto,
    CompetenceDistributionType,
    CompetenceDto,
    CompetenceIndicatorDto,
    CurriculumDto,
    ValidationError
} from "@/api/axios-client.types.ts";
import {makeAutoObservable} from "mobx";
import {getIdFromPrefix, splitIds} from "@/pages/PlanView/lib/helpers/prefixIdHelpers.ts";
import {AtomCompetence, SidebarContent} from "@/pages/PlanView/types/types.ts";

class CommonStore {

    curriculumData: CurriculumDto = {
        id: 0,
        name: "",
        semesters: [],
        settings: {
            competenceDistributionType: CompetenceDistributionType.Competence,
            hoursPerCredit: 0
        }
    };
    competences: Dictionary<AtomCompetence> = {};
    competencesTree: CompetenceDto[] = [];
    attestationTypes: AttestationDto[] = [];
    academicActivity: AcademicActivityDto[] = [];
    validationErrors: ValidationError[] = [];

    selectedComponent: string | null = null;
    selectedCompetence: number | null = null;
    sideBarContent: SidebarContent | null = null;
    isLoadingData: boolean = false;

    constructor() {
        makeAutoObservable(this);
    }

    setCurriculumData(curriculumData: CurriculumDto) {
        this.curriculumData = curriculumData;
    }

    setCompetences(competencesData: Array<CompetenceDto | CompetenceIndicatorDto>) {
        const _competences: Dictionary<AtomCompetence> = {};
        competencesData.forEach(competence => {
            _competences[competence.id] = {id: competence.id, index: competence.index, description: competence.name};
        })
        this.competences = _competences;
    }

    setCompetencesTree(competencesTree: CompetenceDto[]) {
        this.competencesTree = competencesTree;
    }

    setAttestationTypes(attestationTypes: AttestationDto[]) {
        this.attestationTypes = attestationTypes;
    }

    setAcademicActivity(academicActivityData: AcademicActivityDto[]) {
        this.academicActivity = academicActivityData;
    }

    setValidationErrors(validationErrors: ValidationError[]) {
        this.validationErrors = validationErrors;
    }

    setIsLoadingData(isLoadingData: boolean) {
        this.isLoadingData = isLoadingData;
    }

    getValidationErrors(id: string): ValidationError[] | undefined {
        if (!this.validationErrors?.length) return undefined;
        const ids = splitIds(id).map(id => Number(getIdFromPrefix(id)));
        return this.validationErrors.filter(error => error.entities ? error.entities?.every(ent => ids.includes(ent?.id || 0)) : false)
    }

    isSelectedComponent(id: string | null) {
        if (!id || !this.selectedComponent) return false;
        return getIdFromPrefix(this.selectedComponent) === getIdFromPrefix(id);
    }

    isSelectedCompetence(id: number | null) {
        if (!id || !this.selectedCompetence) return false;
        return this.selectedCompetence === id;
    }

    selectComponent(id: string | null) {
        if (!id || this.selectedComponent === id) {
            if (this.sideBarContent === "atom") this.sideBarContent = null;
            this.selectedComponent = null;
        }
        else this.selectedComponent = id;
    }

    setSideBarContent(content: SidebarContent | null) {
        this.sideBarContent = content;
    }

    selectCompetence(id: number | null) {
        this.selectedCompetence = id;
    }
}

export const commonStore = new CommonStore();