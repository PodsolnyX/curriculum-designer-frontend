import {
  RefModuleSemesterDto,
  SelectionDto,
} from '@/api/axios-client.types.ts';
import { App, Tag } from 'antd';
import { useCreateUpdateSelectionMutation } from '@/api/axios-client/SelectionQuery.ts';
import { queryClient } from '@/shared/lib/api/queryClient.tsx';
import { getSemestersQueryKey } from '@/api/axios-client/SemestersQuery.ts';
import { commonStore } from '@/pages/PlanView/stores/commonStore.ts';
import { getValidationErrorsQueryKey } from '@/api/axios-client/ValidationQuery.ts';
import { getModulesByCurriculumQueryKey } from '@/api/axios-client/ModuleQuery.ts';
import clsx from 'clsx';
import cls from './ModuleSemesterHeader.module.scss';
import CreditsSelector from '@/pages/PlanView/ui/features/CreditsSelector/CreditsSelector.tsx';
import React from 'react';

interface ModuleSemesterHeaderHeaderProps {
  moduleId: number;
  rowIndex: number;
  semester: RefModuleSemesterDto;
  selection?: SelectionDto | null;
  deep: number;

  withTopPadding?: boolean;
  withNamePadding?: boolean;
  withChildrenNamePadding?: boolean;
}

export const ModuleSemesterHeader = (
  props: ModuleSemesterHeaderHeaderProps,
) => {
  const {
    moduleId,
    rowIndex,
    semester,
    selection,
    deep,
    withNamePadding,
    withTopPadding,
    withChildrenNamePadding,
  } = props;

  const { message } = App.useApp();

  const { mutate: editSelection } = useCreateUpdateSelectionMutation(moduleId, {
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
  });

  const credits = !selection
    ? semester.nonElective.credit
    : selection.semesters.find((sem) => sem.semesterId === semester.semester.id)
        ?.credit || 0;

  const onChangeSelectionCredits = (value: number) => {
    editSelection({
      semesters: selection?.semesters.map((_sem, index) =>
        index !== rowIndex
          ? _sem
          : { semesterId: semester.semester.id, credit: value },
      ),
    });
  };

  const defaultPadding = 10;
  const topPadding = 45;
  const namePadding = 0;
  const childrenNamePadding = 35;

  let totalPadding = withTopPadding ? topPadding : defaultPadding;
  totalPadding += withNamePadding ? namePadding : 0;
  totalPadding += withChildrenNamePadding ? childrenNamePadding : 0;

  return (
    <div
      className={clsx(cls.ModuleSemesterHeader)}
      style={{
        gridRow: rowIndex + 1,
        gridColumn: `auto`,
        top: totalPadding,
      }}
    >
      <span className={cls.Title}>Семестр {rowIndex + 1}</span>
      {!!selection ? (
        <CreditsSelector
          credits={credits}
          onChange={onChangeSelectionCredits}
        />
      ) : (
        <Tag color={'default'} className={'m-0'} bordered={false}>
          {credits} ЗЕТ
        </Tag>
      )}
    </div>
  );
};
