import { observer } from 'mobx-react-lite';
import { setPrefixToId } from '@/pages/PlanView/helpers/prefixIdHelpers.ts';
import { componentsStore } from '@/pages/PlanView/stores/componentsStore/componentsStore.ts';
import { useDroppable } from '@dnd-kit/core';
import React from 'react';
import {
  SemesterFieldProps,
  SemesterLayout,
} from '@/pages/PlanView/ui/widgets/SemesterLayout/SemesterLayout.tsx';

export const SortableSemesterLayout = observer(function (
  props: SemesterFieldProps,
) {
  const containerId = setPrefixToId(props.id, 'semesters');

  const isOver = componentsStore.isOver(containerId);

  const { setNodeRef } = useDroppable({
    id: containerId,
  });

  return <SemesterLayout {...props} isOver={isOver} ref={setNodeRef} />;
});
