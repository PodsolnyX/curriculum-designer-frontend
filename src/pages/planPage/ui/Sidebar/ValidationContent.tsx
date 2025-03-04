import {usePlan} from "@/pages/planPage/provider/PlanProvider.tsx";
import {Select, Tag, Typography} from "antd";
import {ValidationErrorType} from "@/api/axios-client.types.ts";
import {useState} from "react";

const ValidationContent = () => {

    const {validationErrors} = usePlan();

    const [filters, setFilters] = useState<ValidationErrorType[]>([]);

    console.log(validationErrors)

    const data = validationErrors?.filter(error => filters.length === 0 || filters.includes(error!!.type));

    return (
        <div className={"flex flex-col gap-2"}>
            <Typography.Text className={"text-xl"}>Ошибки валидации</Typography.Text>
            <Select
                size={"small"}
                placeholder={"Тип ошибки"}
                mode={"multiple"}
                value={filters}
                onChange={setFilters}
                options={Object.keys(ValidationErrorType)
                    .map(key => {
                        return {label: ValidationErrorTypeTitle[key], value: key}
                    })}
            />
            {
                data.length ?
                    <ul>
                        {
                            data.map((error, index) =>
                                <li key={index} className={"flex flex-col hover:bg-stone-100 p-2 rounded-md"}>
                                    <Tag className={"w-max"} color={"red"}>{ValidationErrorTypeTitle[error.type]}</Tag>
                                    <Typography.Text>{error.message}</Typography.Text>
                                </li>
                            )
                        }
                    </ul>
                    :
                    <Typography.Text className={"text-stone-400 mt-28 whitespace-break-spaces text-center"}>
                        {"Ошибки отсутствуют или \n не обнаружены"}
                    </Typography.Text>
            }

        </div>
    )
}

const ValidationErrorTypeTitle: Record<ValidationErrorType, string> = {
    [ValidationErrorType.Custom]: "Неизвестная ошибка",
    [ValidationErrorType.CreditDistribution]: "Распределение ЗЕТ",
    [ValidationErrorType.AcademicActivityFormula]: "Распределение часов"
}

export default ValidationContent;