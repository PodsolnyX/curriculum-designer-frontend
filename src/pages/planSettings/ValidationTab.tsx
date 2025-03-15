import {useParams} from "react-router-dom";
import {useQueryClient} from "@tanstack/react-query";
import {App, Button, Skeleton, Typography} from "antd";
import React, {useState} from "react";
import {AcademicActivityDto, ValidatorDto} from "@/api/axios-client.types.ts";
import {
    getAcademicActivitiesQueryKey,
    useDeleteAcademicActivityMutationWithParameters,
} from "@/api/axios-client/AcademicActivityQuery.ts";
import {useGetValidatorsQuery} from "@/api/axios-client/ValidationQuery.ts";

const ValidationTab = () => {

    const {id} = useParams<{id: string}>();

    const queryClient = useQueryClient();
    const {message} = App.useApp();

    const [openAdd, setOpenAdd] = useState(false);
    const [editActivity, setEditActivity] = useState<AcademicActivityDto | undefined>(undefined);

    const {data: validators, isLoading}
        = useGetValidatorsQuery({curriculumId : Number(id)}, {enabled: !!id});

    const {mutate: removeActivity} = useDeleteAcademicActivityMutationWithParameters({
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: getAcademicActivitiesQueryKey(Number(id))});
            message.success("Активность удалена");
        }
    });

    console.log(isLoading);

    return (
        <div className={"flex flex-col gap-5"}>
            <div className={"flex items-center justify-between flex-wrap gap-2"}>
                <Typography.Text className={"text-2xl"}>{"Валидаторы"}</Typography.Text>
                <Button
                    shape={"round"}
                    onClick={() => setOpenAdd(true)}
                >+ Добавить</Button>
            </div>
            <div className={"flex flex-col"}>
                {
                    isLoading ? <Skeleton/> :
                    validators?.map(validator =>
                        <ValidatorItem
                            validator={validator}
                            key={validator.id}
                        />
                    )
                }
            </div>
        </div>
    )
}

interface ValidatorItemProps {
    validator: ValidatorDto,
}

const ValidatorItem = ({validator}: ValidatorItemProps) => {

    return (
        <div className={"flex items-center rounded-md p-2 group gap-2 w-full hover:bg-stone-50"}>
            <div className={"flex flex-col flex-1"}>
                <Typography.Text type={"secondary"} className={"text-sm"}>
                    {`${validator.iterationType} • ${validator.messagePattern}`}
                </Typography.Text>
                <Typography.Text>
                    {validator.name}
                </Typography.Text>
            </div>
            {
                validator?.validationFormula &&
                <Typography.Text className={"bg-stone-50 tracking-wider p-1 px-2 rounded-md border border-solid border-stone-200 text-stone-800"}>
                    {validator.validationFormula }
                </Typography.Text>
            }
            {
                validator?.filterFormula &&
                <Typography.Text className={"bg-stone-50 tracking-wider p-1 px-2 rounded-md border border-solid border-stone-200 text-stone-800"}>
                    {validator.filterFormula }
                </Typography.Text>
            }
            {/*<EditOutlined*/}
            {/*    onClick={() => onEdit()}*/}
            {/*    className={"text-stone-400 hover:text-stone-500 cursor-pointer hidden group-hover:block"}*/}
            {/*/>*/}
            {/*<Popconfirm*/}
            {/*    title={"Вы хотите удалить активность?"}*/}
            {/*    onConfirm={() => onRemove()}*/}
            {/*>*/}
            {/*    <CloseOutlined className={"text-stone-400 hover:text-red-500 cursor-pointer hidden group-hover:block"}/>*/}
            {/*</Popconfirm>*/}
        </div>
    )
}

export default ValidationTab