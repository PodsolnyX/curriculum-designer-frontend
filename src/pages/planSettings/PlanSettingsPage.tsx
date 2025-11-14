import PlanPageLayout from '@/widgets/PlanPageLayout/PlanPageLayout.tsx';
import { getPlanMenuItems } from '@/shared/const/planMenuItems.ts';
import { Menu, MenuProps, Typography } from 'antd';
import { useGetCurriculumQuery } from '@/api/axios-client/CurriculumQuery.ts';
import { useParams } from 'react-router-dom';
import React, { useState } from 'react';
import ActivityTab from '@/pages/PlanSettings/ui/ActivityTab/ActivityTab.tsx';
import CommonSettingsTab from '@/pages/PlanSettings/ui/CommonSettingsTab/CommonSettingsTab.tsx';
import ValidationTab from '@/pages/PlanSettings/ui/ValidationTab/ValidationTab.tsx';

const PlanSettingsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data } = useGetCurriculumQuery({ id: Number(id) });
  const [currentTab, setCurrentTab] = useState(SettingsTab.Common);

  const onClick: MenuProps['onClick'] = (e) => {
    setCurrentTab(e.key);
  };

  const headerExtra = () => {
    return (
      <div className={'flex justify-between w-full flex-wrap'}>
        <div className={'flex flex-col'}>
          <Typography className={'text-sm text-stone-400'}>
            {data?.name}
          </Typography>
          <Typography className={'text-2xl'}>{'Настройки'}</Typography>
        </div>
        <div className={'-mb-[23px] flex items-end'}>
          <Menu
            onClick={onClick}
            selectedKeys={[currentTab]}
            mode="horizontal"
            items={items}
          />
        </div>
      </div>
    );
  };

  const Tabs: Record<SettingsTab, React.ReactNode> = {
    [SettingsTab.Common]: <CommonSettingsTab />,
    [SettingsTab.Activity]: <ActivityTab />,
    [SettingsTab.Validation]: <ValidationTab />,
  };

  return (
    <PlanPageLayout
      menuItems={getPlanMenuItems(id || '')}
      currentMenuItem={'settings'}
      headerExtra={headerExtra}
    >
      <div className={'p-5'}>{Tabs[currentTab]}</div>
    </PlanPageLayout>
  );
};

enum SettingsTab {
  Common = 'common',
  Activity = 'activity',
  Validation = 'validation',
}

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
  {
    label: 'Общее',
    key: SettingsTab.Common,
  },
  {
    label: 'Академ. активности',
    key: SettingsTab.Activity,
  },
  {
    label: 'Валидация',
    key: SettingsTab.Validation,
  },
];

export default PlanSettingsPage;
