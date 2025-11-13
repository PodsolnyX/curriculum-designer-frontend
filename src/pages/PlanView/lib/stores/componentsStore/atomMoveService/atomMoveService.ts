import { arraysToDict } from "@/shared/lib/helpers/common.ts";
import { AtomDto, SemesterDto } from "@/api/axios-client.types.ts";
import { ModuleShortDto } from "@/pages/PlanView/types/types.ts";
import {Client as AtomClient} from "@/api/axios-client/AtomQuery.ts";
import { runInAction } from "mobx";
import {
  getIdFromPrefix,
  getParentIdFromPrefix,
  getSemesterIdFromPrefix
} from "@/pages/PlanView/lib/helpers/prefixIdHelpers.ts";
import { message } from "antd";
import { queryClient } from "@/shared/lib/api/queryClient.tsx";
import { getSemestersQueryKey } from "@/api/axios-client/SemestersQuery.ts";
import { commonStore } from "@/pages/PlanView/lib/stores/commonStore.ts";
import { getValidationErrorsQueryKey } from "@/api/axios-client/ValidationQuery.ts";
import { ATOM_SUCCESS_UPDATE_MESSAGE, IMPOSSIBLE_MOVE_ATOM_INTO_SEMESTER_MESSAGE } from "@/shared/const/messages.ts";

export class AtomModuleMoveService {
  constructor(
    private atoms: AtomDto[],
    private semesters: SemesterDto[],
    private modules: ModuleShortDto[],
    private getAtom: (id: number) => AtomDto | undefined,
    private resetAllActiveIds: () => void
  ) {}

  moveAtoms(activeId: string, overId: string) {
    const atomId = Number(getIdFromPrefix(activeId));
    const activeSemesterId = Number(getSemesterIdFromPrefix(activeId));
    const activeParentModuleId = Number(getParentIdFromPrefix(activeId));
    const overSemesterId = Number(getSemesterIdFromPrefix(overId));
    const overParentModuleId = Number(getParentIdFromPrefix(overId));

    const atom = this.atoms.find(a => a.id === atomId);
    if (!atom) return;

    const indexTargetSemester = this.semesters.findIndex(s => s.id === overSemesterId);
    const indexInitialSemester = atom.semesters.findIndex(s => s.semester.id === activeSemesterId);

    const initialIndexes = atom.semesters.map(s => s.semester.number - 1);
    const newIndexes = atom.semesters.map((_, i) => indexTargetSemester + i - indexInitialSemester);

    if (this.isOutOfBounds(newIndexes)) {
      message.error(IMPOSSIBLE_MOVE_ATOM_INTO_SEMESTER_MESSAGE);
      return;
    }

    const newSemesters = newIndexes.map(i => this.semesters[i]);

    runInAction(() => {
      this.updateAtomSemesters(atom, newSemesters, overSemesterId, overParentModuleId);
      this.updateModulesAfterMove(atomId, activeParentModuleId, overParentModuleId, newSemesters);
    });

    this.updateAtomServer(atomId, initialIndexes, newIndexes, overSemesterId, overParentModuleId)
      .then(() => this.afterMoveSuccess());
  }

  private isOutOfBounds(indexes: number[]): boolean {
    return indexes.includes(-1) || indexes.includes(this.semesters.length);
  }

  private updateAtomSemesters(atom: AtomDto, newSemesters: SemesterDto[], overSemesterId: number, overParentModuleId: number) {
    atom.parentModuleId = overSemesterId === overParentModuleId ? null : overParentModuleId;
    atom.semesters = atom.semesters.map((s, i) => ({
      ...s,
      semester: newSemesters[i],
    }));
  }

  private updateModulesAfterMove(atomId: number, fromModuleId: number, toModuleId: number, newSemesters: SemesterDto[]) {
    if (fromModuleId === toModuleId) return;

    this.modules.forEach(module => {
      if (module.id === fromModuleId) {
        this.removeAtomFromModule(module, atomId);
      } else if (module.id === toModuleId) {
        this.mergeAtomIntoModule(module, atomId, newSemesters);
      }
    });
  }

  private removeAtomFromModule(module: ModuleShortDto, atomId: number) {
    const updatedSemesters = module.semesters.filter(modSem =>
      module.atoms
        .filter(id => id !== atomId)
        .some(otherAtomId => {
          const otherAtom = this.getAtom(otherAtomId);
          return otherAtom?.semesters.some(s => s.semester.id === modSem.semester.id);
        })
    );

    if (!updatedSemesters.length) {
      const parentSemester = this.semesters.find(s => s.id === module.parentSemesterId);
      if (parentSemester) {
        updatedSemesters.push({
          semester: parentSemester,
          nonElective: { credit: 0, attestations: [], academicActivityHours: [] },
          elective: { credit: 0, attestations: [], academicActivityHours: [] },
        });
      }
    }

    module.atoms = module.atoms.filter(id => id !== atomId);
    module.semesters = updatedSemesters;
  }

  private mergeAtomIntoModule(module: ModuleShortDto, atomId: number, newSemesters: SemesterDto[]) {
    const mergedMap = new Map<number, SemesterDto>();

    const baseSemesters =
      module.semesters.length === 1 && module.semesters[0].semester.number === 0
        ? []
        : module.semesters.map(s => s.semester);

    [...baseSemesters, ...newSemesters].forEach(s => mergedMap.set(s.number, s));

    const mergedArray = Array.from(mergedMap.values()).sort((a, b) => a.number - b.number);

    module.semesters = mergedArray.map(s => ({
      semester: s,
      nonElective:
        module.semesters.find(sem => sem.semester.id === s.id)?.nonElective ?? {
          credit: 0,
          attestations: [],
          academicActivityHours: [],
        },
      elective:
        module.semesters.find(sem => sem.semester.id === s.id)?.elective ?? {
          credit: 0,
          attestations: [],
          academicActivityHours: [],
        },
    }));

    module.atoms = [...module.atoms, atomId];
  }

  private async updateAtomServer(
    atomId: number,
    initialIndexes: number[],
    newIndexes: number[],
    overSemesterId: number,
    overParentModuleId: number
  ) {
    await AtomClient.updateAtom(atomId, {
      semesterIds: arraysToDict(
        initialIndexes.map(i => this.semesters[i].id),
        newIndexes.map(i => this.semesters[i].id)
      ) as Record<string, number>,
      parentModuleId: overSemesterId === overParentModuleId ? null : overParentModuleId,
    });
  }

  private afterMoveSuccess() {
    queryClient.invalidateQueries({ queryKey: getSemestersQueryKey(commonStore.curriculumData?.id || 0) });
    queryClient.invalidateQueries({ queryKey: getValidationErrorsQueryKey(commonStore.curriculumData?.id || 0) });
    message.success(ATOM_SUCCESS_UPDATE_MESSAGE);

    runInAction(() => this.resetAllActiveIds());
  }
}