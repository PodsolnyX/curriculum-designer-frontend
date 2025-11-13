import {useParams} from "react-router-dom";
import {useGetCurriculumQuery} from "@/api/axios-client/CurriculumQuery.ts";
import {useGetAtomsByCurriculumQuery} from "@/api/axios-client/AtomQuery.ts";
import {useGetModulesByCurriculumQuery} from "@/api/axios-client/ModuleQuery.ts";
import {useSearchAttestationsQuery} from "@/api/axios-client/AttestationQuery.ts";
import {useGetSemestersQuery} from "@/api/axios-client/SemestersQuery.ts";
import {useGetAcademicActivitiesQuery} from "@/api/axios-client/AcademicActivityQuery.ts";
import {useGetCompetenceIndicatorsQuery, useGetCompetencesQuery} from "@/api/axios-client/CompetenceQuery.ts";
import {CompetenceDistributionType} from "@/api/axios-client.types.ts";
import {useGetIndexesQuery} from "@/api/axios-client/ComponentQuery.ts";
import {useGetValidationErrorsQuery} from "@/api/axios-client/ValidationQuery.ts";
import {componentsStore} from "@/pages/PlanView/lib/stores/componentsStore/componentsStore.ts";
import {useEffect} from "react";
import {commonStore} from "@/pages/PlanView/lib/stores/commonStore.ts";

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
    const {data: indexesData, isLoading: loadingIndexes} = useGetIndexesQuery({curriculumId: Number(id)});
    const {data: competencesData, isLoading: loadingCompetences} = useGetCompetencesQuery({curriculumId: Number(id)});
    const {data: competenceIndicatorsData, isLoading: loadingCompetenceIndicators} = useGetCompetenceIndicatorsQuery({curriculumId: Number(id)},
        { enabled: curriculumData?.settings.competenceDistributionType === CompetenceDistributionType.CompetenceIndicator});
    const {data: validationErrorsData} = useGetValidationErrorsQuery({curriculumId: Number(id)});

    const loadingList = [
        loadingPlan,
        loadingAtoms,
        loadingModules,
        loadingAttestationTypes,
        loadingSemesters,
        loadingCompetences,
        loadingCompetenceIndicators,
        loadingAcademicActivity,
        loadingIndexes
    ]

    useEffect(() => {
        if (curriculumData) {
            commonStore.setCurriculumData(curriculumData);
            componentsStore.setSemesters(curriculumData.semesters)
        }
    }, [curriculumData])

    useEffect(() => {
        if (semestersData) {
            componentsStore.setSemestersActivity(semestersData)
        }
    }, [semestersData])

    useEffect(() => {
        if (modulesData) componentsStore.setModules(modulesData);
    }, [modulesData])

    useEffect(() => {
        if (atomsData) componentsStore.setAtoms(atomsData);
    }, [atomsData])

    useEffect(() => {
        if (indexesData) componentsStore.setIndexes(indexesData);
    }, [indexesData])

    useEffect(() => {
        if (attestationTypesData) commonStore.setAttestationTypes(attestationTypesData);
    }, [attestationTypesData])

    useEffect(() => {
        if (academicActivityData) commonStore.setAcademicActivity(academicActivityData);
    }, [academicActivityData])

    useEffect(() => {
        if (competencesData) commonStore.setCompetencesTree(competencesData)
    }, [competencesData])

    useEffect(() => {
        if (competencesData && curriculumData?.settings.competenceDistributionType === CompetenceDistributionType.Competence)
            commonStore.setCompetences(competencesData);
        else if (competenceIndicatorsData && curriculumData?.settings.competenceDistributionType === CompetenceDistributionType.CompetenceIndicator)
            commonStore.setCompetences(competenceIndicatorsData);
    }, [curriculumData, competencesData, competenceIndicatorsData])

    useEffect(() => {
        if (validationErrorsData) commonStore.setValidationErrors(validationErrorsData);
    }, [validationErrorsData])

    useEffect(() => {
        if (loadingList.some(loading => loading === true)) commonStore.setIsLoadingData(true);
        else commonStore.setIsLoadingData(false);
    }, [loadingList]);

    return {
        curriculumId: Number(id),
        curriculumData,
        semestersData: semestersData,
        atomsData: atomsData,
        modulesData: modulesData,
        attestationTypesData: attestationTypesData,
        academicActivityData: academicActivityData,
        competencesData: competencesData,
        competenceIndicatorsData: competenceIndicatorsData,
        indexesData,
        validationErrorsData,
        isLoading:
            loadingPlan ||
            loadingAtoms ||
            loadingModules ||
            loadingAttestationTypes ||
            loadingSemesters ||
            loadingCompetences ||
            loadingCompetenceIndicators ||
            loadingAcademicActivity ||
            loadingIndexes
    }
}