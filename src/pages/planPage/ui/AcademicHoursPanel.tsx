import React from "react";
import {IHoursDistributionDto} from "@/api/axios-client.ts";
import {Popover, Tooltip} from "antd";

interface AcademicHoursPanelProps {
    credits: number;
    academicHours: IHoursDistributionDto[];
    size?: "small" | "large";
}

const AcademicHoursPanel = ({credits, academicHours, size = "small"}: AcademicHoursPanelProps) => {

    const sumAcademicHours = academicHours.reduce((_sum, type) => _sum + type.value, 0);

    const textSize = size === "small" ? "text-[10px]" : "text-[12px]";
    const isFullHours = sumAcademicHours === credits * 36;

    return (
        <div className={"flex flex-col gap-1"}>
            <div className={"grid grid-cols-2 gap-1"}>
                {
                    academicHours.map((type, index) =>
                        <div key={type.academicActivity.id} className={`flex justify-between border-2 border-solid border-stone-100 rounded-md ${(index === academicHours.length - 1 && academicHours.length % 2 === 1) ? 'col-span-2' : ''}`}>
                            <Tooltip title={type.academicActivity.name}>
                                <div className={`bg-stone-100 pr-1 text-stone-600 ${textSize}`}>
                                    {type.academicActivity.shortName}
                                </div>
                            </Tooltip>
                            <div className={`${textSize} pr-1`}>{type.value}</div>
                        </div>
                    )
                }
            </div>
            <div className={`flex justify-between border-2 border-solid ${isFullHours ? "border-lime-200" : "border-stone-100"} rounded-md`}>
                <div className={`${isFullHours ? "bg-lime-200 text-lime-800" : "bg-stone-100 text-stone-600"} pr-1 ${textSize}`}>
                    {"Всего"}
                </div>
                <div className={`${isFullHours ? "text-lime-800" : "text-stone-600"} ${textSize} pr-1`}>
                    {`${sumAcademicHours}/${credits*36}`}
                </div>
            </div>
        </div>
    )
}

export default AcademicHoursPanel;