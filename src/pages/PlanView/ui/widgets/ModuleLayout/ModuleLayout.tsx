import React, { useMemo } from 'react';
import {
  concatIds,
  setPrefixToId,
} from '@/pages/PlanView/helpers/prefixIdHelpers.ts';
import { ModuleShortDto } from '@/pages/PlanView/types/types.ts';
import TracksSelectionLayout from '@/pages/PlanView/ui/widgets/TracksSelectionLayout/TracksSelectionLayout.tsx';
import { observer } from 'mobx-react-lite';
import { componentsStore } from '@/pages/PlanView/stores/componentsStore/componentsStore.ts';
import { positionsStore } from '@/pages/PlanView/stores/positionsStore.ts';
import { SortableModuleSemesterCell } from '@/pages/PlanView/ui/widgets/ModuleLayout/ui/SortableModuleSemesterCell/SortableModuleSemesterCell.tsx';
import { getModuleAtomsIds } from '@/pages/PlanView/ui/widgets/ModuleLayout/lib/getModuleAtomsIds.ts';

interface ModuleLayoutProps extends ModuleShortDto {}

const ModuleLayout = observer((props: ModuleLayoutProps) => {
  const { id, name, semesters, selection, atoms, modules } = props;

  const atomsInfo = useMemo(() => componentsStore.getAtoms(atoms), [atoms]);

  const gridColumnsCount = useMemo(() => {
    const averageAtomsCount =
      atomsInfo.reduce((sum, atom) => sum + atom.semesters.length, 0) /
      semesters.length;
    return ~~((averageAtomsCount + 1) / 2) || 1;
  }, [atomsInfo, semesters]);

  const x =
    positionsStore.getHorizontalCoordinate(
      setPrefixToId(semesters?.[0]?.semester.id || '', 'semesters'),
      setPrefixToId(id, 'modules'),
    ) || 0;

  const getModuleId = (id: number, semesterId: number) =>
    concatIds(
      setPrefixToId(semesterId, 'semesters'),
      setPrefixToId(id, 'modules'),
    );

  return (
    <div
      className={`absolute border-2 border-dashed rounded-md ${selection && !modules.length ? 'bg-blue-700/[.05] border-blue-400' : 'bg-stone-700/[.05] border-stone-500'}`}
      style={{
        marginTop: 4,
        marginBottom: 4,
        left: `${x}px`,
        top: `${positionsStore.getTopCoordinate(setPrefixToId(semesters[0]?.semester.id || '', 'semesters'))}px`,
      }}
      id={setPrefixToId(id, 'modules')}
    >
      {[...semesters]
        .sort((a, b) => a.semester.number - b.semester.number)
        .map((semester, index) => {
          const moduleId = getModuleId(id, semester.semester.id);

          return selection && modules.length ? (
            <TracksSelectionLayout
              id={moduleId}
              key={`track-${semester.semester.id}`}
              semesterNumber={index + 1}
              credits={selection.semesters[index]?.credit || 0}
              semesterId={semester.semester.id}
              tracks={modules}
              name={name}
              position={
                index === 0 && semesters.length <= 1
                  ? 'single'
                  : index === 0
                    ? 'first'
                    : index === semesters.length - 1
                      ? 'last'
                      : 'middle'
              }
            />
          ) : (
            <SortableModuleSemesterCell
              key={`sortable-${semester.semester.id}`}
              id={moduleId}
              gridColumnsCount={gridColumnsCount}
              name={name}
              semester={semester}
              selection={selection}
              semesterIndex={index}
              position={
                index === 0 && semesters.length <= 1
                  ? 'single'
                  : index === 0
                    ? 'first'
                    : index === semesters.length - 1
                      ? 'last'
                      : 'middle'
              }
              atomsIds={getModuleAtomsIds(
                atomsInfo,
                semester.semester.id,
                moduleId,
              )}
            />
          );
        })}
    </div>
  );
});

export default ModuleLayout;