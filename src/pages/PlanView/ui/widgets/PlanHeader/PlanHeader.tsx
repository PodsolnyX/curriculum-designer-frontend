import { useParams } from 'react-router-dom';
import ToolsPanel from '@/pages/PlanView/ui/widgets/PlanHeader/ui/ToolsPanel/ToolsPanel.tsx';
import { useGetCurriculumQuery } from '@/api/axios-client/CurriculumQuery.ts';
import ValidationPanel from '@/pages/PlanView/ui/widgets/PlanHeader/ui/ValidationPanel/ValidationPanel.tsx';
import cls from './PlanHeader.module.scss';
import clsx from 'clsx';
import { PlanMenu } from '@/pages/PlanView/ui/widgets/PlanHeader/ui/PlanMenu/PlanMenu.tsx';
import { CurriculumStatusBadge } from '@/features/CurriculumStatusBadge';

const PlanHeader = () => {
  const { id } = useParams<{ id: string | number }>();

  const { data: curriculumData } = useGetCurriculumQuery({ id: Number(id) });

  return (
    <header className={cls.PlanHeader}>
      <div className={cls.MainContainer}>
        <div className={cls.TitleContainer}>
          <h1>{curriculumData?.name}</h1>
          <CurriculumStatusBadge
            curriculumId={id || ''}
            status={curriculumData?.status}
          />
        </div>
        <PlanMenu />
      </div>
      <div className={clsx(cls.ToolsContainer)}>
        <ValidationPanel />
        <ToolsPanel />
      </div>
    </header>
  );
};

export default PlanHeader;
