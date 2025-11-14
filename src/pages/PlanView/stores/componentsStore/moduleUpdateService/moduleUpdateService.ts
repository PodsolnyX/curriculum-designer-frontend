import {
  AtomDto,
  CreateModuleDto,
  CreateModuleWithSelectionDto,
  CreateUpdateSelectionDto,
  SelectionDto,
  SemesterDto,
} from '@/api/axios-client.types.ts';
import { ModuleShortDto } from '@/pages/PlanView/types/types.ts';
import {
  getIdFromPrefix,
  getParentIdFromPrefix,
  getSemesterIdFromPrefix,
} from '@/pages/PlanView/helpers/prefixIdHelpers.ts';
import { runInAction } from 'mobx';
import { Client as ModuleClient } from '@/api/axios-client/ModuleQuery.ts';
import { Client as SelectionClient } from '@/api/axios-client/SelectionQuery.ts';
import { message } from 'antd';
import {
  MODULE_SUCCESS_CREATE_MESSAGE,
  MODULE_SUCCESS_DELETE_MESSAGE,
  MODULE_SUCCESS_UPDATE_MESSAGE,
} from '@/shared/const/messages.ts';

export class ModuleUpdateService {
  constructor(
    private curriculumId: number,
    private atoms: AtomDto[],
    private modules: ModuleShortDto[],
    private semesters: SemesterDto[],
  ) {}

  async createModule(targetId: string, isSelection: boolean = false) {
    const semesterId = Number(getSemesterIdFromPrefix(targetId));
    const parentId = Number(getIdFromPrefix(targetId));

    const newModuleParams: CreateModuleDto = {
      name: isSelection ? 'Новый выбор дисциплин' : 'Новый модуль',
      parentSemesterId: semesterId,
      parentModuleId: semesterId === parentId ? null : parentId,
      curriculumId: this.curriculumId,
    };

    const newSelectionParams: CreateModuleWithSelectionDto = {
      module: newModuleParams,
      selection: {
        semesters: [
          {
            semesterId: semesterId,
            credit: 0,
          },
        ],
      },
    };

    const newModuleId = isSelection
      ? await ModuleClient.createModuleWithSelection(newSelectionParams)
      : await ModuleClient.createModule(newModuleParams);

    const newModule: ModuleShortDto = {
      id: newModuleId,
      parentModuleId: newModuleParams.parentModuleId,
      curriculumId: newModuleParams.curriculumId,
      parentSemesterId: newModuleParams.parentSemesterId,
      name: newModuleParams.name,
      atoms: [],
      modules: [],
      semesters: [
        {
          semester: this.semesters.find(
            (semester) => semester.id === semesterId,
          ) as SemesterDto,
          elective: {
            credit: 0,
            attestations: [],
            academicActivityHours: [],
          },
          nonElective: {
            credit: 0,
            attestations: [],
            academicActivityHours: [],
          },
        },
      ],
      index: null,
      selection: isSelection
        ? (newSelectionParams.selection as SelectionDto)
        : null,
    };

    message.success(MODULE_SUCCESS_CREATE_MESSAGE);

    runInAction(() => {
      this.modules.push(newModule);
      if (semesterId !== parentId) {
        const parentModule = this.modules.find(
          (module) => module.id === parentId,
        );
        if (parentModule) {
          parentModule.modules = [...parentModule.modules, newModuleId];
        }
      }
    });
  }

  updateModuleName(id: string, newName: string) {
    const moduleId = Number(getIdFromPrefix(id));
    const module = this.modules.find((module) => module.id === moduleId);

    if (!module) {
      console.warn(`Модуль с id = ${moduleId} не обнаружен`);
      return;
    }

    runInAction(() => {
      module.name = newName;
    });

    ModuleClient.updateModule(moduleId, { name: newName }).then(() => {
      message.success(MODULE_SUCCESS_UPDATE_MESSAGE);
    });
  }

  transformModuleToSelection(id: string) {
    const moduleId = Number(getIdFromPrefix(id));
    const module = this.modules.find((module) => module.id === moduleId);

    if (!module) {
      console.warn(`Модуль с id = ${moduleId} не обнаружен`);
      return;
    }

    const newSelection: CreateUpdateSelectionDto = {
      semesters: module.semesters.map((semester) => ({
        semesterId: semester.semester.id,
        credit: 0,
      })),
    };

    runInAction(() => {
      module.selection = newSelection as SelectionDto;
    });

    SelectionClient.createUpdateSelection(moduleId, newSelection).then(() => {
      message.success(MODULE_SUCCESS_UPDATE_MESSAGE);
    });
  }

  transformSelectionToModule(id: string) {
    const moduleId = Number(getIdFromPrefix(id));
    const module = this.modules.find((module) => module.id === moduleId);

    if (!module) {
      console.warn(`Модуль с id = ${moduleId} не обнаружен`);
      return;
    }

    runInAction(() => {
      module.selection = null;
    });

    SelectionClient.deleteSelection(moduleId).then(() => {
      message.success(MODULE_SUCCESS_UPDATE_MESSAGE);
    });
  }

  removeModule(id: string) {
    const moduleId = Number(getIdFromPrefix(id));
    const moduleIndex = this.modules.findIndex(
      (module) => module.id === moduleId,
    );

    if (moduleIndex === -1) {
      console.warn(`Моодуль с id = ${moduleId} не найден`);
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
        const moduleIndexInParent = parentModule.atoms.findIndex(
          (childrenModuleId) => childrenModuleId === moduleId,
        );
        parentModule.atoms.splice(moduleIndexInParent, 1);
      }

      this.atoms.forEach((atom) => {
        if (atom.parentModuleId === moduleId) {
          atom.parentModuleId = parentModule ? parentModule.id : null;
        }
      });

      this.modules.splice(moduleIndex, 1);
    });

    ModuleClient.deleteModule(moduleId).then(() => {
      message.success(MODULE_SUCCESS_DELETE_MESSAGE);
    });
  }
}
