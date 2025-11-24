import PlanSidebar from '@/pages/PlanView/ui/widgets/PlanSidebar/PlanSidebar.tsx';
import PageLoader from '@/shared/ui/PageLoader/PageLoader.tsx';
import PlanHeader from '@/pages/PlanView/ui/widgets/PlanHeader/PlanHeader.tsx';
import ViewWrapper from '@/pages/PlanView/ui/widgets/ViewWrapper/ViewWrapper.tsx';
import { commonStore } from '@/pages/PlanView/stores/commonStore.ts';
import { observer } from 'mobx-react-lite';
import { useCurriculumData } from '@/pages/PlanView/hooks/useCurriculumData.ts';
import { ModulesContainer } from '@/pages/PlanView/ui/widgets/ModulesContainer/ModulesContainer.tsx';
import cls from './PlanViewPage.module.scss';
import { optionsStore } from '@/pages/PlanView/stores/optionsStore.ts';
import { CursorMode } from '@/pages/PlanView/types/types.ts';
import { componentsStore } from '@/pages/PlanView/stores/componentsStore/componentsStore.ts';
import clsx from 'clsx';
import { useViewWidth } from '@/pages/PlanView/hooks/useViewWidth.ts';
import { SemestersContainer } from '@/pages/PlanView/ui/widgets/SemestersContainer/SemestersContainer.tsx';
import {
  ScaleOffsetRight,
  ScaleOffsetTop,
} from '@/pages/PlanView/ui/features/ScaleOffset/ScaleOffset.tsx';

const PlanViewPage = observer(() => {
  useCurriculumData({ modulesPlainList: true });

  const viewRef = useViewWidth();
  const countSemesters = componentsStore.semesters.length;

  return (
    <div className={cls.PlanViewPage}>
      <PageLoader loading={commonStore.isLoadingData} />
      <ViewWrapper
        header={!commonStore.isLoadingData && <PlanHeader />}
        sidebar={<PlanSidebar />}
      >
        <ScaleOffsetTop />
        <div className={cls.OffsetContainer}>
          <div
            className={clsx(cls.ViewGrid, {
              [cls.ViewMode]:
                optionsStore.toolsOptions.cursorMode === CursorMode.Hand,
            })}
            style={{
              gridTemplateRows: `repeat(${countSemesters}, auto)`,
            }}
            ref={viewRef}
          >
            <SemestersContainer />
            <ModulesContainer />
          </div>
          <ScaleOffsetRight />
        </div>
      </ViewWrapper>
    </div>
  );
});

export default PlanViewPage;
