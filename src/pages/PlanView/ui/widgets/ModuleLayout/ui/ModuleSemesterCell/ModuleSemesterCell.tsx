import { observer } from 'mobx-react-lite';
import React from 'react';
import { optionsStore } from '@/pages/PlanView/stores/optionsStore.ts';
import { CursorMode } from '@/pages/PlanView/types/types.ts';
import { componentsStore } from '@/pages/PlanView/stores/componentsStore/componentsStore.ts';
import SortableSubjectCard from '@/pages/PlanView/ui/widgets/AtomCard/ui/SortableAtomCard/SortableAtomCard.tsx';
import cls from './ModuleSemesterCell.module.scss';
import clsx from 'clsx';
import { MAX_MODULES_DEEP } from '@/pages/PlanView/const/limits.ts';
import { message } from 'antd';

export interface ModuleSemesterCellProps {
  id: string;
  atomsIds: string[];

  isOver?: boolean;
  gridColumnsCount?: number;
  withTopPadding?: boolean;
  withNamePadding?: boolean;
  withChildrenNamePadding?: boolean;
  deep?: number;
}

export const ModuleSemesterCell = observer((props: ModuleSemesterCellProps) => {
  const {
    id,
    atomsIds,
    gridColumnsCount = 1,
    isOver,
    deep = 0,
    withTopPadding,
    withNamePadding,
    withChildrenNamePadding,
  } = props;

  const onClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (optionsStore.toolsOptions.cursorMode === CursorMode.Create) {
      event.stopPropagation();
      if (
        deep === MAX_MODULES_DEEP &&
        optionsStore.toolsOptions.selectedCreateEntityType !== 'subjects'
      ) {
        message.info('Максимальная глубина модулей = 2');
        return;
      }
      componentsStore.createEntity(id);
    }
  };

  const defaultPadding = 45;
  const topPadding = 80;
  const namePadding = 0;
  const childrenNamePadding = 40;

  let totalPadding = withTopPadding ? topPadding : defaultPadding;
  totalPadding += withNamePadding ? namePadding : 0;
  totalPadding += withChildrenNamePadding ? childrenNamePadding : 0;

  return (
    <div
      className={clsx(cls.ModuleSemesterCell, {
        [cls.CreateMode]:
          optionsStore.toolsOptions.cursorMode === CursorMode.Create,
        [cls.Over]: isOver,
      })}
      style={{
        paddingTop: totalPadding,
      }}
      onClick={onClick}
      id={id}
    >
      <div
        className={cls.AtomsContainer}
        style={{ gridTemplateColumns: `repeat(${gridColumnsCount}, 1fr)` }}
      >
        {atomsIds.map((atom) => (
          <SortableSubjectCard key={atom} id={atom} />
        ))}
      </div>
    </div>
  );
});
