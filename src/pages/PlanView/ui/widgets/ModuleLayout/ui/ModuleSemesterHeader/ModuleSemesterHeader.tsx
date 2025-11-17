import cls from './ModuleSemesterHeader.module.scss';
import { Tag } from 'antd';
import CreditsSelector from '@/pages/PlanView/ui/features/CreditsSelector/CreditsSelector.tsx';
import React from 'react';

interface ModuleSemesterHeaderProps {
  semesterNumber: number;
  credits: number;
  isSelection?: boolean;

  onChangeCredits?(value: number): void;
}

export const ModuleSemesterHeader = (props: ModuleSemesterHeaderProps) => {
  const { semesterNumber, credits, isSelection, onChangeCredits } = props;

  return (
    <div className={cls.ModuleSemesterHeader}>
      <span className={cls.Title}>Семестр {semesterNumber}</span>
      {isSelection ? (
        <CreditsSelector credits={credits} onChange={onChangeCredits} />
      ) : (
        <Tag color={'default'} className={'m-0'} bordered={false}>
          {credits} ЗЕТ
        </Tag>
      )}
    </div>
  );
};
