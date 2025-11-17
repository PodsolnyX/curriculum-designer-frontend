import React from 'react';
import { CursorMode } from '@/pages/PlanView/types/types.ts';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';
import { observer } from 'mobx-react-lite';
import { optionsStore } from '@/pages/PlanView/stores/optionsStore.ts';
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  pointerWithin,
  rectIntersection,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { componentsStore } from '@/pages/PlanView/stores/componentsStore/componentsStore.ts';
import { Overlay } from './ui/Overlay/Overlay.tsx';

interface ViewWrapperProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  sidebar?: React.ReactNode;
}

const ViewWrapper = observer((props: ViewWrapperProps) => {
  const { children, header, sidebar } = props;

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  return (
    <TransformWrapper
      minScale={0.3}
      maxScale={1.5}
      initialScale={1}
      limitToBounds={true}
      disablePadding={true}
      panning={{
        allowLeftClickPan:
          optionsStore.toolsOptions.cursorMode === CursorMode.Hand,
      }}
    >
      <DndContext
        sensors={sensors}
        onDragStart={(event) => {
          const { active } = event;
          const { id } = active;
          componentsStore.setActiveId(id as string);
        }}
        onDragOver={(event) => {
          if (!event.over) return;
          const { id: overId } = event.over;
          componentsStore.setOverId(overId as string);
        }}
        onDragEnd={(event: DragEndEvent) => {
          if (
            !event.active?.id ||
            !event.over?.id ||
            event.active.id === event.over.id
          )
            return;

          const activeId = event.active?.id as string;
          const overId = event.over?.id as string;

          componentsStore.moveAtoms(activeId, overId);
        }}
        onDragCancel={() => componentsStore.setOverId(null)}
        collisionDetection={(args) => {
          const pointerCollisions = pointerWithin(args);
          if (pointerCollisions.length > 0) return pointerCollisions;
          return rectIntersection(args);
        }}
      >
        <div className={'flex relative'}>
          {header}
          <TransformComponent
            wrapperStyle={{
              height: '100vh',
              width: '100vw',
              cursor:
                optionsStore.toolsOptions.cursorMode === CursorMode.Hand
                  ? 'grab'
                  : 'auto',
            }}
          >
            {children}
            <Overlay />
          </TransformComponent>
          {sidebar}
        </div>
      </DndContext>
    </TransformWrapper>
  );
});

export default ViewWrapper;
