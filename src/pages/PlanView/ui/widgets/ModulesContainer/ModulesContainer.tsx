import { observer } from 'mobx-react-lite';
import { commonStore } from '@/pages/PlanView/stores/commonStore.ts';
import { componentsStore } from '@/pages/PlanView/stores/componentsStore/componentsStore.ts';
import ModuleLayout from '@/pages/PlanView/ui/widgets/ModuleLayout/ModuleLayout.tsx';

export const ModulesContainer = observer(() => {
  const modules = componentsStore.modules
    .filter((module) => module.parentModuleId === null)
    .sort((a, b) =>
      a?.semesters && b?.semesters && !!a.semesters[0] && !!b.semesters[0]
        ? a.semesters[0].semester.number - b.semesters[0].semester.number
        : 0,
    );

  return commonStore.isLoadingData
    ? null
    : modules.map((module) => <ModuleLayout {...module} key={module.id} />);
});
