import cls from './RequiredToggle.module.scss';
import clsx from 'clsx';
import React from 'react';
import { Icon } from '@/shared/ui/Icon';

interface RequiredToggleProps {
  id: string;
  isRequired: boolean;
}

export const RequiredToggle = (props: RequiredToggleProps) => {
  const { id, isRequired } = props;

  return (
    <span className={clsx(cls.RequiredToggle, isRequired && cls.Selected)}>
      <Icon name={'asterisk'} size={10} />
    </span>
  );
};
