import {Select, Tag, Typography} from "antd";
import {ValidationError, ValidationErrorType} from "@/api/axios-client.types.ts";
import {useState} from "react";
import {useControls} from "react-zoom-pan-pinch";
import {concatIds, setPrefixToId} from "@/pages/planPage/lib/helpers/prefixIdHelpers.ts";
import {commonStore} from "@/pages/planPage/lib/stores/commonStore.ts";

const ValidationContent = () => {

    const [filters, setFilters] = useState<ValidationErrorType[]>([]);

    const {zoomToElement} = useControls()

    const data = commonStore.validationErrors?.filter(error => filters.length === 0 || filters.includes(error!!.type));

    const scrollToTarget = (error: ValidationError) => {

        const Entities: Record<string, string> = {
            "Semester": "semesters",
            "Module": "modules",
            "Atom": "subjects",
        }
        if (!error.entities) return;

        const targetId = error.entities?.reduce((prev, current) => {
            return prev ? concatIds(setPrefixToId(Number(current.id), Entities[current.type]), prev) : setPrefixToId(Number(current.id), Entities[current.type]);
        }, "");
        if (!targetId) return;

        zoomToElement(document.getElementById(targetId));
    };

    return (
        <div className={"flex flex-col gap-2 h-full"}>
            <div className={"flex flex-col gap-1"}>
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
            </div>
            {
                data?.length ?
                    <ul className={"flex flex-1 flex-col overflow-y-auto scrollbar"}>
                        {
                            data?.map((error, index) =>
                                <li
                                    key={index}
                                    className={"flex flex-col bg-white hover:bg-stone-100 p-2 transition rounded-md cursor-pointer"}
                                    onClick={() => scrollToTarget(error)}
                                >
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