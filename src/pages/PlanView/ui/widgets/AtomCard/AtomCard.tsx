import React from 'react';
import cls from './AtomCard.module.scss';
import classNames from 'classnames';
import { Tag, Tooltip, Typography } from 'antd';
import CommentIcon from '@/shared/assets/icons/comment.svg?react';
import Icon from '@ant-design/icons';
import CompetenceSelector from '@/pages/PlanView/ui/features/CompetenceSelector/CompetenceSelector.tsx';
import AttestationTypeSelector from '@/pages/PlanView/ui/features/AttestationTypeSelector/AttestationTypeSelector.tsx';
import CreditsSelector from '@/pages/PlanView/ui/features/CreditsSelector/CreditsSelector.tsx';
import CommentsPopover from '@/pages/PlanView/ui/features/CommentsPopover/CommentsPopover.tsx';
import { AtomDto } from '@/api/axios-client.ts';
import AcademicHoursPanel from '@/pages/PlanView/ui/features/AcademicHoursPanel/AcademicHoursPanel.tsx';
import {
  concatIds,
  getIdFromPrefix,
  getSemesterIdFromPrefix,
  setPrefixToId,
} from '@/pages/PlanView/helpers/prefixIdHelpers.ts';
import { optionsStore } from '@/pages/PlanView/stores/optionsStore.ts';
import { observer } from 'mobx-react-lite';
import { componentsStore } from '@/pages/PlanView/stores/componentsStore/componentsStore.ts';
import { commonStore } from '@/pages/PlanView/stores/commonStore.ts';
import { NameInput } from '@/pages/PlanView/ui/features/NameInput/NameInput.tsx';
import { AtomContextMenu } from '@/pages/PlanView/ui/widgets/AtomCard/ui/AtomContextMenu/AtomContextMenu.tsx';

export enum Position {
  Before = -1,
  After = 1,
}

export interface SubjectCardProps extends Omit<AtomDto, 'id'> {
  id: string;
  active?: boolean;
  clone?: boolean;
  credits?: number;
  isSelected?: boolean;
  insertPosition?: Position;
  isReplaceMode?: boolean;
}

