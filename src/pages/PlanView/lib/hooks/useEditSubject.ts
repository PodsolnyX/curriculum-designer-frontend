import {useParams} from "react-router-dom";
import {
    getAtomsByCurriculumQueryKey, useDeleteAtomMutation,
} from "@/api/axios-client/AtomQuery.ts";
import {useQueryClient} from "@tanstack/react-query";
import {App} from "antd";
import {getSemestersQueryKey} from "@/api/axios-client/SemestersQuery.ts";
import {getModulesByCurriculumQueryKey} from "@/api/axios-client/ModuleQuery.ts";

//Формат id: "semester-17"
export const useEditSubject = (subjectId: string | number) => {

    const {message} = App.useApp();
    const queryClient = useQueryClient();
    const {id: curriculumId} = useParams<{ id: string }>();

    const { mutate: deleteSubject } = useDeleteAtomMutation(Number(subjectId), {
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: getAtomsByCurriculumQueryKey(Number(curriculumId))});
            queryClient.invalidateQueries({queryKey: getSemestersQueryKey(Number(curriculumId))});
            queryClient.invalidateQueries({queryKey: getModulesByCurriculumQueryKey(Number(curriculumId))});
            message.success("Предмет успешно удалён")
        }
    });

    return {
        deleteSubject,
    }
}
