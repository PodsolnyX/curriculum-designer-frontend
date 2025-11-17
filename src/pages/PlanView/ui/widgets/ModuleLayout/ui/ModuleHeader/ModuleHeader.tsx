import { NameInput } from '@/pages/PlanView/ui/features/NameInput/NameInput.tsx';
import { componentsStore } from '@/pages/PlanView/stores/componentsStore/componentsStore.ts';
import { ModuleContextMenu } from '@/pages/PlanView/ui/widgets/ModuleLayout/ui/ModuleContextMenu/ModuleContextMenu.tsx';
import React from 'react';
import cls from './ModuleHeader.module.scss';
import clsx from 'clsx';

interface ModuleHeaderProps {
  id: string;
  name: string;
  isSelection: boolean;
  gridColumnsCount: number;
  showMenu?: boolean;
}

export const ModuleHeader = (props: ModuleHeaderProps) => {
  const { id, name, isSelection, gridColumnsCount, showMenu } = props;

  return (
    <div style={{ width: gridColumnsCount * 200 }} className={cls.ModuleHeader}>
      <NameInput
        value={name}
        onChange={(value) => componentsStore.updateModuleName(id, value)}
      >
        <div
          className={clsx(cls.Title, {
            [cls.Selection]: isSelection,
          })}
          title={name}
        >
          {name}
        </div>
      </NameInput>
      <ModuleContextMenu
        moduleId={id}
        isSelection={isSelection}
        show={showMenu}
      />
    </div>
  );
};
