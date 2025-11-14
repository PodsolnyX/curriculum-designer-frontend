import { AtomDto, SemesterDto } from '@/api/axios-client.types.ts';
import { ModuleShortDto } from '@/pages/PlanView/types/types.ts';
import {
  getIdFromPrefix,
  getParentIdFromPrefix,
  getSemesterIdFromPrefix,
} from '@/pages/PlanView/helpers/prefixIdHelpers.ts';
import { message } from 'antd';
import { IMPOSSIBLE_MOVE_MODULE_INTO_SEMESTER_MESSAGE } from '@/shared/const/messages.ts';
import { runInAction } from 'mobx';
import { Client as ModuleClient } from '@/api/axios-client/ModuleQuery.ts';
import { Client as AtomClient } from '@/api/axios-client/AtomQuery.ts';

export class ModuleMoveService {
  constructor(
    private atoms: AtomDto[],
    private semesters: SemesterDto[],
    private modules: ModuleShortDto[],
    private resetAllActiveIds: () => void,
  ) {}

  moveModule(activeId: string, overId: string) {
    const moduleId = Number(getIdFromPrefix(activeId));
    const activeSemesterId = Number(getSemesterIdFromPrefix(activeId));
    const activeParentModuleId = Number(getParentIdFromPrefix(activeId));
    const overSemesterId = Number(getSemesterIdFromPrefix(overId));
    const overParentModuleId = Number(getParentIdFromPrefix(overId));

    const module = this.modules.find((m) => m.id === moduleId);
    if (!module) {
      console.warn(`Модуль с id = ${moduleId} не найден`);
      return;
    }

    const indexTargetSemester = this.semesters.findIndex(
      (s) => s.id === overSemesterId,
    );
    const _indexInitialSemester = this.semesters.findIndex(
      (s) => s.id === activeSemesterId,
    );
    const indexInitialSemester = module.semesters.findIndex(
      (s) => s.semester.id === activeSemesterId,
    );

    const newIndexes = module.semesters.map(
      (_, i) => indexTargetSemester + i - indexInitialSemester,
    );

    if (this.isOutOfBounds(newIndexes)) {
      message.error(IMPOSSIBLE_MOVE_MODULE_INTO_SEMESTER_MESSAGE);
      return;
    }

    const newSemesters = newIndexes.map((i) => this.semesters[i]);
    let updatedAtoms: Record<string, { semesterIds: Record<number, number> }> =
      {};

    runInAction(() => {
      this.updateModuleSemesters(
        module,
        newSemesters,
        overSemesterId,
        overParentModuleId,
      );
      updatedAtoms = this.updateModuleAtoms(
        module,
        indexTargetSemester - _indexInitialSemester,
      );
      this.updateParentModulesAfterMove(
        moduleId,
        activeSemesterId === activeParentModuleId ? null : activeParentModuleId,
        overSemesterId === overParentModuleId ? null : overParentModuleId,
        newSemesters,
      );
    });

    this.updateModuleServer(
      moduleId,
      overSemesterId,
      overParentModuleId === overSemesterId ? null : overParentModuleId,
      updatedAtoms,
    );
  }

  private isOutOfBounds(indexes: number[]): boolean {
    return indexes.includes(-1) || indexes.includes(this.semesters.length);
  }

  private updateModuleSemesters(
    module: ModuleShortDto,
    newSemesters: SemesterDto[],
    overSemesterId: number,
    overParentModuleId: number,
  ) {
    module.parentModuleId =
      overSemesterId === overParentModuleId ? null : overParentModuleId;
    module.parentSemesterId = overSemesterId;
    module.semesters.forEach((s, i) => {
      s.semester = newSemesters[i];
    });
  }

