import { Icon, IconName } from '@/shared/ui/Icon';
import { Tooltip } from 'antd';
import clsx from 'clsx';
import cls from './ToolButton.module.scss';
import React from 'react';

interface ToolsButtonProps {
  name: string;
  icon: IconName;
  selected?: boolean;

  onClick?(): void;
}

export const ToolButton = (props: ToolsButtonProps) => {
  const { name, icon, selected, onClick } = props;

  return (
    <Tooltip title={name}>
      <div
        className={clsx(cls.ToolButton, {
          [cls.Selected]: selected,
        })}
        onClick={onClick}
      >
        <Icon name={icon} size={20} />
      </div>
    </Tooltip>
  );
};
