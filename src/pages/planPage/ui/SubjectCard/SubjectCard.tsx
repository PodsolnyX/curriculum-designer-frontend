import React, {forwardRef, useEffect, useState} from 'react';
import cls from './SubjectCard.module.scss';
import classNames from "classnames";
import {Badge, Button, List, Popover, Tag, Tooltip, Typography} from "antd";
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
import {AtomDto, AtomType} from "@/api/axios-client.ts";
import AcademicHoursPanel from "@/pages/planPage/ui/AcademicHoursPanel.tsx";
import {useEditSubject} from "@/pages/planPage/hooks/useEditSubject.ts";
import {AtomTypeFullName} from "@/pages/planPage/const/constants.ts";
import {getIdFromPrefix, getSemesterIdFromPrefix} from "@/pages/planPage/provider/prefixIdHelpers.ts";
import {optionsStore} from "@/pages/planPage/lib/stores/optionsStore.ts";
import {observer} from "mobx-react-lite";
import {componentsStore} from "@/pages/planPage/lib/stores/componentsStore.ts";

export enum Position {
    Before = -1,
    After = 1,
}

export interface SubjectCardProps extends Omit<AtomDto, "id"> {
    id: string;
    active?: boolean;
    clone?: boolean;
    credits?: number;
    isSelected?: boolean;
    insertPosition?: Position;
    isReplaceMode?: boolean;
}

export const SubjectCardMemo =
    forwardRef<HTMLLIElement, SubjectCardProps>((props, ref) => {
        const {
            id,
            index,
            name,
            isRequired,
            type,
            semesters,
            department,
            competenceIds,
            competenceIndicatorIds,
            curriculumId,

            active,
            isSelected,
            clone,
            insertPosition,
            parentModuleId,
            isReplaceMode,
            ...rest
        } = props;

        const [newName, setNewName] = useState(name);

        const {deleteSubject} = useEditSubject(Number(getIdFromPrefix(id)));

        useEffect(() => {
            setNewName(name)
        }, [name])

        if (!semesters?.find(semester => semester.semester.id === Number(getSemesterIdFromPrefix(id)))) {
            return null;
        }

        const {
            credit,
            attestations,
            academicActivityHours
        } = semesters.find(semester => semester.semester.id === Number(getSemesterIdFromPrefix(id)));

        const semesterOrder = semesters.length === 1 ? null : semesters.findIndex(semester => semester.semester.id === Number(getSemesterIdFromPrefix(id))) + 1;
        const getNeighboringSemesters = () => {

            const semesterId = Number(getSemesterIdFromPrefix(id));
            const currentIndex = semesters.findIndex(s => s.semester.id === semesterId);

            if (currentIndex === -1) return { prev: null, next: null };

            const currentNumber = semesters[currentIndex].semester.number;

            return {
                prev: (currentIndex === 0) ? currentNumber > 1 ? currentNumber - 1 : null : null,
                next: (currentIndex === semesters.length - 1) ? currentNumber < 8 ? currentNumber + 1 : null : null
            };
        }

        const neighboringSemesters = getNeighboringSemesters();

        console.log(22)

        const onExpendSemester = (key: "prev" | "next") => {
            // expandAtom(id, key === "prev" ? neighboringSemesters.prev || 0 : neighboringSemesters.next || 0, key)
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
                // onClick={() => !isReplaceMode && onSelectSubject(id)}
                id={id}
            >
                <div
                    className={classNames(cls.subjectCard, cls[type], isSelected && cls.selected)}>
                    {
                        optionsStore.displaySettings.required &&
                        <Tooltip title={isRequired ? "Сделать по выбору" : "Сделать обязательным"}>
                            <span
                                onClick={(event) => {
                                    event.stopPropagation()
                                    componentsStore.updateAtom(id, "isRequired", !isRequired)
                                }}
                                className={classNames(cls.requiredIcon, isRequired && cls.requiredIcon_selected)}
                            >*</span>
                        </Tooltip>
                    }
                    <div className={"flex flex-col flex-1"} onClick={(event) => event.stopPropagation()}>
                        <div className={"flex gap-1 items-center"}>
                            {
                                optionsStore.displaySettings.index &&
                                <span className={"text-[10px] text-stone-400"}>{index || "Без индекса"}</span>
                            }
                            {
                                (optionsStore.displaySettings.index && semesterOrder)
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
                                    (name !== value) && componentsStore.updateAtom(id, "name", value)
                                }
                            }}
                            title={newName}
                            className={"text-black text-[12px] line-clamp-2 min-h-[36px] cursor-text hover:underline"}
                        >
                            {newName}
                        </Typography.Text>
                    </div>
                    <div className={"flex gap-1 flex-wrap"} onClick={(event) => event.stopPropagation()}>
                        {
                            optionsStore.displaySettings.credits &&
                            <CreditsSelector
                                credits={credit}
                                onChange={(value) => componentsStore.updateAtom(id, "credit", value)}
                            />
                        }
                        {
                            optionsStore.displaySettings.attestation &&
                            <AttestationTypeSelector
                                attestation={attestations}
                                onChange={(value) => componentsStore.updateAtom(id, "attestations", value)}
                            />
                        }
                        {
                            optionsStore.displaySettings.department &&
                            <Tooltip title={department?.name}>
                                <Tag className={"m-0"} rootClassName={"bg-transparent"}>{department?.id || '-'}</Tag>
                            </Tooltip>
                        }
                        {
                            optionsStore.displaySettings.notesNumber &&
                            <CommentsPopover comments={[]}>
                                <div
                                    className={classNames(cls.notesIcon, [].length && cls.notesIcon_selected)}
                                    onClick={(event) => event.stopPropagation()}
                                >
                                    <Icon component={CommentIcon}/>
                                    <span
                                        className={"text-[10px] text-stone-400"}>{[].length ? [].length : "+"}</span>
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
                                                                    onClick={() => componentsStore.updateAtom(id, "type", item.key as AtomType)}
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
                                                                    onClick={() => onExpendSemester(item.key)}
                                                                    disabled={item.key === "prev" && !neighboringSemesters.prev || item.key === "next" && !neighboringSemesters.next}
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
                        optionsStore.displaySettings.academicHours &&
                        <AcademicHoursPanel
                            credits={credit}
                            isEditMode={true}
                            academicHours={academicActivityHours}
                            onChange={(activityId, value) => componentsStore.updateAtom(id, "academicHours", {id: activityId, value})}
                            onAdd={(activityId) => componentsStore.updateAtom(id, "academicHours", {id: activityId, value: undefined})}
                            onRemove={(activityId) => componentsStore.updateAtom(id, "academicHours", {id: activityId, value: -1})}
                        />
                    }
                    {
                        optionsStore.displaySettings.competencies &&
                        <CompetenceSelector
                            subjectId={id}
                            competencies={competenceIds.length ? competenceIds : competenceIndicatorIds}
                            onChange={(competenceIds) => componentsStore.updateAtom(id, "competenceIds", competenceIds)}
                        />
                    }
                </div>
            </li>
        );
    })

export const SubjectCard = observer(SubjectCardMemo);