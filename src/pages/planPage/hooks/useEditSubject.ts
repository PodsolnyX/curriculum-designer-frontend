import {UpdateAtomDto} from "@/api/axios-client.types.ts";
import {useParams} from "react-router-dom";
import {
    getAtomsByCurriculumQueryKey,
    useUpdateAtomMutation, useUpdateAtomMutationWithParameters
} from "@/api/axios-client/AtomQuery.ts";
import {useQueryClient} from "@tanstack/react-query";
import {App} from "antd";
import {getSemestersQueryKey} from "@/api/axios-client/SemestersQuery.ts";

//Формат id: "semester-17"
export const useEditSubject = (subjectId: string | number) => {

    const {message} = App.useApp();
    const queryClient = useQueryClient();
    const {id: curriculumId} = useParams<{ id: string }>();
    const { mutate } = useUpdateAtomMutation(Number(subjectId), {
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: getAtomsByCurriculumQueryKey(Number(curriculumId))});
            queryClient.invalidateQueries({queryKey: getSemestersQueryKey(Number(curriculumId))});
            message.success("Предмет успешно обновлен")
        }
    });


    return (data: UpdateAtomDto) => mutate(data)
}

type EditSubjectWithParams__MutationParameters = {
    data: UpdateAtomDto;
    subjectId: string | number;
}

export const useEditSubjectWithParams = () => {

    const {message} = App.useApp();
    const queryClient = useQueryClient();
    const {id: curriculumId} = useParams<{ id: string }>();
    const { mutate } = useUpdateAtomMutationWithParameters({
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: getAtomsByCurriculumQueryKey(Number(curriculumId))});
            queryClient.invalidateQueries({queryKey: getSemestersQueryKey(Number(curriculumId))});
            message.success("Предмет успешно обновлен")
        }
    });


    return (data: EditSubjectWithParams__MutationParameters) => mutate({updateAtomDto: data.data, atomId: Number(data.subjectId)})
}