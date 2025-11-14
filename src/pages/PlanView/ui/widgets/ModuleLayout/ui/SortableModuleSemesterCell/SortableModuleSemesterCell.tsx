import { observer } from 'mobx-react-lite';
import { componentsStore } from '@/pages/PlanView/stores/componentsStore/componentsStore.ts';
import { useDroppable } from '@dnd-kit/core';
import React from 'react';
import {
  ModuleSemesterCell,
  ModuleSemesterCellProps,
} from '../ModuleSemesterCell/ModuleSemesterCell.tsx';

export const SortableModuleSemesterCell = observer(
  (props: ModuleSemesterCellProps) => {
    const isOver = componentsStore.isOver(props.id);

    const { setNodeRef } = useDroppable({
      id: props.id,
    });

    return (
      <div ref={setNodeRef}>
        <ModuleSemesterCell {...props} isOver={isOver} />
      </div>
    );
  },
);
