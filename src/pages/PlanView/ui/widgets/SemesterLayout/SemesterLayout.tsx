import { useDroppable } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import SortableSubjectCard from '@/pages/PlanView/ui/widgets/AtomCard/ui/SortableAtomCard/SortableAtomCard.tsx';
import React, { useEffect, useRef, useState } from 'react';
import { CursorMode } from '@/pages/PlanView/types/types.ts';
import {
  PanelGroup,
  PanelResizeHandle,
  Panel,
  ImperativePanelHandle,
} from 'react-resizable-panels';
import SemesterHeader from '@/pages/PlanView/ui/widgets/SemesterLayout/ui/SemesterHeader/SemesterHeader.tsx';
import { SemesterDto } from '@/api/axios-client.types.ts';
import { setPrefixToId } from '@/pages/PlanView/helpers/prefixIdHelpers.ts';
import { observer } from 'mobx-react-lite';
import { optionsStore } from '@/pages/PlanView/stores/optionsStore.ts';
import { componentsStore } from '@/pages/PlanView/stores/componentsStore/componentsStore.ts';
import { PositionContainer } from '@/pages/PlanView/ui/features/PositionContainer/PositionContainer.tsx';
import { positionsStore } from '@/pages/PlanView/stores/positionsStore.ts';

export interface SemesterFieldProps extends SemesterDto {
  atomsIds: string[];
  isOver: boolean;
}

export const SortableSemesterField = observer(function (
  props: SemesterFieldProps,
) {
  const containerId = setPrefixToId(props.id, 'semesters');

  const isOver = componentsStore.isOver(containerId);

  const { setNodeRef } = useDroppable({
    id: containerId,
  });

  return (
    <div ref={setNodeRef}>
      <SemesterLayout {...props} isOver={isOver} />
    </div>
  );
});

export const SemesterLayout = observer(function (props: SemesterFieldProps) {
  const { id, number, atomsIds, isOver } = props;

  const containerId = setPrefixToId(id, 'semesters');

  const [addSubjectCard, setAddSubjectCard] = useState(false);

  const subjectsPanelRef = useRef<ImperativePanelHandle | null>(null);

  useEffect(() => {
    if (subjectsPanelRef.current)
      subjectsPanelRef.current?.resize(positionsStore.atomsContainerWidth);
  }, [positionsStore.atomsContainerWidth]);

  const onHoverSemester = () => {
    if (optionsStore.toolsOptions.cursorMode === CursorMode.Create)
      setAddSubjectCard(true);
  };

  const onLeaveSemester = () => {
    setAddSubjectCard(false);
  };

  const onAddEntity = (event: React.MouseEvent<HTMLDivElement>) => {
    if (addSubjectCard) {
      event.stopPropagation();
      componentsStore.createEntity(containerId);
    }
  };

  return (
    <PositionContainer
      id={containerId}
      rowId={containerId}
      rootClassName={`flex w-full flex-col gap-5 relative ${optionsStore.toolsOptions.cursorMode === CursorMode.Create ? '' : ''} ${number & 1 ? 'bg-stone-100' : 'bg-stone-200'} ${isOver || addSubjectCard ? "after:content-[''] after:w-full after:h-full after:border-2 after:border-dashed after:pointer-events-none after:border-sky-500 after:absolute after:top-0 after:left-0" : ''}`}
    >
      <div
        onMouseEnter={onHoverSemester}
        onMouseLeave={onLeaveSemester}
        onClick={(event) => onAddEntity(event)}
        className={`flex w-full flex-col gap-5 relative ${number & 1 ? 'bg-stone-100' : 'bg-stone-200'}`}
        // ${(overItemId === containerId || addSubjectCard) ? "after:content-[''] after:w-full after:h-full after:border-2 after:border-dashed after:pointer-events-none after:border-sky-500 after:absolute after:top-0 after:left-0"
        //     : ""}
      >
        <SemesterHeader semesterId={containerId} />
        {atomsIds.length ? (
          <div className={`flex flex-1 items-start gap-3 px-5 relative`}>
            <SortableContext items={[...atomsIds]} id={containerId}>
              <PanelGroup
                direction="horizontal"
                autoSaveId="widthSubjects"
                className={'w-[200vw]'}
              >
                <Panel
                  ref={subjectsPanelRef}
                  order={1}
                  onResize={(width) =>
                    positionsStore.setAtomsContainerWidth(width)
                  }
                  className={'pr-5'}
                >
                  <div
                    className={`flex flex-wrap gap-3 w-full pt-20 pb-5 pl-4 `}
                  >
                    {atomsIds.map((atom) => (
                      <SortableSubjectCard id={atom} key={atom} />
                    ))}
                  </div>
                </Panel>
                <PanelResizeHandle className={'w-[1px] bg-stone-300 z-10'} />
                <Panel
                  order={2}
                  className={'flex pl-5'}
                  style={{ width: '100vw' }}
                />
              </PanelGroup>
            </SortableContext>
          </div>
        ) : (
          <div
            className={
              'w-screen h-full flex flex-1 items-center justify-center text-stone-400 py-16'
            }
          >
            <span>Семестр пуст</span>
          </div>
        )}
      </div>
    </PositionContainer>
  );
});
