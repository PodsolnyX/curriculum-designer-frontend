import React, {forwardRef, memo, useRef, useState} from 'react';
import cls from './SubjectCard.module.scss';
import classNames from "classnames";
import {Badge, Button, List, Popover, Tag, Tooltip, Typography} from "antd";
import {Subject} from "@/pages/planPage/types/Subject.ts";
import {usePlan} from "@/pages/planPage/provider/PlanProvider.tsx";
import CommentIcon from "@/shared/assets/icons/comment.svg?react";
import OptionIcon from "@/shared/assets/icons/more.svg?react";
import Icon, {
    CaretRightOutlined,
    DeleteOutlined,
    DownOutlined,
    PlusOutlined,
    TagOutlined,
    UpOutlined
} from "@ant-design/icons";
import CompetenceSelector from "@/pages/planPage/ui/CompetenceSelector.tsx";
import AttestationTypeSelector from "@/pages/planPage/ui/AttestationTypeSelector.tsx";
import CreditsSelector from "@/pages/planPage/ui/CreditsSelector.tsx";
import CommentsPopover from "@/pages/planPage/ui/CommentsPopover.tsx";
import {AtomType} from "@/api/axios-client.ts";
import AcademicHoursPanel from "@/pages/planPage/ui/AcademicHoursPanel.tsx";
import {useEditSubject} from "@/pages/planPage/hooks/useEditSubject.ts";
import {AtomTypeFullName} from "@/pages/planPage/const/constants.ts";
import {getIdFromPrefix} from "@/pages/planPage/provider/parseCurriculum.ts";

export enum Position {
    Before = -1,
    After = 1,
}

