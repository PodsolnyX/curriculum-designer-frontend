import { SortableContext } from '@dnd-kit/sortable';
import SortableSubjectCard from '@/pages/PlanView/ui/widgets/AtomCard/ui/SortableAtomCard/SortableAtomCard.tsx';
import React, { forwardRef, useState } from 'react';
import { CursorMode } from '@/pages/PlanView/types/types.ts';
import SemesterHeader from '@/pages/PlanView/ui/widgets/SemesterLayout/ui/SemesterHeader/SemesterHeader.tsx';
import { SemesterDto } from '@/api/axios-client.types.ts';
import { setPrefixToId } from '@/pages/PlanView/helpers/prefixIdHelpers.ts';
import { observer } from 'mobx-react-lite';
import { optionsStore } from '@/pages/PlanView/stores/optionsStore.ts';
import { componentsStore } from '@/pages/PlanView/stores/componentsStore/componentsStore.ts';
import cls from './SemesterLayout.module.scss';
import clsx from 'clsx';

export interface SemesterFieldProps extends SemesterDto {
  atomsIds: string[];
  isOver: boolean;
}

export const SemesterLayout = observer(
  forwardRef<HTMLDivElement, SemesterFieldProps>(
    function SemesterLayout(props, ref) {
      const { id, number, atomsIds, isOver } = props;

      const containerId = setPrefixToId(id, 'semesters');

      const [isHovered, setIsHovered] = useState(false);

      const onHoverSemester = () => {
        if (optionsStore.toolsOptions.cursorMode === CursorMode.Create)
          setIsHovered(true);
      };

      const onLeaveSemester = () => {
        setIsHovered(false);
      };

      const onAddEntity = (event: React.MouseEvent<HTMLDivElement>) => {
        if (isHovered) {
          event.stopPropagation();
          componentsStore.createEntity(containerId);
        }
      };

      return (
        <div
          style={{ gridRow: number }}
          className={clsx(cls.SemesterContainer, {
            [cls.Over]: isOver || isHovered,
          })}
          ref={ref}
          onMouseEnter={onHoverSemester}
          onMouseLeave={onLeaveSemester}
          onClick={(event) => onAddEntity(event)}
        >
          <SemesterHeader semesterId={containerId} />
          {atomsIds.length ? (
            <SortableContext items={[...atomsIds]} id={containerId}>
              <div className={cls.AtomsContainer}>
                {atomsIds.map((atom) => (
                  <SortableSubjectCard id={atom} key={atom} />
                ))}
              </div>
            </SortableContext>
          ) : (
            <div
              className={
                'w-screen h-full flex flex-1 items-center justify-center text-stone-400 py-16'
              }
            >
              <span>Семестр пуст</span>
            </div>
          )}
          <div className={cls.Background} />
        </div>
      );
    },
  ),
);
