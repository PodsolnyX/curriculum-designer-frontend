
import {ModalForm, ModalFormField, ModalProps} from "@/shared/ui/ModalForm/ModalForm.tsx";
import {useParams} from "react-router-dom";
import {AcademicActivityDto, CreateAcademicActivityDto} from "@/api/axios-client.types.ts";
import {App} from "antd";
import {useQueryClient} from "@tanstack/react-query";
import {
    getAcademicActivitiesQueryKey, useUpdateAcademicActivityMutation
} from "@/api/axios-client/AcademicActivityQuery.ts";

interface FieldType extends CreateAcademicActivityDto {}

interface EditActivityModalProps extends ModalProps {
    initialData?: AcademicActivityDto;
}

export const EditActivityModal = (props: EditActivityModalProps) => {

    const { initialData, isOpen, onClose} = props;
    const queryClient = useQueryClient();
    const {id} = useParams<{ id: string }>();
    const {message} = App.useApp();

    const {mutateAsync: editActivity, isPending: loading} = useUpdateAcademicActivityMutation(initialData?.id || 0, id || "");

    const onSubmit = async (data: FieldType) => {
        editActivity(data).then(() => {
            queryClient.invalidateQueries({queryKey: getAcademicActivitiesQueryKey(Number(id))});
            message.success("Активность успешно обновлена");
            onClose?.();
        })
    };

    const formFields: ModalFormField<FieldType>[] = [
        {
            name: "shortName",
            label: "Короткое название",
            isRequired: true,
            inputComponent: "input"
        },
        {
            name: "name",
            label: "Имя плана",
            isRequired: true,
            inputComponent: "textArea"
        }
    ];

    console.log(initialData)

    return (
        <ModalForm<FieldType>
            fields={formFields}
            onSubmit={onSubmit}
            title={"Редактирование активности"}
            buttonLabel={"Сохранить"}
            loading={loading}
            isOpen={isOpen}
            onClose={onClose}
            initialValues={initialData}
        />
    )
}