export interface SubjectCardProps extends Subject {
    active?: boolean;
    clone?: boolean;
    credits?: number;
    insertPosition?: Position;
    isReplaceMode?: boolean;
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
            department,
            semesterOrder,
            isRequired = false,
            type = AtomType.Subject,
            academicHours = [],
            credits = 0,
            competencies = [],
            attestation = [],
            notes = [],
            semesterId = "",
            semestersIds= [],
            neighboringSemesters,
            isReplaceMode,
            ...rest
        } = props;

        const {
            displaySettings,
            selectedSubject,
            updateSubject,
            onSelectSubject
        } = usePlan();

        const refScroll = useRef<HTMLDivElement | null>(null);
        const [newName, setNewName] = useState(props.name);

        const {expandSubject, deleteSubject} = useEditSubject(id);
        
        const onExtendSemester = (key: "prev" | "next") => {
            expandSubject({
                atomId: Number(getIdFromPrefix(id)),
                semesterId: key === "prev" ? neighboringSemesters.prev || 0 : neighboringSemesters.next || 0,
            })
        }

        return (
            <li
                className={classNames(
                    cls.subjectCardWrapper,
                    active && cls.active,
                    clone && cls.clone,
                    isReplaceMode && cls.replaceMode,
                    insertPosition === Position.Before && cls.insertBefore,
                    insertPosition === Position.After && cls.insertAfter
                )}
                {...rest}
                ref={ref}
                onClick={() => !isReplaceMode && onSelectSubject(props.id)}
            >
                <div

                    ref={refScroll}
                    className={classNames(cls.subjectCard, cls[type], String(selectedSubject?.id) === String(props.id) && cls.selected)}>
                    {
                        displaySettings.required &&
                        <Tooltip title={isRequired ? "Сделать по выбору" : "Сделать обязательным"}>
                            <span
                                onClick={(event) => {
                                    event.stopPropagation()
                                    updateSubject(id, "isRequired", !isRequired)
                                }}
                                className={classNames(cls.requiredIcon, isRequired && cls.requiredIcon_selected)}
                            >*</span>
                        </Tooltip>
                    }
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
                            editable={{
                                icon: null,
                                triggerType: ["text"],
                                onChange: (value) => {
                                    setNewName(value);
                                    (name !== value) && updateSubject(id, "name", value)
                                }
                            }}
                            className={"text-black text-[12px] line-clamp-2 min-h-[36px] cursor-text hover:underline"}
                        >
                            {newName}
                        </Typography.Text>
                    </div>
                    <div className={"flex gap-1 flex-wrap"} onClick={(event) => event.stopPropagation()}>
                        {
                            displaySettings.credits &&
                            <CreditsSelector
                                credits={credits}
                                onChange={(value) => updateSubject(id, "credits", value)}
                            />
                        }
                        {
                            displaySettings.attestation &&
                            <AttestationTypeSelector
                                attestation={attestation}
                                onChange={(value) => updateSubject(id, "attestation", value)}
                            />
                        }
                        {
                            displaySettings.department &&
                            <Tooltip title={department?.name}>
                                <Tag className={"m-0"} rootClassName={"bg-transparent"}>{department?.id || '-'}</Tag>
                            </Tooltip>
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
                        <div onClick={(event) => event.stopPropagation()}>
                            <Popover
                                trigger={"click"}
                                placement={"bottom"}
                                overlayInnerStyle={{padding: 0}}
                                content={
                                    <List
                                        size="small"
                                        itemLayout={"vertical"}
                                        dataSource={[
                                            {
                                                key: 'replace',
                                                label: 'Изменить тип',
                                                icon: <TagOutlined />,
                                                children:
                                                    <List
                                                        size={"small"}
                                                        itemLayout={"vertical"}
                                                        dataSource={Object.values(AtomType).map(type => {return {
                                                            key: type,
                                                            label: <span className={"flex gap-2"}><Badge color={AtomTypeFullName[type].color}/>{AtomTypeFullName[type].name}</span>
                                                        }})}
                                                        renderItem={(item) =>
                                                            <li className={"w-full"}>
                                                                <Button
                                                                    type={"text"}
                                                                    className={"w-full justify-start"}
                                                                    disabled={item.key === type}
                                                                    onClick={() => updateSubject(id, "type", item.key as AtomType)}
                                                                >{item.label}</Button>
                                                            </li>
                                                        }
                                                    />,
                                                onClick: () => {}
                                            },
                                            {
                                                key: 'addSemester',
                                                label: 'Продлить на семестр',
                                                icon: <PlusOutlined />,
                                                children:
                                                    <List
                                                        size={"small"}
                                                        itemLayout={"vertical"}
                                                        dataSource={[{key: "prev", icon: <UpOutlined/>, label: "Раньше"},{key: "next", icon: <DownOutlined/>, label: "Позже"}]}
                                                        renderItem={(item) =>
                                                            <li className={"w-full"}>
                                                                <Button
                                                                    type={"text"}
                                                                    icon={item.icon}
                                                                    className={"w-full justify-start"}
                                                                    onClick={() => onExtendSemester(item.key)}
                                                                    disabled={item.key === "prev" && (!neighboringSemesters.prev || semestersIds.includes(neighboringSemesters.prev)) || item.key === "next" && (!neighboringSemesters.next || semestersIds.includes(neighboringSemesters.next))}
                                                                >{item.label}</Button>
                                                            </li>
                                                        }
                                                    />,
                                            },
                                            { key: 'delete', label: 'Удалить', danger: true, icon: <DeleteOutlined/>, onClick: () => deleteSubject() }
                                        ]}
                                        renderItem={(item) =>
                                            <li className={"w-full"}>
                                                {
                                                    item.children ?
                                                        <Popover content={item.children} placement={"right"} overlayInnerStyle={{padding: 0}}>
                                                            <Button
                                                                type={"text"}
                                                                onClick={item.onClick}
                                                                icon={item.icon}
                                                                danger={item.danger}
                                                                className={"w-full justify-start"}
                                                            >{item.label}<CaretRightOutlined className={"ml-auto"}/></Button>
                                                        </Popover> :
                                                        <Button
                                                            type={"text"}
                                                            onClick={item.onClick}
                                                            icon={item.icon}
                                                            danger={item.danger}
                                                            className={"w-full justify-start"}
                                                        >{item.label}</Button>
                                                }
                                            </li>}

                                    />
                                }
                            >
                                <div
                                    className={classNames(cls.optionsIcon)}
                                    onClick={(event) => event.stopPropagation()}
                                >
                                    <Icon component={OptionIcon}/>
                                </div>
                            </Popover>
                        </div>
                    </div>
                    {
                        displaySettings.academicHours &&
                        <AcademicHoursPanel
                            credits={credits}
                            academicHours={academicHours}
                            onChange={(activityId, value) => updateSubject(id, "academicHours", {id: activityId, value})}
                            onAdd={(activityId) => updateSubject(id, "academicHours", activityId)}
                            onRemove={(activityId) => updateSubject(id, "academicHours", {id: activityId, value: -1})}
                        />
                    }
                    {
                        displaySettings.competencies &&
                        <CompetenceSelector subjectId={id} competencies={competencies}/>
                    }
                </div>
            </li>
        );
    })

export const SubjectCard = memo(SubjectCardMemo);