export const AtomCard = observer((props: SubjectCardProps) => {
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

    active,
    isSelected,
    clone,
    insertPosition,
    isReplaceMode,
  } = props;

  if (
    !semesters?.find(
      (semester) =>
        semester.semester.id === Number(getSemesterIdFromPrefix(id)),
    )
  ) {
    return null;
  }

  const { credit, attestations, academicActivityHours } = semesters.find(
    (semester) => semester.semester.id === Number(getSemesterIdFromPrefix(id)),
  );

  const semesterOrder =
    semesters.length === 1
      ? null
      : semesters.findIndex(
          (semester) =>
            semester.semester.id === Number(getSemesterIdFromPrefix(id)),
        ) + 1;
  const getNeighboringSemesters = () => {
    const semesterId = Number(getSemesterIdFromPrefix(id));
    const currentIndex = semesters.findIndex(
      (s) => s.semester.id === semesterId,
    );

    if (currentIndex === -1) return { prev: null, next: null };

    const currentNumber = semesters[currentIndex].semester.number;

    return {
      prev:
        currentIndex === 0
          ? currentNumber > 1
            ? currentNumber - 1
            : null
          : null,
      next:
        currentIndex === semesters.length - 1
          ? currentNumber < 8
            ? currentNumber + 1
            : null
          : null,
    };
  };

  const neighboringSemesters = getNeighboringSemesters();

  const onExpendSemester = (key: 'prev' | 'next') => {
    componentsStore.expandAtom(
      id,
      key === 'prev'
        ? neighboringSemesters.prev || 0
        : neighboringSemesters.next || 0,
      key,
    );
  };

  return (
    <li
      className={classNames(
        cls.subjectCardWrapper,
        active && cls.active,
        clone && cls.clone,
        isReplaceMode && cls.replaceMode,
        insertPosition === Position.Before && cls.insertBefore,
        insertPosition === Position.After && cls.insertAfter,
      )}
      onClick={() => {
        if (isReplaceMode) return;
        commonStore.selectComponent(id);
        commonStore.setSideBarContent('atom');
      }}
      id={concatIds(
        setPrefixToId(getSemesterIdFromPrefix(id), 'semesters'),
        setPrefixToId(getIdFromPrefix(id), 'subjects'),
      )}
    >
      <div
        className={classNames(
          cls.subjectCard,
          cls[type],
          isSelected && cls.selected,
        )}
      >
        {optionsStore.displaySettings.required && (
          <Tooltip
            title={isRequired ? 'Сделать по выбору' : 'Сделать обязательным'}
          >
            <span
              onClick={(event) => {
                event.stopPropagation();
                componentsStore.updateAtom(id, 'isRequired', !isRequired);
              }}
              className={classNames(
                cls.requiredIcon,
                isRequired && cls.requiredIcon_selected,
              )}
            >
              *
            </span>
          </Tooltip>
        )}
        <div
          className={'flex flex-col flex-1'}
          onClick={(event) => event.stopPropagation()}
        >
          <div className={'flex gap-1 items-center'}>
            {optionsStore.displaySettings.index && (
              <span className={'text-[10px] text-stone-400'}>
                {index || 'Без индекса'}
              </span>
            )}
            {optionsStore.displaySettings.index && semesterOrder && (
              <span className={'text-[8px] text-stone-400'}>•</span>
            )}
            {semesterOrder && (
              <span
                className={'text-[10px] text-blue-500'}
              >{`Семестр: ${semesterOrder}`}</span>
            )}
          </div>
          <NameInput
            value={name}
            onChange={(value) => {
              name !== value && componentsStore.updateAtom(id, 'name', value);
            }}
          >
            <Typography.Text
              title={name}
              className={
                'text-black text-[12px] line-clamp-2 min-h-[36px] cursor-text hover:underline'
              }
            >
              {name}
            </Typography.Text>
          </NameInput>
        </div>
        <div
          className={'flex gap-1 flex-wrap'}
          onClick={(event) => event.stopPropagation()}
        >
          {optionsStore.displaySettings.credits && (
            <CreditsSelector
              credits={credit}
              onChange={(value) =>
                componentsStore.updateAtom(id, 'credit', value)
              }
            />
          )}
          {optionsStore.displaySettings.attestation && (
            <AttestationTypeSelector
              attestation={attestations}
              onChange={(value) =>
                componentsStore.updateAtom(id, 'attestations', value)
              }
            />
          )}
          {optionsStore.displaySettings.department && (
            <Tooltip title={department?.name}>
              <Tag className={'m-0'} rootClassName={'bg-transparent'}>
                {department?.id || '-'}
              </Tag>
            </Tooltip>
          )}
          {optionsStore.displaySettings.notesNumber && (
            <CommentsPopover comments={[]}>
              <div
                className={classNames(
                  cls.notesIcon,
                  [].length && cls.notesIcon_selected,
                )}
                onClick={(event) => event.stopPropagation()}
              >
                <Icon component={CommentIcon} />
                <span className={'text-[10px] text-stone-400'}>
                  {[].length ? [].length : '+'}
                </span>
              </div>
            </CommentsPopover>
          )}
          <AtomContextMenu
            id={id}
            type={type}
            neighboringSemesters={neighboringSemesters}
            expendSemester={onExpendSemester}
            deleteSubject={() => componentsStore.removeAtom(id)}
          />
        </div>
        {optionsStore.displaySettings.academicHours && (
          <AcademicHoursPanel
            credits={credit}
            isEditMode={true}
            academicHours={academicActivityHours}
            onChange={(activityId, value) =>
              componentsStore.updateAtom(id, 'academicHours', {
                id: activityId,
                value,
              })
            }
            onAdd={(activityId) =>
              componentsStore.updateAtom(id, 'academicHours', {
                id: activityId,
                value: undefined,
              })
            }
            onRemove={(activityId) =>
              componentsStore.updateAtom(id, 'academicHours', {
                id: activityId,
                value: -1,
              })
            }
          />
        )}
        {optionsStore.displaySettings.competencies && (
          <CompetenceSelector
            subjectId={id}
            size={'small'}
            competencies={
              competenceIds.length ? competenceIds : competenceIndicatorIds
            }
            onChange={(competenceIds) =>
              componentsStore.updateAtom(id, 'competenceIds', competenceIds)
            }
          />
        )}
      </div>
    </li>
  );
});
