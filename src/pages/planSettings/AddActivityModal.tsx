
import {ModalForm, ModalFormField, ModalProps} from "@/shared/ui/ModalForm/ModalForm.tsx";
import {useParams} from "react-router-dom";
import {CreateAcademicActivityDto} from "@/api/axios-client.types.ts";
import {App} from "antd";
import {useQueryClient} from "@tanstack/react-query";
import {
    getAcademicActivitiesQueryKey,
    useCreateAcademicActivityMutation
} from "@/api/axios-client/AcademicActivityQuery.ts";

interface FieldType extends CreateAcademicActivityDto {}

export const AddActivityModal = (props: ModalProps) => {

    const {isOpen, onClose} = props;
    const queryClient = useQueryClient();
    const {id} = useParams<{ id: string }>();
    const {message} = App.useApp();

    const {mutateAsync: addActivity, isPending: loading} = useCreateAcademicActivityMutation(Number(id));

    const onSubmit = async (data: FieldType) => {
        addActivity(data).then(() => {
            queryClient.invalidateQueries({queryKey: getAcademicActivitiesQueryKey(Number(id))});
            message.success("Активность успешно добавлена");
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

    return (
        <ModalForm<FieldType>
            fields={formFields}
            onSubmit={onSubmit}
            title={"Добавление активности"}
            buttonLabel={"Добавить"}
            loading={loading}
            isOpen={isOpen}
            onClose={onClose}
        />
    )
}
