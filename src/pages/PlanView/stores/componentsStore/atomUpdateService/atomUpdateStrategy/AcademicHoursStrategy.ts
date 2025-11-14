import { BaseAtomStrategy } from '@/pages/PlanView/stores/componentsStore/atomUpdateService/atomUpdateStrategy/AtomUpdateStrategy.ts';
import { AtomDto } from '@/api/axios-client.types.ts';
import { commonStore } from '@/pages/PlanView/stores/commonStore.ts';
import { Client as HoursDistributionClient } from '@/api/axios-client/HoursDistributionQuery.ts';
import { runInAction } from 'mobx';
import { Client as AtomClient } from '@/api/axios-client/AtomQuery.ts';
import { componentsStore } from '@/pages/PlanView/stores/componentsStore/componentsStore.ts';

export class AcademicHoursStrategy extends BaseAtomStrategy {
  updateLocal(
    atom: AtomDto,
    semesterId: number,
    param: { id: number; value: number | undefined },
  ) {
    const semester = atom.semesters.find((s) => s.semester.id === semesterId);
    if (!semester) return;

    const { id, value } = param;

    if (id && value === -1) {
      semester.academicActivityHours = semester.academicActivityHours.filter(
        (h) => h.academicActivity.id !== id,
      );
    } else if (id && value !== undefined && value >= 0) {
      semester.academicActivityHours = semester.academicActivityHours.map(
        (h) => (h.academicActivity.id === id ? { ...h, value } : h),
      );
    } else {
      const activity = commonStore.academicActivity?.find((a) => a.id === id);
      if (activity) {
        semester.academicActivityHours.push({
          academicActivity: activity,
          value: 0,
          isCalculated: false,
        });
      }
    }
  }

  async updateRemote(
    atomId: number,
    semesterId: number,
    param: { id: number; value: number | undefined },
  ) {
    const { id, value } = param;
    if (!id) return;

    if (value === -1) {
      await HoursDistributionClient.deleteHoursDistribution(
        commonStore.curriculumData.id,
        id,
        semesterId,
        atomId,
      );
    } else {
      await HoursDistributionClient.createUpdateHoursDistribution(
        commonStore.curriculumData.id,
        id,
        { value: value ?? 0 },
        semesterId,
        atomId,
      );
    }

    this.invalidateAndNotify();
    const updated = await AtomClient.getAtom(atomId);
    runInAction(() => {
      const semester = updated.semesters.find(
        (s) => s.semester.id === semesterId,
      );
      const local = componentsStore.atoms
        .find((a) => a.id === atomId)
        ?.semesters.find((s) => s.semester.id === semesterId);
      if (semester && local)
        local.academicActivityHours = semester.academicActivityHours;
    });
  }
}
