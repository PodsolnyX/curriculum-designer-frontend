import React, {memo, useState} from "react";
import {AcademicActivityDto, HoursDistributionDto} from "@/api/axios-client.ts";
import {Button, InputNumber, List, Popover, Tooltip} from "antd";
import {usePlan} from "@/pages/planPage/provider/PlanProvider.tsx";
import {
    CloseOutlined,
    PlusOutlined
} from "@ant-design/icons";

interface AcademicHoursPanelProps {
    credits: number;
    academicHours: HoursDistributionDto[];
    size?: "small" | "large";
    layout?: "horizontal" | "vertical";
    showAllActivities?: boolean;
    onChange?(activityId: number, value: number): void;
    onAdd?(activityId: number): void;
    onRemove?(activityId: number): void;
}

const AcademicHoursPanel = memo((props: AcademicHoursPanelProps) => {

    const {
        credits,
        academicHours,
        size = "small",
        layout = "vertical",
        showAllActivities,
        onChange,
        onAdd,
        onRemove
    } = props;

    const {academicActivity} = usePlan();

    const sumAcademicHours = roundToTwo(academicHours.reduce((_sum, type) => _sum + type.value, 0));

    const textSize = size === "small" ? "text-[10px]" : "text-[12px]";
    const isFullHours = sumAcademicHours === credits * 36;
    const isMoreHours = sumAcademicHours > credits * 36;

    return (
        <div className={layout === "vertical" ? "flex flex-col gap-1 group/panel" : "flex items-center flex-row-reverse gap-1"}
             onClick={(event) => event.stopPropagation()}>
            <div className={layout === "vertical" ? "grid grid-cols-2 gap-1" : "flex gap-1"}>
                {
                    showAllActivities
                        ? academicActivity.map((activity, index) => {
                                const academicHour = academicHours.find(hour => hour.academicActivity.id === activity.id);
                                return (
                                    <AcademicActivityItem
                                        key={activity.id}
                                        academicActivity={activity}
                                        value={academicHour?.value || 0}
                                        index={index}
                                        academicActivityLength={academicActivity.length}
                                        textSize={textSize}
                                        onChange={(value) => onChange && onChange(activity.id, value)}
                                        onRemove={() => onRemove && onRemove(activity.id)}
                                    />
                                )
                            }
                        )
                        : academicHours.map((type, index) =>
                            <AcademicActivityItem
                                key={type.academicActivity.id}
                                academicActivity={type.academicActivity}
                                value={type.value}
                                index={index}
                                academicActivityLength={academicHours.length}
                                textSize={textSize}
                                onChange={(value) => onChange && onChange(type.academicActivity.id, value)}
                                onRemove={() => onRemove && onRemove(type.academicActivity.id)}
                            />
                        )
                }
            </div>
            {
                academicHours.length !== academicActivity.length &&
                <Popover
                    trigger={"click"}
                    placement={"right"}
                    overlayInnerStyle={{padding: 0}}
                    content={
                        <List
                            size="small"
                            itemLayout={"vertical"}
                            dataSource={
                                academicActivity
                                    ? academicActivity
                                        .filter(activity => !academicHours
                                            .map(hour => hour.academicActivity.id).includes(activity.id))
                                        .map(activity => {
                                            return {
                                                key: activity.id,
                                                label: activity.shortName
                                            }
                                        })
                                    : []
                            }
                            renderItem={(item) =>
                                <li className={"w-full"}>
                                    <Button
                                        type={"text"}
                                        size={"small"}
                                        className={"w-full text-start justify-start"}
                                        onClick={() => onAdd && onAdd(item.key)}
                                        icon={<PlusOutlined className={"text-stone-400"}/>}
                                    >
                                        {item.label}
                                    </Button>
                                </li>
                            }
                        />
                    }
                >
                    <div className={`hidden group-hover/panel:flex ${textSize} text-center justify-center hover:bg-stone-200/[.5] rounded py-0.5`}>
                        Добавить активность +
                    </div>
                </Popover>
            }
            <div
                className={`flex justify-between rounded ${isFullHours ? "bg-[#f6ffed]" : isMoreHours ? "bg-[#fff1f0]" : "bg-[#fafafa]"}`}>
                <div
                    className={`${isFullHours ? "text-[#389e0d]" : isMoreHours ? "text-[#cf1322]" : "text-stone-600"} px-1 ${textSize}`}>
                    {"Всего:"}
                </div>
                <div
                    className={`${isFullHours ? "text-[#389e0d]" : isMoreHours ? "text-[#cf1322]" : "text-stone-600"} ${textSize} pr-1`}>
                    {`${sumAcademicHours}/${credits * 36}`}
                </div>
            </div>
        </div>
    )
})

interface AcademicActivityItemProps {
    academicActivity: AcademicActivityDto;
    value: number;
    index: number;
    academicActivityLength: number;
    textSize?: string;
    onChange?(value: number): void;
    onRemove?(): void;
}

const AcademicActivityItem = (props: AcademicActivityItemProps) => {

    const {
        academicActivity,
        value,
        academicActivityLength,
        index,
        textSize = "text-[12px]",
        onChange,
        onRemove
    } = props;

    const [isEdit, setIsEdit] = useState(false);
    const [newValue, setNewValue] = useState(value || 0);

    const onSaveValue = () => {
        setIsEdit(false);
        (onChange && newValue !== value) && onChange(newValue);
    };

    return (
        <div
            onClick={() => setIsEdit(true)}
            className={`relative flex justify-between items-center border border-solid group hover:border-blue-400 ${isEdit ? "border-blue-400" : "border-stone-100"} gap-1 rounded-md ${(index === academicActivityLength - 1 && academicActivityLength % 2 === 1) ? 'col-span-2' : ''}`}
        >
            <Tooltip title={academicActivity.name}>
                <div
                    className={`${isEdit ? "bg-blue-400 text-white" : "bg-stone-100 text-stone-600"} group-hover:bg-blue-400 group-hover:text-white bg-stone-100 px-0.5 h-full flex items-center rounded-l ${textSize}`}>
                    {academicActivity.shortName}
                </div>
            </Tooltip>
            <div className={`${textSize} pr-1 overflow-x-hidden text-ellipsis`}>{roundToTwo(value)}</div>
            {
                isEdit && <InputNumber
                    size={"small"}
                    value={newValue}
                    onChange={(value) => setNewValue(Number(value))}
                    onBlur={() => onSaveValue()}
                    className={`absolute top-0 left-0 bg-white z-50 w-48`}
                    addonBefore={academicActivity.shortName}
                    autoFocus={true}
                    onKeyDown={(event) => {
                        if (event.key === "Enter") onSaveValue()
                    }}
                />
            }
            <Button
                icon={<CloseOutlined/>}
                size={"small"}
                shape={"circle"}
                color={"default"}
                className={"absolute right-[-25px] opacity-0 group-hover:opacity-100 text-stone-400 z-20"}
                onClick={() => onRemove && onRemove()}
            />
        </div>
    )
}

function roundToTwo(num: number): number {
    return parseFloat(num.toFixed(2));
}

export default AcademicHoursPanel;