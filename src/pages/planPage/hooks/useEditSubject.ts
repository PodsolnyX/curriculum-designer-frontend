import {UpdateAtomDto} from "@/api/axios-client.types.ts";
import {useParams} from "react-router-dom";
import {
    getAtomsByCurriculumQueryKey, useDeleteAtomMutation,
    useUpdateAtomMutation, useUpdateAtomMutationWithParameters
} from "@/api/axios-client/AtomQuery.ts";
import {useQueryClient} from "@tanstack/react-query";
import {App} from "antd";
import {getSemestersQueryKey} from "@/api/axios-client/SemestersQuery.ts";
import {getModulesByCurriculumQueryKey} from "@/api/axios-client/ModuleQuery.ts";
import {
    useSetAtomCompetenceIndicatorsMutation,
    useSetAtomCompetencesMutation
} from "@/api/axios-client/AtomCompetenceQuery.ts";
import {useSetAttestationMutation} from "@/api/axios-client/AttestationQuery.ts";
import {
    useCreateAtomInSemesterMutationWithParameters, useSetAtomCreditMutationWithParameters
} from "@/api/axios-client/AtomInSemesterQuery.ts";

//Формат id: "semester-17"
export const useEditSubject = (subjectId: string | number) => {

    const {message} = App.useApp();
    const queryClient = useQueryClient();
    const {id: curriculumId} = useParams<{ id: string }>();

    const { mutate: editInfo } = useUpdateAtomMutation(Number(subjectId), {
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: getAtomsByCurriculumQueryKey(Number(curriculumId))});
            queryClient.invalidateQueries({queryKey: getSemestersQueryKey(Number(curriculumId))});
            queryClient.invalidateQueries({queryKey: getModulesByCurriculumQueryKey(Number(curriculumId))});
            message.success("Предмет успешно обновлен")
        }
    });

    const { mutate: expandSubject } = useCreateAtomInSemesterMutationWithParameters( {
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: getAtomsByCurriculumQueryKey(Number(curriculumId))});
            queryClient.invalidateQueries({queryKey: getSemestersQueryKey(Number(curriculumId))});
            queryClient.invalidateQueries({queryKey: getModulesByCurriculumQueryKey(Number(curriculumId))});
            message.success("Предмет успешно обновлен")
        }
    });

    const { mutate: deleteSubject } = useDeleteAtomMutation(Number(subjectId), {
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: getAtomsByCurriculumQueryKey(Number(curriculumId))});
            queryClient.invalidateQueries({queryKey: getSemestersQueryKey(Number(curriculumId))});
            queryClient.invalidateQueries({queryKey: getModulesByCurriculumQueryKey(Number(curriculumId))});
            message.success("Предмет успешно удалён")
        }
    });

    const { mutate: editIndicatorMutate } = useSetAtomCompetenceIndicatorsMutation(Number(subjectId), {
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: getAtomsByCurriculumQueryKey(Number(curriculumId))});
            queryClient.invalidateQueries({queryKey: getModulesByCurriculumQueryKey(Number(curriculumId))});
            message.success("Предмет успешно обновлен")
        }
    });

    const { mutate: editCompetenceMutate } = useSetAtomCompetencesMutation(Number(subjectId), {
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: getAtomsByCurriculumQueryKey(Number(curriculumId))});
            queryClient.invalidateQueries({queryKey: getModulesByCurriculumQueryKey(Number(curriculumId))});
            message.success("Предмет успешно обновлен")
        }
    });

    const { mutate: editAttestationMutate } = useSetAttestationMutation({
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: getAtomsByCurriculumQueryKey(Number(curriculumId))});
            queryClient.invalidateQueries({queryKey: getModulesByCurriculumQueryKey(Number(curriculumId))});
            message.success("Предмет успешно обновлен")
        }
    });

    const editIndicator = (indicatorIds: number[]) => {
        editIndicatorMutate({competenceIndicatorIds: indicatorIds})
    }

    const editCompetence = (competenceIds: number[]) => {
        editCompetenceMutate({competenceIds: competenceIds})
    }

    //Формат id: "semester-17"

    const editAttestation = (semesterId: string, attestationIds: number[]) => {
        editAttestationMutate({
            semesterId: Number(semesterId.split("-")[1]),
            attestationIds,
            atomId: Number(subjectId)
        })
    }

    return {
        editInfo: (data: UpdateAtomDto) => editInfo(data),
        editIndicator,
        expandSubject,
        deleteSubject,
        editAttestation,
        editCompetence
    }
}

type EditSubjectWithParams__MutationParameters = {
    data: UpdateAtomDto;
    subjectId: string | number;
}

export const useEditSubjectWithParams = () => {

    const {message} = App.useApp();
    const queryClient = useQueryClient();
    const {id: curriculumId} = useParams<{ id: string }>();

    const { mutate: editInfoMutate } = useUpdateAtomMutationWithParameters({
        onSuccess: () => {
            // queryClient.invalidateQueries({queryKey: getSemestersQueryKey(Number(curriculumId))});
            message.success("Предмет успешно обновлен")
        }
    });

    const { mutate: setCredits } = useSetAtomCreditMutationWithParameters({
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: getSemestersQueryKey(Number(curriculumId))});
            message.success("ЗЕТ предмета сохранены")
        }
    });

    const { mutate: editAttestation } = useSetAttestationMutation({
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: getSemestersQueryKey(Number(curriculumId))});
            message.success("Аттестация сохранена")
        }
    });


    return {
        editInfo: (data: EditSubjectWithParams__MutationParameters) => editInfoMutate({updateAtomDto: data.data, atomId: Number(data.subjectId)}),
        setCredits,
        editAttestation
    }
}