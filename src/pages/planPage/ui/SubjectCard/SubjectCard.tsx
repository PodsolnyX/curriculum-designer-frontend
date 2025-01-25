import React, {forwardRef, memo, useRef} from 'react';
import cls from './SubjectCard.module.scss';
import classNames from "classnames";
import {Tag, Tooltip, Typography} from "antd";
import {Subject} from "@/pages/planPage/types/Subject.ts";
import {usePlan} from "@/pages/planPage/provider/PlanProvider.tsx";
import CommentIcon from "@/shared/assets/icons/comment.svg?react";
import Icon from "@ant-design/icons";
import CompetenceSelector from "@/pages/planPage/ui/CompetenceSelector.tsx";
import AttestationTypeSelector from "@/pages/planPage/ui/AttestationTypeSelector.tsx";
import CreditsSelector from "@/pages/planPage/ui/CreditsSelector.tsx";
import CommentsPopover from "@/pages/planPage/ui/CommentsPopover.tsx";
import {AtomType,} from "@/api/axios-client.ts";
import AcademicHoursPanel from "@/pages/planPage/ui/AcademicHoursPanel.tsx";

export enum Position {
    Before = -1,
    After = 1,
}

export interface SubjectCardProps extends Subject {
    active?: boolean;
    clone?: boolean;
    credits?: number;
    insertPosition?: Position;
}

export const SubjectCardMemo =
    forwardRef<HTMLLIElement, SubjectCardProps>((props, ref) => {
        const {
            id,
            active,
            clone,
            insertPosition,
            parentModuleId,
            name = "",
            index = "Без индекса",
            department = "-",
            semesterOrder,
            isRequired = false,
            type = AtomType.Subject,
            academicHours = [],
            credits = 0,
            competencies = [],
            attestation = [],
            notes = [],
            ...rest
        } = props;

        const {
            displaySettings,
            selectedSubject,
            onSelectSubject
        } = usePlan();

        const refScroll = useRef<HTMLDivElement | null>(null);

        return (
            <li
                className={classNames(
                    cls.subjectCardWrapper,
                    active && cls.active,
                    clone && cls.clone,
                    insertPosition === Position.Before && cls.insertBefore,
                    insertPosition === Position.After && cls.insertAfter
                )}
                // style={{
                //     pointerEvents: toolsOptions.editMode ? "none" : "auto",
                // }}
                ref={ref}
                onClick={() => onSelectSubject(props.id)}
            >
                <div
                    ref={refScroll}
                    className={classNames(cls.subjectCard, cls[type], String(selectedSubject?.id) === String(props.id) && cls.selected)}>
                    {
                        displaySettings.required &&
                        <Tooltip title={isRequired ? "Сделать по выбору" : "Сделать обязательным"}>
                            <span
                                onClick={(event) => event.stopPropagation()}
                                className={classNames(cls.requiredIcon, isRequired && cls.requiredIcon_selected)}
                            >*</span>
                        </Tooltip>
                    }
                    <div  className={cls.dragLine} {...rest}/>
                    <div className={"flex flex-col flex-1"} onClick={(event) => event.stopPropagation()}>
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
                        <Typography.Text
                            editable={{icon: null, triggerType: ["text"]}}
                            className={"text-black text-[12px] line-clamp-2 min-h-[36px] cursor-text"}
                        >
                            {name}
                        </Typography.Text>
                    </div>
                    <div className={"flex gap-1"}>
                        {
                            displaySettings.credits && <CreditsSelector credits={credits}/>
                        }
                        {
                            displaySettings.attestation && <AttestationTypeSelector attestation={attestation}/>
                        }
                        {
                            displaySettings.department &&
                            <Tag className={"m-0"} rootClassName={"bg-transparent"}>{department}</Tag>
                        }
                        {
                            displaySettings.notesNumber &&
                            <CommentsPopover comments={notes}>
                                <div
                                    className={classNames(cls.notesIcon, notes.length && cls.notesIcon_selected)}
                                    onClick={(event) => event.stopPropagation()}
                                >
                                    <Icon component={CommentIcon}/>
                                    <span
                                        className={"text-[10px] text-stone-400"}>{notes.length ? notes.length : "+"}</span>
                                </div>
                            </CommentsPopover>
                        }
                    </div>
                    {
                        displaySettings.academicHours &&
                        <AcademicHoursPanel credits={credits} academicHours={academicHours}/>
                    }
                    {
                        displaySettings.competencies && <CompetenceSelector competencies={competencies}/>
                    }
                </div>
            </li>
        );
    })

export const SubjectCard = memo(SubjectCardMemo);