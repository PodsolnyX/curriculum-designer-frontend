import { CloseOutlined } from '@ant-design/icons';
import ValidationContent from '@/pages/PlanView/ui/widgets/PlanSidebar/ui/ValidationContent/ValidationContent.tsx';
import AtomContent from '@/pages/PlanView/ui/widgets/PlanSidebar/ui/AtomContent/AtomContent.tsx';
import { ReactNode } from 'react';
import { commonStore } from '@/pages/PlanView/stores/commonStore.ts';
import { observer } from 'mobx-react-lite';
import { SidebarContent } from '@/pages/PlanView/types/types.ts';

const PlanSidebar = observer(() => {
  const content: Record<SidebarContent, ReactNode> = {
    validation: <ValidationContent />,
    atom: <AtomContent />,
  };

  return (
    <div
      style={{ height: 'calc(100vh - 64px)' }}
      className={`shadow-lg overflow-y-auto ${!!content[commonStore.sideBarContent] ? 'max-w-[330px] p-5 ' : 'max-w-[0px] p-0'} transition-all bg-white/[1]  w-full min-h-full border-l border-l-stone-200 border-solid`}
    >
      <CloseOutlined
        className={`absolute top-3 ${!!content[commonStore.sideBarContent] ? 'block' : 'hidden'} right-3 text-stone-400 hover:text-black transition hover:bg-stone-100 p-1 rounded-full`}
        onClick={() => commonStore.setSideBarContent(null)}
      />
      {content[commonStore.sideBarContent]}
    </div>
  );
});

export default PlanSidebar;
