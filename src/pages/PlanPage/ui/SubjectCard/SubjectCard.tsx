import React, {forwardRef} from 'react';
import type {UniqueIdentifier} from '@dnd-kit/core';
import cls from './SubjectCard.module.scss';
import classNames from "classnames";
import {Tag, Tooltip} from "antd";
import {AttestationType, AttestationTypeName, Subject, SubjectType} from "@/pages/PlanPage/types/Subject.ts";
import {AcademicTypes} from "@/pages/PlanPage/mocks.ts";
import {usePlan} from "@/pages/PlanPage/provider/PlanProvider.tsx";
import CommentIcon from "@/shared/assets/icons/comment.svg?react";
import Icon from "@ant-design/icons";
import CompetenceSelector from "@/pages/PlanPage/ui/CompetenceSelector.tsx";

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
        notes = [],
        ...rest
    } = props;

    const {
        displaySettings,
        selectedSubject,
        onSelectSubject
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
            onClick={() => onSelectSubject(selectedSubject?.id === props.id ? null : props)}
        >
            <div className={classNames(cls.subjectCard, cls[type], selectedSubject?.id === props.id && cls.selected)}>
                {
                    displaySettings.required &&
                    <Tooltip title={required ? "Сделать по выбору" : "Сделать обязательным"}>
                        <span className={classNames(cls.requiredIcon, required && cls.requiredIcon_selected)}>*</span>
                    </Tooltip>
                }
                <div className={cls.dragLine} {...rest}/>
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
                            <Tag color={"blue"} className={"m-0"} bordered={false}>{`${credits} ЗЕТ`}</Tag>
                    }
                    {
                        displaySettings.attestation &&
                            <Tag color={"default"} className={"m-0"} bordered={false}>{AttestationTypeName[attestation]}</Tag>
                    }
                    {
                        displaySettings.department &&
                            <Tag className={"m-0"} rootClassName={"bg-transparent"}>{department}</Tag>
                    }
                    {
                        displaySettings.notesNumber &&
                        <div className={classNames(cls.notesIcon, notes.length && cls.notesIcon_selected)}>
                            <Icon component={CommentIcon}/>
                            <span className={"text-[10px] text-stone-400"}>{notes.length ? notes.length : "+"}</span>
                        </div>
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
                    displaySettings.competencies && <CompetenceSelector competencies={competencies}/>
                }
            </div>
        </li>
    );
});
