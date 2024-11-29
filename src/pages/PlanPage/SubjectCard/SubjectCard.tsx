import React, {forwardRef} from 'react';
import type {UniqueIdentifier} from '@dnd-kit/core';
import cls from './SubjectCard.module.scss';
import classNames from "classnames";
import {Tag} from "antd";

export enum Position {
    Before = -1,
    After = 1,
}

export type SubjectType = "subject" | "practice" | "stateCertification" | "elective";
export type AttestationType = "test" | "assessmentTest" | "exam";

export interface Subject {
    id: UniqueIdentifier;
    name?: string;
    credits?: number;
    attestation?: AttestationType;
    required?: boolean;
    _index?: string;
    department?: number;
    type?: SubjectType;
    notesNumber?: number;
    academicHours?: { key: string, name: string, value: number }[];
    competencies?: { value: string, name: string }[];
}

export interface SubjectCardProps extends Subject {
    id: UniqueIdentifier;
    index?: number;
    active?: boolean;
    clone?: boolean;
    insertPosition?: Position;
}

export const SubjectCard = forwardRef<HTMLLIElement, SubjectCardProps>(function Page(props, ref) {

    const {
        id,
        index,
        active,
        clone,
        insertPosition,
        style,
        name = "",
        credits = 0,
        attestation = "test",
        required = false,
        _index = "",
        department = 0,
        type = "subject",
        notesNumber = 0,
        academicHours = [],
        competencies = [],
        ...rest
    } = props

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
            <div className={cls.subjectCard} {...props}>
                <div>
                    <span>{_index}</span>
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
