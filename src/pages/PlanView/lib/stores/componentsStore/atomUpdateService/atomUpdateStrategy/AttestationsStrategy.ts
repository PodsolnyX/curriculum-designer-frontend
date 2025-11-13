import { BaseAtomStrategy } from "@/pages/PlanView/lib/stores/componentsStore/atomUpdateService/atomUpdateStrategy/AtomUpdateStrategy.ts";
import { AtomDto } from "@/api/axios-client.types.ts";
import { commonStore } from "@/pages/PlanView/lib/stores/commonStore.ts";
import {Client as AttestationClient} from "@/api/axios-client/AttestationQuery.ts";

export class AttestationsStrategy extends BaseAtomStrategy {
  updateLocal(atom: AtomDto, semesterId: number, param: number[]) {
    const semester = atom.semesters.find(s => s.semester.id === semesterId);
    if (!semester) return;
    semester.attestations = param.map(id =>
      commonStore.attestationTypes?.find(a => a.id === id) ?? { id, name: "", shortName: "" }
    );
  }

  async updateRemote(atomId: number, semesterId: number, param: number[]) {
    await AttestationClient.setAttestation({ atomId, semesterId, attestationIds: param });
    this.invalidateAndNotify();
  }
}