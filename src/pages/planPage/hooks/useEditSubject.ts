import {UpdateAtomDto} from "@/api/axios-client.types.ts";
import {useParams} from "react-router-dom";
import {
    getAtomsByCurriculumQueryKey,
    useUpdateAtomMutation
} from "@/api/axios-client/AtomQuery.ts";
import {useQueryClient} from "@tanstack/react-query";
import {App} from "antd";

//Формат id: "semester-17"
export const useEditSubject = (subjectId: string | number) => {

    const {message} = App.useApp();
    const queryClient = useQueryClient();
    const {id: curriculumId} = useParams<{ id: string }>();
    const { mutate } = useUpdateAtomMutation(Number(subjectId), {
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: getAtomsByCurriculumQueryKey(Number(curriculumId))});
            message.success("Предмет успешно обновлен")
        }
    });


    return (data: UpdateAtomDto) => mutate(data)
}