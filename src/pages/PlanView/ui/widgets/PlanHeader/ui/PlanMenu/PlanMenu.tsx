import cls from './PlanMenu.module.scss';
import { getPlanMenuItems } from '@/shared/const/planMenuItems.ts';
import { Link, useParams } from 'react-router-dom';
import { Icon, IconName } from '@/shared/ui/Icon';
import DisplaySettingsPopover from '@/pages/PlanView/ui/widgets/PlanHeader/ui/DisplaySettingsPopover/DisplaySettingsPopover.tsx';
import { ExportPlanModal } from '@/pages/PlanView/ui/widgets/PlanHeader/ui/ExportPlanModal/ExportPlanModal.tsx';
import React, { useState } from 'react';

export const PlanMenu = () => {
  const { id } = useParams<{ id: string | number }>();
  const [openExportModal, setOpenExportModal] = useState(false);

  return (
    <div className={cls.Menu}>
      {getPlanMenuItems(id || '', false).map((item) => (
        <PlanMenuItem
          key={item.value}
          title={item.name}
          icon={item.icon}
          link={item.path}
        />
      ))}
      <PlanMenuItem
        title={'Экспорт'}
        onClick={() => setOpenExportModal(true)}
      />
      <DisplaySettingsPopover>
        <PlanMenuItem title={'Вид'} />
      </DisplaySettingsPopover>

      <ExportPlanModal
        open={openExportModal}
        onClose={() => setOpenExportModal(false)}
      />
    </div>
  );
};

interface PlanMenuItemProps {
  title: string;
  icon?: IconName;
  link?: string;

  onClick?(): void;
}

const PlanMenuItem = (props: PlanMenuItemProps) => {
  const { title, icon, link, onClick } = props;

  const Content = () => {
    return (
      <>
        <Icon name={icon} size={14} />
        <span>{title}</span>
      </>
    );
  };

  return link ? (
    <Link to={link} className={cls.MenuItem}>
      <Content />
    </Link>
  ) : (
    <span onClick={onClick} className={cls.MenuItem}>
      <Content />
    </span>
  );
};
