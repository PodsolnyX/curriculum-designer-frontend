import {useParams} from "react-router-dom";
import {useQueryClient} from "@tanstack/react-query";
import {App} from "antd";
import {
    getModulesByCurriculumQueryKey,
    useCreateModuleMutation,
    useCreateModuleWithSelectionMutation
} from "@/api/axios-client/ModuleQuery.ts";
import {getAtomsByCurriculumQueryKey, useCreateAtomMutation} from "@/api/axios-client/AtomQuery.ts";
import {AtomType} from "@/api/axios-client.types.ts";
import {optionsStore} from "@/pages/planPage/lib/stores/optionsStore.ts";

export const useCreateEntity = () => {

    const {id: curriculumId} = useParams<{ id: string }>();
    const queryClient = useQueryClient();
    const {message} = App.useApp();

    const {mutate: createSubject} = useCreateAtomMutation({
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: getAtomsByCurriculumQueryKey(Number(curriculumId))});
            queryClient.invalidateQueries({queryKey: getModulesByCurriculumQueryKey(Number(curriculumId))});
            message.success("Предмет успешно создан")
        }
    });

    const {mutateAsync: createModule} = useCreateModuleMutation({
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: getModulesByCurriculumQueryKey(Number(curriculumId))});
            message.success("Модуль успешно создан")
        }
    });
    const {mutateAsync: createSelection} = useCreateModuleWithSelectionMutation({
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: getModulesByCurriculumQueryKey(Number(curriculumId))});
            message.success("Выбор успешно создан")
        }
    });

    const onCreate = (semesterId: number, parentId?: number) => {
        if (optionsStore.toolsOptions.selectedCreateEntityType === "subjects")
            createSubject({
                name: "Новый предмет",
                type: AtomType.Subject,
                isRequired: false,
                parentModuleId: parentId || null,
                semesterIds: [semesterId],
                competenceIds: [],
                competenceIndicatorIds: [],
                curriculumId: Number(curriculumId),
            })
        else if (optionsStore.toolsOptions.selectedCreateEntityType === "modules")
            createModule({
                name: "Новый модуль",
                curriculumId: Number(curriculumId),
                parentModuleId: parentId || null,
                parentSemesterId: semesterId,
            }).then(() => {
                queryClient.invalidateQueries({queryKey: getModulesByCurriculumQueryKey(Number(curriculumId))});
                message.success("Модуль успешно создан")
            })
        else if (optionsStore.toolsOptions.selectedCreateEntityType === "selections")
            createSelection({
                module: {
                    name: "Новый выбор",
                    curriculumId: Number(curriculumId),
                    parentModuleId: parentId || null,
                    parentSemesterId: semesterId
                },
                selection: {
                    semesters: [
                        {
                            semesterId: semesterId,
                            credit: 0
                        }
                    ]
                }
            })
    }

    return {onCreate}
}