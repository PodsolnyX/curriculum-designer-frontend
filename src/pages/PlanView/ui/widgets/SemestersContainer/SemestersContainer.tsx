import { componentsStore } from '@/pages/PlanView/stores/componentsStore/componentsStore.ts';
import {
  concatIds,
  setPrefixToId,
} from '@/pages/PlanView/helpers/prefixIdHelpers.ts';
import { observer } from 'mobx-react-lite';
import { SortableSemesterLayout } from '@/pages/PlanView/ui/widgets/SemesterLayout/ui/SortableSemesterLayout/SortableSemesterLayout.tsx';

export const SemestersContainer = observer(() => {
  const getSemesterAtomsId = (semesterId: number) => {
    return (
      componentsStore.atoms
        .filter(
          (atom) =>
            !atom.parentModuleId &&
            atom.semesters.some(
              (atomSemester) => atomSemester.semester.id === semesterId,
            ),
        )
        .map((atom) =>
          concatIds(
            setPrefixToId(semesterId, 'semesters'),
            setPrefixToId(atom.id, 'subjects'),
          ),
        ) || []
    );
  };

  return componentsStore.semesters.map((semester) => (
    <SortableSemesterLayout
      {...semester}
      key={semester.id}
      atomsIds={getSemesterAtomsId(semester.id)}
    />
  ));
});