  private updateModuleAtoms(
    module: ModuleShortDto,
    semestersDifference: number,
  ) {
    const updatedAtoms: Record<
      number,
      { semesterIds: Record<number, number> }
    > = {};

    module.atoms.forEach((atomId) => {
      const atom = this.getAtom(atomId);
      const startedIndex =
        atom?.semesters[0].semester.number - 1 + semestersDifference;
      atom?.semesters.forEach((semester, i) => {
        updatedAtoms[atomId] = {
          semesterIds: {
            [semester.semester.id]: this.semesters[startedIndex + i].id,
          },
        };
        semester.semester = this.semesters[startedIndex + i];
      });
    });

    return updatedAtoms;
  }

  private updateParentModulesAfterMove(
    moduleId: number,
    fromModuleId: number | null,
    toModuleId: number | null,
    newSemesters: SemesterDto[],
  ) {
    if (fromModuleId === toModuleId) return;

    this.modules.forEach((module) => {
      if (module.id === fromModuleId) {
        this.removeModuleFromParentModule(module, moduleId);
      } else if (module.id === toModuleId) {
        this.mergeModuleIntoNewParentModule(module, moduleId, newSemesters);
      }
    });
  }

  private getModule(id: number): ModuleShortDto | undefined {
    return this.modules.find((m) => m.id === id);
  }

  private getAtom(id: number): AtomDto | undefined {
    return this.atoms.find((a) => a.id === id);
  }

  private removeModuleFromParentModule(
    parentModule: ModuleShortDto,
    moduleId: number,
  ) {
    const updatedSemesters = parentModule.semesters.filter((modSem) =>
      parentModule.modules
        .filter((id) => id !== moduleId)
        .some((otherModuleId) => {
          const otherModule = this.getModule(otherModuleId);
          return otherModule?.semesters.some(
            (s) => s.semester.id === modSem.semester.id,
          );
        }),
    );

    if (!updatedSemesters.length) {
      const parentSemester = this.semesters.find(
        (s) => s.id === parentModule.parentSemesterId,
      );
      if (parentSemester) {
        updatedSemesters.push({
          semester: parentSemester,
          nonElective: {
            credit: 0,
            attestations: [],
            academicActivityHours: [],
          },
          elective: { credit: 0, attestations: [], academicActivityHours: [] },
        });
      }
    }

    parentModule.modules = parentModule.modules.filter((id) => id !== moduleId);
    parentModule.semesters = updatedSemesters;
  }

  private mergeModuleIntoNewParentModule(
    parentModule: ModuleShortDto,
    moduleId: number,
    newSemesters: SemesterDto[],
  ) {
    const mergedMap = new Map<number, SemesterDto>();

    const baseSemesters =
      parentModule.semesters.length === 1 &&
      parentModule.semesters[0].semester.number === 0
        ? []
        : parentModule.semesters.map((s) => s.semester);

    [...baseSemesters, ...newSemesters].forEach((s) =>
      mergedMap.set(s.number, s),
    );

    const mergedArray = Array.from(mergedMap.values()).sort(
      (a, b) => a.number - b.number,
    );

    parentModule.semesters = mergedArray.map((s) => ({
      semester: s,
      nonElective: parentModule.semesters.find(
        (sem) => sem.semester.id === s.id,
      )?.nonElective ?? {
        credit: 0,
        attestations: [],
        academicActivityHours: [],
      },
      elective: parentModule.semesters.find((sem) => sem.semester.id === s.id)
        ?.elective ?? {
        credit: 0,
        attestations: [],
        academicActivityHours: [],
      },
    }));

    parentModule.modules = [...parentModule.modules, moduleId];
  }

  private async updateModuleServer(
    moduleId: number,
    parentSemesterId: number,
    parentModuleId: number | null,
    updatedAtoms: Record<string, { semesterIds: Record<number, number> }> = {},
  ) {
    await ModuleClient.updateModule(moduleId, {
      parentModuleId,
      parentSemesterId,
    });

    await AtomClient.bulkUpdateAtom({ updateAtomDtos: updatedAtoms });

    message.success('Модуль успешно перемещен');
  }
}
