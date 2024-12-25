import {useCreateCurriculumMutation} from "@/api/axios-client/CurriculumQuery.ts";
import {ModalForm, ModalFormField, ModalProps} from "@/shared/ui/ModalForm/ModalForm.tsx";
import {useNavigate} from "react-router-dom";
import {getRoutePlan} from "@/shared/const/router.ts";
import {CreateCurriculumDto} from "@/api/axios-client.types.ts";
import {useState} from "react";
import {
    Client,
    useImportMutationWithParameters
} from "@/api/axios-client/ImportQuery.ts";

interface FieldType extends CreateCurriculumDto {
    file: File
}

export const AddPlanModal = (props: ModalProps) => {

    const {isOpen, onClose} = props;
    const navigate = useNavigate();

    const [file, setFile] = useState<File | null>(null);
    const [loadingFile, setLoadingFile] = useState(false);

    const addPlan = useCreateCurriculumMutation();

    const importPlan = useImportMutationWithParameters();

    const onSubmit = async (data: FieldType) => {

        const newPlanId = await addPlan.mutateAsync(data);

        if (file) {
            setLoadingFile(true);
            await Client.import_(newPlanId, {
                data: file,
                fileName: "file"
            })
            setLoadingFile(false);
        }

        navigate(getRoutePlan(newPlanId))
    }

    const formFields = [
        {
            name: "name",
            label: "Имя плана",
            isRequired: true,
            inputComponent: "input"
        },
        {
            name: "semesterCount",
            label: "Количество семестров",
            isRequired: true,
            inputComponent: "inputNumber"
        },
        {
            name: "file",
            label: "Файл плана в формате .plx",
            inputComponent: "input",
            customInput: <input
                type={"file"}
                className={"w-full"}
                onChange={event => setFile(event.target?.files[0])}
            />
        }
    ] as ModalFormField<FieldType>[];

    return (
        <ModalForm<FieldType>
            fields={formFields}
            onSubmit={onSubmit}
            title={"Добавление плана"}
            buttonLabel={"Добавить"}
            loading={addPlan.isPending || loadingFile}
            isOpen={isOpen}
            onClose={onClose}
            initialValues={{semesterCount: 8}}
        />
    )
}
