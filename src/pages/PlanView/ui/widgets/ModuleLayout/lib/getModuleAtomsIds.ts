import { AtomDto } from '@/api/axios-client.types.ts';
import {
  concatIds,
  setPrefixToId,
} from '@/pages/PlanView/helpers/prefixIdHelpers.ts';

export const getModuleAtomsIds = (
  atoms: AtomDto[],
  semesterId: number,
  moduleId: string,
) => {
  const getAtomId = (id: number, moduleId: string) =>
    concatIds(moduleId, setPrefixToId(id, 'subjects'));

  return atoms
    .filter((atom) =>
      atom.semesters.some((semester) => semester.semester.id === semesterId),
    )
    .map((atom) => getAtomId(atom.id, moduleId));
};