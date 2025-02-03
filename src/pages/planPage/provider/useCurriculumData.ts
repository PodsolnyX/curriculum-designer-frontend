import {useParams} from "react-router-dom";
import {useGetCurriculumQuery} from "@/api/axios-client/CurriculumQuery.ts";
import {useGetAtomsByCurriculumQuery} from "@/api/axios-client/AtomQuery.ts";
import {useGetModulesByCurriculumQuery} from "@/api/axios-client/ModuleQuery.ts";
import {useSearchAttestationsQuery} from "@/api/axios-client/AttestationQuery.ts";
import {useGetSemestersQuery} from "@/api/axios-client/SemestersQuery.ts";

export const useCurriculumData = () => {

    const {id} = useParams<{ id: string | number }>();

    const {data: curriculumData, isLoading: loadingPlan} = useGetCurriculumQuery({id: Number(id)});
    const {data: semestersData, isLoading: loadingSemesters} = useGetSemestersQuery({curriculumId: Number(id)});
    const {data: atomsData, isLoading: loadingAtoms} = useGetAtomsByCurriculumQuery({curriculumId: Number(id), hasNoParentModule: false});
    const {data: modulesData, isLoading: loadingModules} = useGetModulesByCurriculumQuery({curriculumId: Number(id), plainList: false});
    const {data: attestationTypesData, isLoading: loadingAttestationTypes} = useSearchAttestationsQuery();

    return {
        curriculumId: Number(id),
        curriculumData,
        semestersData: semestersData || [],
        atomsData: atomsData || [],
        modulesData: modulesData || [],
        attestationTypesData,
        isLoading: loadingPlan || loadingAtoms || loadingModules || loadingAttestationTypes || loadingSemesters
    }
}