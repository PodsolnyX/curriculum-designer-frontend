import {
  AtomDto,
  AtomType,
  CreateAtomDto,
  RefAtomSemesterDto,
  SemesterDto,
} from '@/api/axios-client.types.ts';
import {
  AtomUpdateParams,
  ModuleShortDto,
} from '@/pages/PlanView/types/types.ts';
import {
  getIdFromPrefix,
  getParentIdFromPrefix,
  getSemesterIdFromPrefix,
} from '@/pages/PlanView/helpers/prefixIdHelpers.ts';
import { atomStrategyRegistry } from '@/pages/PlanView/stores/componentsStore/atomUpdateService/atomUpdateStrategy/AtomStrategyRegistry.ts';
import { runInAction } from 'mobx';
import { Client as AtomInSemesterClient } from '@/api/axios-client/AtomInSemesterQuery.ts';
import { Client as AtomClient } from '@/api/axios-client/AtomQuery.ts';
import { queryClient } from '@/shared/lib/api/queryClient.tsx';
import { getSemestersQueryKey } from '@/api/axios-client/SemestersQuery.ts';
import { commonStore } from '@/pages/PlanView/stores/commonStore.ts';
import { getValidationErrorsQueryKey } from '@/api/axios-client/ValidationQuery.ts';
import { message } from 'antd';
import {
  ATOM_SUCCESS_CREATE_MESSAGE,
  ATOM_SUCCESS_DELETE_MESSAGE,
  ATOM_SUCCESS_UPDATE_MESSAGE,
} from '@/shared/const/messages.ts';

export class AtomUpdateService {
  constructor(
    private curriculumId: number,
    private atoms: AtomDto[],
    private semesters: SemesterDto[],
    private modules: ModuleShortDto[],
  ) {}

  async createAtom(targetId: string) {
    const semesterId = Number(getSemesterIdFromPrefix(targetId));
    const parentId = Number(getIdFromPrefix(targetId));

    const newAtomParams: CreateAtomDto = {
      name: 'Новый предмет',
      type: AtomType.Subject,
      isRequired: false,
      parentModuleId: semesterId === parentId ? null : parentId,
      semesterIds: [semesterId],
      curriculumId: this.curriculumId,
    };

    const newAtomId = await AtomClient.createAtom(newAtomParams);

    const newAtom: AtomDto = {
      id: newAtomId,
      name: newAtomParams.name,
      type: newAtomParams.type,
      isRequired: newAtomParams.isRequired,
      parentModuleId: newAtomParams.parentModuleId,
      curriculumId: newAtomParams.curriculumId,
      semesters: newAtomParams.semesterIds.map((semesterId) => ({
        semester: this.semesters.find(
          (semester) => semester.id === semesterId,
        ) as SemesterDto,
        credit: 0,
        attestations: [],
        academicActivityHours: [],
      })),
      index: null,
      department: null,
      competenceIndicatorIds: [],
      competenceIds: [],
    };

    message.success(ATOM_SUCCESS_CREATE_MESSAGE);

    runInAction(() => {
      this.atoms.push(newAtom);
      if (semesterId !== parentId) {
        const parentModule = this.modules.find(
          (module) => module.id === parentId,
        );
        if (parentModule) {
          parentModule.atoms = [...parentModule.atoms, newAtomId];
        }
      }
    });
  }

  updateAtom(
    id: string,
    paramKey: keyof AtomUpdateParams,
    param: AtomUpdateParams[typeof paramKey],
  ) {
    const atomId = Number(getIdFromPrefix(id));
    const semesterId = Number(getSemesterIdFromPrefix(id));
    const atom = this.atoms.find((a) => a.id === atomId);
    if (!atom) return;

    const strategy = atomStrategyRegistry[paramKey];
    if (!strategy) {
      console.warn(`Нет стратегии для paramKey: ${paramKey}`);
      return;
    }

    runInAction(() => {
      strategy.updateLocal(atom, semesterId, param, paramKey);
    });

    strategy.updateRemote(atomId, semesterId, param, paramKey).catch((err) => {
      console.error(`Ошибка обновления ${paramKey}`, err);
    });
  }

  expandAtom(id: string, semesterNumber: number, direction: 'prev' | 'next') {
    const atomId = Number(getIdFromPrefix(id));
    const semesterId = this.semesters.find(
      (semester) => semester.number === semesterNumber,
    )?.id;

    const atom = this.atoms.find((atom) => atom.id === atomId);
    const semester = this.semesters.find(
      (semester) => semester.number === semesterNumber,
    );

    if (!atom || !semesterId || !semester) return;

    const newSemester: RefAtomSemesterDto = {
      semester: semester,
      credit: 0,
      attestations: [],
      academicActivityHours: [],
    };

    runInAction(() => {
      atom.semesters =
        direction === 'prev'
          ? [newSemester, ...atom.semesters]
          : [...atom.semesters, newSemester];
    });

    AtomInSemesterClient.createAtomInSemester(atomId, semesterId).then(() => {
      queryClient.invalidateQueries({
        queryKey: getSemestersQueryKey(commonStore.curriculumData?.id || 0),
      });
      queryClient.invalidateQueries({
        queryKey: getValidationErrorsQueryKey(
          commonStore.curriculumData?.id || 0,
        ),
      });
      message.success(ATOM_SUCCESS_UPDATE_MESSAGE);
    });
  }

  removeAtom(id: string) {
    const atomId = Number(getIdFromPrefix(id));
    const atomIndex = this.atoms.findIndex((atom) => atom.id === atomId);

    if (atomIndex === -1) {
      console.warn(`Атом с id = ${atomId} не найден`);
      return;
    }

    let parentModule: ModuleShortDto | undefined;

    if (getParentIdFromPrefix(id) !== getSemesterIdFromPrefix(id)) {
      parentModule = this.modules.find(
        (module) => module.id === Number(getParentIdFromPrefix(id)),
      );
    }

    runInAction(() => {
      if (!!parentModule) {
        const atomIndexInParent = parentModule.atoms.findIndex(
          (moduleAtomId) => moduleAtomId === atomId,
        );
        parentModule.atoms.splice(atomIndexInParent, 1);
      }

      this.atoms.splice(atomIndex, 1);
    });

    AtomClient.deleteAtom(atomId).then(() => {
      queryClient.invalidateQueries({
        queryKey: getSemestersQueryKey(commonStore.curriculumData?.id || 0),
      });
      queryClient.invalidateQueries({
        queryKey: getValidationErrorsQueryKey(
          commonStore.curriculumData?.id || 0,
        ),
      });
      message.success(ATOM_SUCCESS_DELETE_MESSAGE);
    });
  }
}
