import {AtomType} from "@/api/axios-client.types.ts";
import {useParams} from "react-router-dom";
import {useCreateAtomMutation} from "@/api/axios-client/AtomQuery.ts";
import {useQueryClient} from "@tanstack/react-query";
import {getCurriculumQueryKey} from "@/api/axios-client/CurriculumQuery.ts";
import {App} from "antd";

//Формат id: "semester-17"
export const useCreateSubject = (semesterId: string) => {

    const {id: curriculumId} = useParams<{ id: string }>();
    const queryClient = useQueryClient();
    const {message} = App.useApp();

    const { mutate } = useCreateAtomMutation({
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: getCurriculumQueryKey(Number(curriculumId))});
            message.success("Предмет успешно создан")
        }
    });


    return (parentId?: string) => {
        console.log(parentId)
        mutate({
            name: "Новый предмет",
            type: AtomType.Subject,
            isRequired: false,
            //Формат id: "module-semester-17-123"
            parentModuleId: parentId ? Number(parentId.split("-")[3]) : null,
            semesterIds: [Number(semesterId.split("-")[1])],
            competenceIds: [],
            competenceIndicatorIds: [],
            curriculumId: Number(curriculumId),
        })
    };
}