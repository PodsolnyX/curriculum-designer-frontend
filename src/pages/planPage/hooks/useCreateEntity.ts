import {usePlan} from "@/pages/planPage/provider/PlanProvider.tsx";
import {useParams} from "react-router-dom";
import {useQueryClient} from "@tanstack/react-query";
import {App} from "antd";
import {getModulesByCurriculumQueryKey, useCreateModuleMutation} from "@/api/axios-client/ModuleQuery.ts";
import {getAtomsByCurriculumQueryKey, useCreateAtomMutation} from "@/api/axios-client/AtomQuery.ts";
import {AtomType} from "@/api/axios-client.types.ts";
import {useCreateUpdateSelectionMutationWithParameters} from "@/api/axios-client/SelectionQuery.ts";

export const useCreateEntity = () => {
    const {toolsOptions} = usePlan();

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

    const {mutateAsync: createModule} = useCreateModuleMutation();

    const {mutate: updateSelection} = useCreateUpdateSelectionMutationWithParameters({
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: getModulesByCurriculumQueryKey(Number(curriculumId))});
            message.success("Выбор успешно создан")
        }
    });

    const onCreate = (semesterId: string, parentId?: string) => {
        if (toolsOptions.selectedCreateEntityType === "subjects")
            createSubject({
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
        else if (toolsOptions.selectedCreateEntityType === "modules")
            createModule({
                name: "Новый модуль",
                curriculumId: Number(curriculumId),
                parentModuleId: parentId ? Number(parentId.split("-")[3]) : null,
                parentSemesterId: Number(semesterId.split("-")[1]),
            }).then(() => {
                queryClient.invalidateQueries({queryKey: getModulesByCurriculumQueryKey(Number(curriculumId))});
                message.success("Модуль успешно создан")
            })
        else if (toolsOptions.selectedCreateEntityType === "selections")
            createModule({
                name: "Новый выбор",
                curriculumId: Number(curriculumId),
                parentModuleId: parentId ? Number(parentId.split("-")[3]) : null,
                parentSemesterId: Number(semesterId.split("-")[1]),
            }).then((newModuleId) => updateSelection({
                moduleId: newModuleId,
                createUpdateSelectionDto: {
                    semesters: [
                        {
                            semesterId: Number(semesterId.split("-")[1]),
                            credit: 0
                        }
                    ]
                }
            }))
    }

    return {onCreate}
}