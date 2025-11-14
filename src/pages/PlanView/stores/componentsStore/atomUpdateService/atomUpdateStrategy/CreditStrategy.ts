import { runInAction } from 'mobx';
import { BaseAtomStrategy } from './AtomUpdateStrategy.ts';
import { AtomDto } from '@/api/axios-client.types.ts';
import { Client as AtomInSemesterClient } from '@/api/axios-client/AtomInSemesterQuery.ts';
import { Client as AtomClient } from '@/api/axios-client/AtomQuery.ts';
import { componentsStore } from '@/pages/PlanView/stores/componentsStore/componentsStore.ts';

export class CreditStrategy extends BaseAtomStrategy {
  updateLocal(atom: AtomDto, semesterId: number, param: number) {
    const semester = atom.semesters.find((s) => s.semester.id === semesterId);
    if (semester) semester.credit = param;
  }

  async updateRemote(atomId: number, semesterId: number, param: number) {
    await AtomInSemesterClient.setAtomCredit(atomId, semesterId, {
      credit: param as number,
    });
    this.invalidateAndNotify();
    const updated = await AtomClient.getAtom(atomId);

    runInAction(() => {
      const semester = updated.semesters.find(
        (s) => s.semester.id === semesterId,
      );
      const atom = this.findAtom(atomId);
      const local =
        atom && atom.semesters.find((s) => s.semester.id === semesterId);
      if (semester && local)
        local.academicActivityHours = semester.academicActivityHours;
    });
  }

  private findAtom(id: number): AtomDto | undefined {
    return componentsStore.atoms.find((a) => a.id === id);
  }
}
