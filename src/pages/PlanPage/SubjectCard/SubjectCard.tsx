import React, {forwardRef} from 'react';
import type {UniqueIdentifier} from '@dnd-kit/core';
import cls from './SubjectCard.module.scss';
import classNames from "classnames";
import {Tag} from "antd";
import {Subject, SubjectType} from "@/pages/PlanPage/types/Subject.ts";

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
        attestation = "test",
        required = false,
        index = "",
        department = 0,
        type = SubjectType.Subject,
        notesNumber = 0,
        academicHours = [],
        competencies = [],
        ...rest
    } = props;

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
            <div
                className={classNames(
                    cls.subjectCard,
                    cls[type],
                )}
                 {...props}>
                <div>
                    {/*<span>{index}</span>*/}
                    <div className={"text-black text-[14px] line-clamp-2 min-h-[42px]"}>
                        {name}
                    </div>
                </div>
                <div className={"flex gap-1"}>
                    <Tag color={"blue"} className={"m-0"}>{`${credits} ЗЕТ`}</Tag>
                    <Tag color={"default"} className={"m-0"}>{attestation}</Tag>
                    <Tag className={"m-0"}>{department}</Tag>
                </div>
            </div>
        </li>
    );
});
