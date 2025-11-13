import {useParams} from "react-router-dom";
import {Button, Checkbox, Skeleton, Typography} from "antd";
import {CustomValidatorDto, StructuralValidatorDto} from "@/api/axios-client.types.ts";
import {useGetValidatorsQuery} from "@/api/axios-client/ValidationQuery.ts";
import {ValidationLevelDisplay} from "@/shared/const/enumRecords.tsx";

const ValidationTab = () => {

    const {id} = useParams<{id: string}>();

    const {data: validators, isLoading}
        = useGetValidatorsQuery({curriculumId : Number(id)}, {enabled: !!id});

    return (
        <div className={"flex flex-col gap-5"}>
            <div className={"flex items-center justify-between flex-wrap gap-2"}>
                <Typography.Text className={"text-2xl"}>{"Структурные валидаторы"}</Typography.Text>
            </div>
            <div className={"flex flex-col"}>
                {
                    isLoading ? <Skeleton/> :
                    validators?.structuralValidators.map(validator =>
                        <ValidatorItem validator={validator} key={validator.id}/>
                    )
                }
            </div>
            <div className={"flex items-center justify-between flex-wrap gap-2"}>
                <Typography.Text className={"text-2xl"}>{"Настраиваемые валидаторы"}</Typography.Text>
                <Button
                    shape={"round"}
                    onClick={() => {}}
                >+ Добавить</Button>
            </div>
            <div className={"flex flex-col"}>
                {
                    isLoading ? <Skeleton/> :
                    validators?.customValidators.map(validator =>
                        <CustomValidatorItem validator={validator} key={validator.id}/>
                    )
                }
            </div>
        </div>
    )
}



interface ValidatorItemProps {
    validator: StructuralValidatorDto,
}

const ValidatorItem = ({validator}: ValidatorItemProps) => {

    return (
        <div className={"flex flex-wrap items-center rounded-md p-2 group gap-4 w-full hover:bg-stone-50"}>
            <Checkbox checked={validator.isEnabled}/>
            <div className={"flex flex-col flex-1 min-w-[300px]"}>
                {ValidationLevelDisplay[validator.level]}
                <Typography.Text>
                    {validator.name}
                </Typography.Text>
            </div>
        </div>
    )
}

interface CustomValidatorItemProps {
    validator: CustomValidatorDto,
}

const CustomValidatorItem = ({validator}: CustomValidatorItemProps) => {

    return (
        <div className={"flex flex-wrap items-center rounded-md p-2 group gap-4 w-full hover:bg-stone-50"}>
            <Checkbox checked={validator.isEnabled}/>
            <div className={"flex flex-col flex-1 min-w-[300px]"}>
                {ValidationLevelDisplay[validator.level]}
                <Typography.Text>
                    {validator.name}
                </Typography.Text>
                <Typography.Text type={"secondary"}>
                    {validator.messagePattern}
                </Typography.Text>
            </div>
            <div className={"flex flex-col gap-1 items-end"}>
                <div className={"flex gap-1 items-center"}>
                    <Typography.Text type={"secondary"}>
                        {`Формула валидации:`}
                    </Typography.Text>
                    <Typography.Text className={"bg-stone-50 tracking-wider p-1 px-2 rounded-md border border-solid border-stone-200 text-stone-800"}>
                        {validator.validationFormula}
                    </Typography.Text>
                </div>
                <div className={"flex gap-1 items-center"}>
                    <Typography.Text type={"secondary"}>
                        {`Формула фильтра:`}
                    </Typography.Text>
                    <Typography.Text className={"bg-stone-50 tracking-wider p-1 px-2 rounded-md border border-solid border-stone-200 text-stone-800"}>
                        {validator.filterFormula}
                    </Typography.Text>
                </div>
            </div>
        </div>
    )
}



export default ValidationTab