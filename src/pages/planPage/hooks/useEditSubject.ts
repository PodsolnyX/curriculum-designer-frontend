import {AtomType, UpdateAtomDto} from "@/api/axios-client.types.ts";
import {useParams} from "react-router-dom";
import {useCreateAtomMutation, useUpdateAtomMutation} from "@/api/axios-client/AtomQuery.ts";
import {useQueryClient} from "@tanstack/react-query";
import {getCurriculumQueryKey} from "@/api/axios-client/CurriculumQuery.ts";
import {App} from "antd";

//Формат id: "semester-17"
export const useEditSubject = (subjectId: string | number) => {

    const {message} = App.useApp();
    const queryClient = useQueryClient();
    const {id: curriculumId} = useParams<{ id: string }>();
    const { mutate } = useUpdateAtomMutation(Number(subjectId), {
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: getCurriculumQueryKey(Number(curriculumId))});
            message.success("Предмет успешно обновлен")
        }
    });


    return (data: UpdateAtomDto) => mutate(data)
}