import React, {forwardRef} from 'react';
import type {UniqueIdentifier} from '@dnd-kit/core';
import cls from './SubjectCard.module.scss';
import classNames from "classnames";
import {Tag, Tooltip} from "antd";
import {AttestationType, AttestationTypeName, Subject, SubjectType} from "@/pages/PlanPage/types/Subject.ts";
import {AcademicTypes} from "@/pages/PlanPage/mocks.ts";
import {usePlan} from "@/pages/PlanPage/provider/PlanProvider.tsx";

export enum Position {
    Before = -1,
    After = 1,
}

export interface SubjectCardProps extends Subject {
    id: UniqueIdentifier;
    active?: boolean;
    clone?: boolean;
    insertPosition?: Position;
}

export const SubjectCard = forwardRef<HTMLLIElement, SubjectCardProps>(function SubjectCard(props, ref) {

    const {
        id,
        active,
        clone,
        insertPosition,
        style,
        name = "",
        credits = 0,
        attestation = AttestationType.Test,
        required = false,
        index = "Без индекса",
        department = "-",
        type = SubjectType.Subject,
        notesNumber = 0,
        semesterOrder,
        academicHours = [],
        competencies = [],
        ...rest
    } = props;

    const {
        displaySettings
    } = usePlan();

    const getSumAcademicHours = (): number => {
        return academicHours.reduce((_sum, type) => _sum + type.value, 0)
    }

    return (
        <li
            className={classNames(
                cls.subjectCardWrapper,
                active && cls.active,
                clone && cls.clone,
                insertPosition === Position.Before && cls.insertBefore,
                insertPosition === Position.After && cls.insertAfter
            )}
            style={style}
            ref={ref}
        >
            <div className={classNames(cls.subjectCard, cls[type])}>
                {
                    displaySettings.required &&
                    <Tooltip title={required ? "Сделать по выбору" : "Сделать обязательным"}>
                        <span className={classNames(cls.requiredIcon, required && cls.requiredIcon_selected)}>*</span>
                    </Tooltip>
                }
                <div className={cls.dragLine} {...props}/>
                <div className={"flex flex-col flex-1"}>
                    <div className={"flex gap-1 items-center"}>
                        {
                            displaySettings.index &&
                            <span className={"text-[10px] text-stone-400"}>{index}</span>
                        }
                        {
                            (displaySettings.index && semesterOrder)
                                && <span className={"text-[8px] text-stone-400"}>•</span>
                        }
                        {
                            semesterOrder &&
                            <span className={"text-[10px] text-blue-500"}>{`Семестр: ${semesterOrder}`}</span>
                        }
                    </div>
                    <div className={"text-black text-[12px] line-clamp-2 min-h-[36px]"}>
                        {name}
                    </div>
                </div>
                <div className={"flex gap-1"}>
                    {
                        displaySettings.credits &&
                            <Tag color={"blue"} className={"m-0 text-[10px]"} bordered={false}>{`${credits} ЗЕТ`}</Tag>
                    }
                    {
                        displaySettings.attestation &&
                            <Tag color={"default"} className={"m-0 text-[10px]"} bordered={false}>{AttestationTypeName[attestation]}</Tag>
                    }
                    {
                        displaySettings.department &&
                            <Tag className={"m-0"} rootClassName={"bg-transparent text-[10px]"}>{department}</Tag>
                    }
                </div>
                {
                    displaySettings.academicHours &&
                        <div className={"flex flex-col gap-1"}>
                            <div className={"grid grid-cols-2 gap-1"}>
                                {
                                    AcademicTypes.map(type =>
                                        <div key={type.key} className={"flex justify-between border-2 border-solid border-stone-100 rounded-md"}>
                                            <div className={"bg-stone-100 pr-1 text-stone-600 text-[10px]"}>{type.name}</div>
                                            <div className={"text-[10px] pr-1"}>{academicHours.find(_type => _type.key === type.key)?.value || 0}</div>
                                        </div>
                                    )
                                }
                            </div>
                            <div className={"flex justify-between border-2 border-solid border-stone-100 rounded-md"}>
                                <div className={"bg-stone-100 pr-1 text-stone-600 text-[10px]"}>{"Всего"}</div>
                                <div className={"text-[10px] pr-1"}>{`${getSumAcademicHours()}/${credits*36}`}</div>
                            </div>
                        </div>
                }
                {
                    displaySettings.competencies &&
                        <div className={`flex flex-wrap gap-1 group items-center ${!competencies.length ? "justify-between": ""}`}>
                            {
                                competencies.length ?
                                    competencies.map(competence =>
                                        <Tag color={"default"} className={"m-0"} bordered={false} key={competence.value}>{competence.name}</Tag>
                                    ) : <span className={"text-[10px] text-stone-400"}>Нет компетенций</span>
                            }
                            <Tag color={"default"} className={"m-0 group-hover:opacity-100 opacity-0 cursor-pointer min-w-10 text-center text-stone-400"} bordered={false}>+</Tag>
                        </div>
                }
            </div>
        </li>
    );
});
