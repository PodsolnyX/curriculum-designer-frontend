import { observer } from 'mobx-react-lite';
import {
  cutSemesterIdFromId,
  getIdFromPrefix,
  setPrefixToId,
} from '@/pages/PlanView/helpers/prefixIdHelpers.ts';
import { App, Tag, Typography } from 'antd';
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
import { PositionContainer } from '@/pages/PlanView/ui/features/PositionContainer/PositionContainer.tsx';
import { NameInput } from '@/pages/PlanView/ui/features/NameInput/NameInput.tsx';
import { ModuleContextMenu } from '@/pages/PlanView/ui/widgets/ModuleLayout/ui/ModuleContextMenu/ModuleContextMenu.tsx';
import CreditsSelector from '@/pages/PlanView/ui/features/CreditsSelector/CreditsSelector.tsx';
import SortableSubjectCard from '@/pages/PlanView/ui/widgets/AtomCard/ui/SortableAtomCard/SortableAtomCard.tsx';
import {
  RefModuleSemesterDto,
  SelectionDto,
} from '@/api/axios-client.types.ts';
import { getModuleRootStyles } from '@/pages/PlanView/ui/widgets/ModuleLayout/lib/getModuleRootStyles.ts';

export interface ModuleSemesterCellProps {
  id: string;
  name: string;
  atomsIds: string[];
  selection?: SelectionDto | null;
  position: ModuleSemestersPosition;
  semester: RefModuleSemesterDto;
  gridColumnsCount?: number;
  semesterIndex: number;
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
  } = props;

  const rowId = setPrefixToId(semester.semester.id, 'semesters');
  const containerId = cutSemesterIdFromId(id);

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

  const getFieldClassName = () => {
    if (['first', 'middle'].includes(position)) {
      return `relative after:content-[''] after:w-full after:h-[2px] after:absolute after:bottom-[-2px] after:left-0 ${selection ? 'after:bg-blue-300' : 'after:bg-stone-500'}`;
    }
    return '';
  };

  const onClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (optionsStore.toolsOptions.cursorMode === CursorMode.Create) {
      event.stopPropagation();
      componentsStore.createEntity(id);
    }
  };

  return (
    <PositionContainer
      countHorizontalCoordinates={true}
      rowId={rowId}
      id={containerId}
      rootStyles={(height) => getModuleRootStyles(height, position)}
      rootClassName={`${getFieldClassName()} flex w-full flex-col group relative border-dashed ${optionsStore.toolsOptions.cursorMode === CursorMode.Create ? 'hover:bg-blue-300/[.3] cursor-pointer' : ''} ${isOver ? 'bg-blue-300/[.3]' : ''}`}
      childrenClassName={'min-h-max'}
      onClick={onClick}
    >
      <div id={id} className={'flex flex-col gap-2 p-2'}>
        <div
          style={{ width: `${gridColumnsCount * 200}px` }}
          className={`overflow-hidden text-nowrap text-ellipsis text-center ${selection ? 'text-blue-400' : 'text-black'}`}
        >
          {position === 'first' || position === 'single' ? (
            <>
              <NameInput
                value={name}
                onChange={(value) =>
                  componentsStore.updateModuleName(id, value)
                }
              >
                <Typography.Text
                  title={name}
                  className={`${selection ? 'text-blue-400' : 'text-black'} font-bold cursor-text`}
                >
                  {name}
                </Typography.Text>
              </NameInput>
              <ModuleContextMenu
                className={'group-hover:opacity-100'}
                moduleId={id}
                isSelection={selection !== null}
              />
            </>
          ) : null}
        </div>
        <div
          className={
            'flex items-center justify-between bg-white shadow-md rounded-md w-full p-1 px-2'
          }
          style={{
            width: `${gridColumnsCount * 200 + (gridColumnsCount - 1) * 5}px`,
          }}
        >
          <Typography.Text className={'text-blue-400 text-sm font-bold'}>
            Семестр {semesterIndex + 1}
          </Typography.Text>
          {selection ? (
            <CreditsSelector
              // error={errors ? errors.some(e => e.type === ValidationErrorType.CreditDistribution) : false}
              credits={
                selection.semesters.find(
                  (sem) => sem.semesterId === semester.semester.id,
                )?.credit || 0
              }
              onChange={(value) =>
                editSelection({
                  semesters: selection?.semesters.map((_sem, index) =>
                    index !== semesterIndex
                      ? _sem
                      : { semesterId: semester.semester.id, credit: value },
                  ),
                })
              }
            />
          ) : (
            <Tag color={'default'} className={'m-0'} bordered={false}>
              {semester.nonElective.credit} ЗЕТ
            </Tag>
          )}
        </div>
        <div
          className={'grid gap-2'}
          style={{ gridTemplateColumns: `repeat(${gridColumnsCount}, 1fr)` }}
        >
          {atomsIds.map((atom) => (
            <SortableSubjectCard key={atom} id={atom} />
          ))}
        </div>
      </div>
    </PositionContainer>
  );
});
