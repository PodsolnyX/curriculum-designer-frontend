import {
  Position,
  AtomCard,
} from '@/pages/PlanView/ui/widgets/AtomCard/AtomCard.tsx';
import { useSortable } from '@dnd-kit/sortable';
import { Arguments } from '@dnd-kit/sortable/dist/hooks/useSortable';
import { CSS } from '@dnd-kit/utilities';
import React, { useMemo } from 'react';
import { CursorMode } from '@/pages/PlanView/types/types.ts';
import {
  getIdFromPrefix,
  getSemesterIdFromPrefix,
} from '@/pages/PlanView/helpers/prefixIdHelpers.ts';
import { optionsStore } from '@/pages/PlanView/stores/optionsStore.ts';
import { componentsStore } from '@/pages/PlanView/stores/componentsStore/componentsStore.ts';
import { observer } from 'mobx-react-lite';
import { commonStore } from '@/pages/PlanView/stores/commonStore.ts';
import { AtomCardOutView } from './ui/AtomCardOutView/AtomCardOutView.tsx';

interface SortableAtomCard {
  id: string;
}

const SortableSubjectCard = observer(({ id }: SortableAtomCard) => {
  const {
    attributes,
    listeners,
    isDragging,
    isSorting,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id, animateLayoutChanges: () => true } as Arguments);

  const isOver = componentsStore.isOver(id);
  const isSelected = commonStore.isSelectedComponent(id);

  const atomId = Number(getIdFromPrefix(id));
  const atom = componentsStore.getAtom(atomId);

  const isReplaceMode = useMemo(
    () => optionsStore.toolsOptions.cursorMode === CursorMode.Replace,
    [optionsStore.toolsOptions.cursorMode],
  );

  if (!atom) return null;

  const atomInfo = { ...atom, index: componentsStore.getIndex(atomId) };

  const getPosition = (): Position | undefined => {
    if (isOver) return Position.Before;
    else return undefined;
  };

  return (
    <AtomCardOutView
      id={id}
      enable={isSelected}
      semesterOrder={
        atomInfo.semesters.findIndex(
          (semester) =>
            semester.semester.id === Number(getSemesterIdFromPrefix(id)),
        ) + 1
      }
    >
      {isReplaceMode ? (
        <div
          ref={setNodeRef}
          {...attributes}
          {...listeners}
          style={{
            transition,
            transform: isSorting
              ? undefined
              : CSS.Transform.toString(transform),
          }}
        >
          <AtomCard
            {...atomInfo}
            id={id}
            isReplaceMode={isReplaceMode}
            active={isDragging}
            isSelected={isSelected}
            insertPosition={getPosition()}
          />
        </div>
      ) : (
        <AtomCard
          {...atomInfo}
          id={id}
          isReplaceMode={isReplaceMode}
          active={isDragging}
          isSelected={isSelected}
          insertPosition={getPosition()}
        />
      )}
    </AtomCardOutView>
  );
});

export default SortableSubjectCard;
