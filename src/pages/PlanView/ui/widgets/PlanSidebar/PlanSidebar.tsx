import { CloseOutlined } from '@ant-design/icons';
import ValidationContent from '@/pages/PlanView/ui/widgets/PlanSidebar/ui/ValidationContent/ValidationContent.tsx';
import AtomContent from '@/pages/PlanView/ui/widgets/PlanSidebar/ui/AtomContent/AtomContent.tsx';
import { ReactNode } from 'react';
import { commonStore } from '@/pages/PlanView/stores/commonStore.ts';
import { observer } from 'mobx-react-lite';
import { SidebarContent } from '@/pages/PlanView/types/types.ts';
import cls from './PlanSidebar.module.scss';
import clsx from 'clsx';

const PlanSidebar = observer(() => {
  const content: Record<SidebarContent, ReactNode> = {
    validation: <ValidationContent />,
    atom: <AtomContent />,
  };

  return (
    <div
      className={clsx(cls.Sidebar, {
        [cls.Visible]: !!content[commonStore.sideBarContent],
        [cls.Hidden]: !content[commonStore.sideBarContent],
      })}
    >
      <div className={cls.MainContent}>
        <CloseOutlined
          className={clsx(cls.CloseButton)}
          onClick={() => commonStore.setSideBarContent(null)}
        />
        {content[commonStore.sideBarContent]}
      </div>
    </div>
  );
});

export default PlanSidebar;
