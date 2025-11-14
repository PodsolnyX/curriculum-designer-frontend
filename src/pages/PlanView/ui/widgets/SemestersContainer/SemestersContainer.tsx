import { optionsStore } from '@/pages/PlanView/stores/optionsStore.ts';
import { CursorMode } from '@/pages/PlanView/types/types.ts';
import { componentsStore } from '@/pages/PlanView/stores/componentsStore/componentsStore.ts';
import { SortableSemesterField } from '@/pages/PlanView/ui/widgets/SemesterLayout/SemesterLayout.tsx';
import { concatIds, setPrefixToId } from '@/pages/PlanView/helpers/prefixIdHelpers.ts';
import { observer } from 'mobx-react-lite';

export const SemestersContainer =  observer(() => {
  return (
    <div
      className={`flex flex-col pb-10 w-max ${optionsStore.toolsOptions.cursorMode === CursorMode.Hand ? 'pointer-events-none' : 'pointer-events-auto'}`}
    >
      {componentsStore.semesters.map((semester) => (
        <SortableSemesterField
          {...semester}
          key={semester.id}
          atomsIds={
            componentsStore.atoms
              .filter(
                (atom) =>
                  !atom.parentModuleId &&
                  atom.semesters.some(
                    (atomSemester) =>
                      atomSemester.semester.id === semester.id,
                  ),
              )
              .map((atom) =>
                concatIds(
                  setPrefixToId(semester.id, 'semesters'),
                  setPrefixToId(atom.id, 'subjects'),
                ),
              ) || []
          }
        />
      ))}
    </div>
  )
})