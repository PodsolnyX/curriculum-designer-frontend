import {useParams} from "react-router-dom";
import {useGetCurriculumQuery} from "@/api/axios-client/CurriculumQuery.ts";
import {useGetAtomsByCurriculumQuery} from "@/api/axios-client/AtomQuery.ts";
import {useGetModulesByCurriculumQuery} from "@/api/axios-client/ModuleQuery.ts";
import {useSearchAttestationsQuery} from "@/api/axios-client/AttestationQuery.ts";
import {useGetSemestersQuery} from "@/api/axios-client/SemestersQuery.ts";
import {useGetAcademicActivitiesQuery} from "@/api/axios-client/AcademicActivityQuery.ts";
import {useGetCompetencesQuery} from "@/api/axios-client/CompetenceQuery.ts";

interface useCurriculumDataParams {
    atomsHasNoParentModule?: boolean;
    modulesPlainList?: boolean;
}

export const useCurriculumData = (params: useCurriculumDataParams) => {

    const {
        atomsHasNoParentModule = false,
        modulesPlainList = false
    } = params;

    const {id} = useParams<{ id: string | number }>();

    const {data: curriculumData, isLoading: loadingPlan} = useGetCurriculumQuery({id: Number(id)});
    const {data: semestersData, isLoading: loadingSemesters} = useGetSemestersQuery({curriculumId: Number(id)});
    const {data: atomsData, isLoading: loadingAtoms} = useGetAtomsByCurriculumQuery({curriculumId: Number(id), hasNoParentModule: atomsHasNoParentModule});
    const {data: modulesData, isLoading: loadingModules} = useGetModulesByCurriculumQuery({curriculumId: Number(id), plainList: modulesPlainList});
    const {data: attestationTypesData, isLoading: loadingAttestationTypes} = useSearchAttestationsQuery();
    const {data: academicActivityData, isLoading: loadingAcademicActivity} = useGetAcademicActivitiesQuery({curriculumId: Number(id)});
    const {data: competencesData, isLoading: loadingCompetences} = useGetCompetencesQuery({curriculumId: Number(id)});

    return {
        curriculumId: Number(id),
        curriculumData,
        semestersData: semestersData,
        atomsData: atomsData,
        modulesData: modulesData,
        attestationTypesData: attestationTypesData,
        academicActivityData: academicActivityData,
        competences: competencesData,
        isLoading:
            loadingPlan ||
            loadingAtoms ||
            loadingModules ||
            loadingAttestationTypes ||
            loadingSemesters ||
            loadingAcademicActivity
    }
}