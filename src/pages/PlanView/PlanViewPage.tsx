import PlanSidebar from '@/pages/PlanView/ui/widgets/PlanSidebar/PlanSidebar.tsx';
import PageLoader from '@/shared/ui/PageLoader/PageLoader.tsx';
import PlanHeader from '@/pages/PlanView/ui/widgets/PlanHeader/PlanHeader.tsx';
import ViewWrapper from '@/pages/PlanView/ui/widgets/ViewWrapper/ViewWrapper.tsx';
import { commonStore } from '@/pages/PlanView/stores/commonStore.ts';
import { observer } from 'mobx-react-lite';
import { useCurriculumData } from '@/pages/PlanView/hooks/useCurriculumData.ts';
import {
  SemestersContainer
} from '@/pages/PlanView/ui/widgets/SemestersContainer/SemestersContainer.tsx';
import { ModulesContainer } from '@/pages/PlanView/ui/widgets/ModulesContainer/ModulesContainer.tsx';

const PlanViewPage = observer(() => {

  useCurriculumData({ modulesPlainList: true });

  return (
    <div className={'flex flex-col bg-stone-100 relative'}>
      <PageLoader loading={commonStore.isLoadingData} />
      <ViewWrapper
        header={!commonStore.isLoadingData && <PlanHeader />}
        sidebar={<PlanSidebar />}
      >
        <SemestersContainer/>
        <ModulesContainer/>
      </ViewWrapper>
    </div>
  );
});

export default PlanViewPage;
