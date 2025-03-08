import {
    AcademicActivityDto,
    AttestationDto,
    CompetenceDistributionType, CompetenceDto, CompetenceIndicatorDto,
    CurriculumDto,
    ValidationError
} from "@/api/axios-client.types.ts";
import {makeAutoObservable} from "mobx";
import {SubjectCompetence} from "@/pages/planPage/types/Subject.ts";
import {getIdFromPrefix, splitIds} from "@/pages/planPage/provider/prefixIdHelpers.ts";


class CommonStore {

    curriculumData: CurriculumDto = {
        id: 0,
        name: "",
        semesters: [],
        settings: {
            competenceDistributionType: CompetenceDistributionType.Competence
        }
    };
    competences: Dictionary<SubjectCompetence> = {};
    attestationTypes: AttestationDto[] = [];
    academicActivity: AcademicActivityDto[] = [];
    validationErrors: ValidationError[] = [];

    selectedCompetence: number | null = null;
    isLoadingData: boolean = false;

    constructor() {
        makeAutoObservable(this);
    }

    setCurriculumData(curriculumData: CurriculumDto) {
        this.curriculumData = curriculumData;
    }

    setCompetences(competencesData: Array<CompetenceDto | CompetenceIndicatorDto>) {
        let _competences: Dictionary<SubjectCompetence> = {};
        competencesData.forEach(competence => {
            _competences[competence.id] = {id: competence.id, index: competence.index, description: competence.name};
        })
        this.competences = _competences;
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

    selectCompetence(id: number | null) {
        this.selectedCompetence = id;
    }
}

export const commonStore = new CommonStore();