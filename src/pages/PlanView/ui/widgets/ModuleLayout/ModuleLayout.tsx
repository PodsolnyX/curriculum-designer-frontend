import React, { CSSProperties, useMemo } from 'react';
import {
  concatIds,
  setPrefixToId,
} from '@/pages/PlanView/helpers/prefixIdHelpers.ts';
import { ModuleShortDto } from '@/pages/PlanView/types/types.ts';
import { observer } from 'mobx-react-lite';
import { componentsStore } from '@/pages/PlanView/stores/componentsStore/componentsStore.ts';
import { SortableModuleSemesterCell } from '@/pages/PlanView/ui/widgets/ModuleLayout/ui/SortableModuleSemesterCell/SortableModuleSemesterCell.tsx';
import { getModuleAtomsIds } from '@/pages/PlanView/ui/widgets/ModuleLayout/lib/getModuleAtomsIds.ts';
import cls from './ModuleLayout.module.scss';
import clsx from 'clsx';
import { ModuleHeader } from '@/pages/PlanView/ui/widgets/ModuleLayout/ui/ModuleHeader/ModuleHeader.tsx';
import { ModuleSemesterHeader } from './ui/ModuleSemesterHeader/ModuleSemesterHeader.tsx';
import { SeparatorLine } from '@/pages/PlanView/ui/widgets/ModuleLayout/ui/SeparatorLine/SeparatorLine.tsx';
import { getModuleColors } from '@/pages/PlanView/ui/widgets/ModuleLayout/lib/getColorVariantsByHex.ts';
import { validateHEXStroke } from '@/pages/PlanView/ui/widgets/ModuleLayout/lib/validateHEXStroke.ts';

interface ModuleLayoutProps extends ModuleShortDto {
  deep?: number;
  parentModuleFirstSemesterNumber?: number;
  parentCreatedId?: string;
}

const ModuleLayout = observer((props: ModuleLayoutProps) => {
  const {
    deep = 0,
    id,
    name,
    color,
    semesters,
    selection,
    atoms,
    modules,
    parentModuleFirstSemesterNumber,
    parentCreatedId,
  } = props;

  const sortedSemesters = [...semesters].sort(
    (a, b) => a.semester.number - b.semester.number,
  );

  const atomsInfo = useMemo(() => componentsStore.getAtoms(atoms), [atoms]);

  const atomsColumnsCount = useMemo(() => {
    if (!atomsInfo.length && !!modules.length) return 0;

    const averageAtomsCount =
      atomsInfo.reduce((sum, atom) => sum + atom.semesters.length, 0) /
      semesters.length;
    return ~~((averageAtomsCount + 1) / 2) || 1;
  }, [atomsInfo, semesters]);

  const modulesColumnsCount = useMemo(() => {
    return modules.length;
  }, [modules, semesters]);

  const getModuleId = (semesterId: number) => {
    if (parentCreatedId)
      return concatIds(
        concatIds(setPrefixToId(semesterId, 'semesters'), parentCreatedId),
        setPrefixToId(id, 'modules'),
      );
    else
      return concatIds(
        setPrefixToId(semesterId, 'semesters'),
        setPrefixToId(id, 'modules'),
      );
  };

  const getModuleIdWithoutSemester = () => {
    if (parentCreatedId)
      return concatIds(parentCreatedId, setPrefixToId(id, 'modules'));
    else return setPrefixToId(id, 'modules');
  };

  const moduleId = getModuleId(sortedSemesters[0].semester.id);
  const firstSemesterNumber = sortedSemesters[0].semester.number;
  const semestersCount = sortedSemesters.length;
  const isSelection = !!selection;

  const withTopPadding =
    !!deep && parentModuleFirstSemesterNumber === firstSemesterNumber;

  const firstRowIndex = (() => {
    if (!parentModuleFirstSemesterNumber) return firstSemesterNumber;
    const difference = firstSemesterNumber - parentModuleFirstSemesterNumber;

    if (difference >= 0) return difference + 1;
    else return 1;
  })();

  const styles: CSSProperties = {
    gridRow: `${firstRowIndex} / span ${semestersCount}`,
    gridColumn: `auto / span ${atomsColumnsCount + modulesColumnsCount}`,
    paddingTop: 26,
    marginTop:
      !!deep && parentModuleFirstSemesterNumber !== firstSemesterNumber
        ? 50
        : undefined,
  };

  const defaultSelectionColor = '#60a5fa';
  const defaultModuleColor = '#44403c';
  const defaultColor = isSelection ? defaultSelectionColor : defaultModuleColor;
  const moduleColors = getModuleColors(
    !!color && validateHEXStroke(color) ? color : defaultColor,
  );

  const colorVars = {
    '--color-module-text': moduleColors.text,
    '--color-module-background': moduleColors.background,
    '--color-module-stroke': moduleColors.stroke,
  } as CSSProperties;

  return (
    <div
      className={clsx(cls.ModuleLayout, {
        [cls.Selection]: isSelection,
      })}
      style={{ ...styles, ...colorVars }}
      id={getModuleId(sortedSemesters[0].semester.id)}
    >
      <ModuleHeader
        id={moduleId}
        name={name}
        isSelection={isSelection}
        moduleColor={color ?? null}
      />
      {sortedSemesters.map((semester, index) => (
        <>
          <ModuleSemesterHeader
            moduleId={id}
            rowIndex={index}
            semester={semester}
            selection={selection}
            deep={deep}
            withTopPadding={withTopPadding}
            withNamePadding={index === 0}
            withChildrenNamePadding={!!modules.length && index === 0}
          />
          {index !== 0 && (
            <SeparatorLine isSelection={isSelection} rowIndex={index} />
          )}
        </>
      ))}
      {(atoms.length > 0 || !modules.length) && (
        <div
          className={cls.AtomsContainer}
          style={{
            gridRow: `1 / span ${semestersCount}`,
            gridColumn: `auto / span ${atomsColumnsCount}`,
          }}
        >
          {sortedSemesters.map((semester, index) => (
            <SortableModuleSemesterCell
              key={`sortable-${semester.semester.id}`}
              id={getModuleId(semester.semester.id)}
              gridColumnsCount={atomsColumnsCount}
              deep={deep}
              withNamePadding={index === 0}
              withTopPadding={withTopPadding}
              withChildrenNamePadding={!!modules.length && index === 0}
              atomsIds={getModuleAtomsIds(
                atomsInfo,
                semester.semester.id,
                getModuleId(semester.semester.id),
              )}
            />
          ))}
        </div>
      )}
      {modules.map((module) => {
        const moduleInfo = componentsStore.getModule(module);
        if (!moduleInfo) return null;
        return (
          <ModuleLayout
            {...moduleInfo}
            key={module}
            deep={deep + 1}
            parentModuleFirstSemesterNumber={
              sortedSemesters?.[0]?.semester.number
            }
            parentCreatedId={getModuleIdWithoutSemester()}
          />
        );
      })}
    </div>
  );
});

export default ModuleLayout;
