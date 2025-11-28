import cls from './SeparatorLine.module.scss';
import clsx from 'clsx';
import React from 'react';

interface SeparatorLineProps {
  isSelection: boolean;
  rowIndex: number;
}

export const SeparatorLine = ({
  isSelection,
  rowIndex,
}: SeparatorLineProps) => {
  return (
    <span
      className={clsx(cls.SeparatorLine, {
        [cls.SelectionLine]: isSelection,
      })}
      style={{
        gridRow: rowIndex + 1,
        gridColumn: `auto`,
      }}
    ></span>
  );
};
