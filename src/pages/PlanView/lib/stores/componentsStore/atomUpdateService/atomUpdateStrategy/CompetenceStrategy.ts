import { BaseAtomStrategy } from "@/pages/PlanView/lib/stores/componentsStore/atomUpdateService/atomUpdateStrategy/AtomUpdateStrategy.ts";
import {Client as AtomCompetenceClient} from "@/api/axios-client/AtomCompetenceQuery.ts";
import {commonStore} from "@/pages/PlanView/lib/stores/commonStore.ts";
import { AtomDto, CompetenceDistributionType } from "@/api/axios-client.types.ts";

export class CompetenceStrategy extends BaseAtomStrategy {
  updateLocal(atom: AtomDto, _semesterId: number, param: number[]) {
    const type = commonStore.curriculumData?.settings.competenceDistributionType;
    if (type === CompetenceDistributionType.Competence) {
      atom.competenceIds = param;
    } else {
      atom.competenceIndicatorIds = param;
    }
  }

  async updateRemote(atomId: number, _semesterId: number, param: number[]) {
    const type = commonStore.curriculumData?.settings.competenceDistributionType;
    if (!type) return;

    if (type === CompetenceDistributionType.Competence) {
      await AtomCompetenceClient.setAtomCompetences(atomId, { competenceIds: param });
    } else {
      await AtomCompetenceClient.setAtomCompetenceIndicators(atomId, { competenceIndicatorIds: param });
    }

    this.invalidateAndNotify();
  }
}