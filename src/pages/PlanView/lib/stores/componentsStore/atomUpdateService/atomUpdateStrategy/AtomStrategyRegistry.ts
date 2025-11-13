import {
  AcademicHoursStrategy
} from "@/pages/PlanView/lib/stores/componentsStore/atomUpdateService/atomUpdateStrategy/AcademicHoursStrategy.ts";
import {
  AttestationsStrategy
} from "@/pages/PlanView/lib/stores/componentsStore/atomUpdateService/atomUpdateStrategy/AttestationsStrategy.ts";
import { CreditStrategy } from "@/pages/PlanView/lib/stores/componentsStore/atomUpdateService/atomUpdateStrategy/CreditStrategy.ts";
import {
  AtomUpdateStrategy
} from "@/pages/PlanView/lib/stores/componentsStore/atomUpdateService/atomUpdateStrategy/AtomUpdateStrategy.ts";
import { CommonStrategy } from "@/pages/PlanView/lib/stores/componentsStore/atomUpdateService/atomUpdateStrategy/CommonStrategy.ts";
import {
  CompetenceStrategy
} from "@/pages/PlanView/lib/stores/componentsStore/atomUpdateService/atomUpdateStrategy/CompetenceStrategy.ts";

export const atomStrategyRegistry: Record<string, AtomUpdateStrategy> = {
  credit: new CreditStrategy(),
  attestations: new AttestationsStrategy(),
  academicHours: new AcademicHoursStrategy(),
  competenceIds: new CompetenceStrategy(),

  name: new CommonStrategy(),
  type: new CommonStrategy(),
  isRequired: new CommonStrategy(),
  department: new CommonStrategy(),
};