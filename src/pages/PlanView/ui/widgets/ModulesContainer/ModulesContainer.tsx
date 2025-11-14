import { observer } from 'mobx-react-lite';
import { positionsStore } from '@/pages/PlanView/stores/positionsStore.ts';
import { optionsStore } from '@/pages/PlanView/stores/optionsStore.ts';
import { CursorMode } from '@/pages/PlanView/types/types.ts';
import { commonStore } from '@/pages/PlanView/stores/commonStore.ts';
import { componentsStore } from '@/pages/PlanView/stores/componentsStore/componentsStore.ts';
import ModuleLayout from '@/pages/PlanView/ui/widgets/ModuleLayout/ModuleLayout.tsx';

export const ModulesContainer = observer(() => {

  const modules = !commonStore.isLoadingData ?
    componentsStore.modules
    .filter((module) => module.parentModuleId === null)
    .sort((a, b) =>
      a?.semesters &&
      b?.semesters &&
      !!a.semesters[0] &&
      !!b.semesters[0]
        ? a.semesters[0].semester.number -
        b.semesters[0].semester.number
        : 0,
    ) : [];

  return (
    <div
      className={'h-full absolute'}
      style={{
        left: `${positionsStore.atomsContainerWidth + 0.2}%`,
        width: `${100 - positionsStore.atomsContainerWidth - 0.2}%`,
        cursor:
          optionsStore.toolsOptions.cursorMode === CursorMode.Hand
            ? 'grab'
            : 'auto',
        pointerEvents:
          optionsStore.toolsOptions.cursorMode === CursorMode.Hand
            ? 'none'
            : 'auto',
      }}
    >
      {
        modules.map(module =>
          <ModuleLayout {...module} key={module.id} />)
      }
    </div>
  )
})