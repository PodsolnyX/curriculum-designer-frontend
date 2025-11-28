import { NameInput } from '@/pages/PlanView/ui/features/NameInput/NameInput.tsx';
import { componentsStore } from '@/pages/PlanView/stores/componentsStore/componentsStore.ts';
import { ModuleContextMenu } from '@/pages/PlanView/ui/widgets/ModuleLayout/ui/ModuleContextMenu/ModuleContextMenu.tsx';
import React from 'react';
import cls from './ModuleHeader.module.scss';
import clsx from 'clsx';
import { Icon } from '@/shared/ui/Icon';

interface ModuleHeaderProps {
  id: string;
  name: string;
  isSelection: boolean;
  moduleColor: string | null;
}

export const ModuleHeader = (props: ModuleHeaderProps) => {
  const { id, name, isSelection, moduleColor } = props;

  return (
    <div
      className={clsx(cls.ModuleHeader, {
        [cls.Selection]: isSelection,
      })}
    >
      {isSelection && (
        <Icon size={20} name={'selection'} className={cls.Icon} />
      )}
      <NameInput
        value={name}
        onChange={(value) => componentsStore.updateModuleName(id, value)}
        height={200}
      >
        <div className={cls.Title} title={name}>
          {name}
        </div>
      </NameInput>
      <ModuleContextMenu
        moduleId={id}
        isSelection={isSelection}
        moduleColor={moduleColor}
      />
    </div>
  );
};
