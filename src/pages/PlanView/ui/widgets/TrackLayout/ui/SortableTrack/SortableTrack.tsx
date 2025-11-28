import { observer } from 'mobx-react-lite';
import { componentsStore } from '@/pages/PlanView/stores/componentsStore/componentsStore.ts';
import { useDroppable } from '@dnd-kit/core';
import { TrackLayout, TrackLayoutProps } from '@/pages/PlanView/ui/widgets/TrackLayout/TrackLayout.tsx';
import React from 'react';

export const SortableTrack = observer((props: TrackLayoutProps) => {
  const isOver = componentsStore.isOver(props.id);

  const { setNodeRef } = useDroppable({
    id: props.id,
  });

  return (
    <div ref={setNodeRef}>
      <TrackLayout {...props} isOver={isOver} />
    </div>
  );
});