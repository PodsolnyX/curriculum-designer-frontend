import { observer } from 'mobx-react-lite';
import { getIdFromPrefix } from '@/pages/PlanView/helpers/prefixIdHelpers.ts';
import { App } from 'antd';
import { useCreateUpdateSelectionMutation } from '@/api/axios-client/SelectionQuery.ts';
import { queryClient } from '@/shared/lib/api/queryClient.tsx';
import { getSemestersQueryKey } from '@/api/axios-client/SemestersQuery.ts';
import { commonStore } from '@/pages/PlanView/stores/commonStore.ts';
import { getValidationErrorsQueryKey } from '@/api/axios-client/ValidationQuery.ts';
import { getModulesByCurriculumQueryKey } from '@/api/axios-client/ModuleQuery.ts';
import React from 'react';
import { optionsStore } from '@/pages/PlanView/stores/optionsStore.ts';
import {
  CursorMode,
  ModuleSemestersPosition,
} from '@/pages/PlanView/types/types.ts';
import { componentsStore } from '@/pages/PlanView/stores/componentsStore/componentsStore.ts';
import SortableSubjectCard from '@/pages/PlanView/ui/widgets/AtomCard/ui/SortableAtomCard/SortableAtomCard.tsx';
import {
  RefModuleSemesterDto,
  SelectionDto,
} from '@/api/axios-client.types.ts';
import cls from './ModuleSemesterCell.module.scss';
import clsx from 'clsx';
import { ModuleHeader } from '@/pages/PlanView/ui/widgets/ModuleLayout/ui/ModuleHeader/ModuleHeader.tsx';
import { ModuleSemesterHeader } from '@/pages/PlanView/ui/widgets/ModuleLayout/ui/ModuleSemesterHeader/ModuleSemesterHeader.tsx';

export interface ModuleSemesterCellProps {
  id: string;
  name: string;
  atomsIds: string[];
  selection?: SelectionDto | null;
  position: ModuleSemestersPosition;
  semester: RefModuleSemesterDto;
  gridColumnsCount?: number;
  semesterIndex: number;
  isModuleHovered?: boolean;
}

export const ModuleSemesterCell = observer((props: ModuleSemesterCellProps) => {
  const {
    id,
    atomsIds,
    name,
    position,
    semester,
    selection,
    gridColumnsCount = 1,
    semesterIndex,
    isOver,
    isModuleHovered,
  } = props;

  const { message } = App.useApp();

  // const errors = commonStore.getValidationErrors(id);

  const { mutate: editSelection } = useCreateUpdateSelectionMutation(
    Number(getIdFromPrefix(String(id))),
    {
      onSuccess: () => {
        message.success('Выбор успешно обновлен');
        queryClient.invalidateQueries({
          queryKey: getSemestersQueryKey(commonStore.curriculumData?.id || 0),
        });
        queryClient.invalidateQueries({
          queryKey: getValidationErrorsQueryKey(
            commonStore.curriculumData?.id || 0,
          ),
        });
        queryClient.invalidateQueries({
          queryKey: getModulesByCurriculumQueryKey(
            commonStore.curriculumData?.id || 0,
          ),
        });
      },
    },
  );

  const onClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (optionsStore.toolsOptions.cursorMode === CursorMode.Create) {
      event.stopPropagation();
      componentsStore.createEntity(id);
    }
  };

  const onChangeSelectionCredits = (value: number) => {
    editSelection({
      semesters: selection?.semesters.map((_sem, index) =>
        index !== semesterIndex
          ? _sem
          : { semesterId: semester.semester.id, credit: value },
      ),
    });
  };

  const showHeader = position === 'first' || position === 'single';
  const showSeparatorLine = position === 'first' || position === 'middle';
  const isSelection = selection !== null;
  const credits = !selection
    ? semester.nonElective.credit
    : selection.semesters.find((sem) => sem.semesterId === semester.semester.id)
        ?.credit || 0;

  return (
    <div
      className={clsx(cls.ModuleSemesterCell, {
        [cls.CreateMode]:
          optionsStore.toolsOptions.cursorMode === CursorMode.Create,
        [cls.SeparatorLine]: showSeparatorLine,
        [cls.Over]: isOver,
        [cls.Selection]: showSeparatorLine && selection,
      })}
      onClick={onClick}
    >
      {showHeader && (
        <ModuleHeader
          id={id}
          name={name}
          isSelection={selection !== null}
          gridColumnsCount={gridColumnsCount}
          showMenu={isModuleHovered}
        />
      )}
      <ModuleSemesterHeader
        semesterNumber={semesterIndex + 1}
        credits={credits}
        isSelection={isSelection}
        onChangeCredits={onChangeSelectionCredits}
      />
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
