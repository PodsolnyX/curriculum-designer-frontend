import { ModuleSemestersPosition } from '@/pages/PlanView/types/types.ts';
import { CSSProperties } from 'react';

export const getModuleRootStyles = (
  height: number,
  position: ModuleSemestersPosition,
): CSSProperties => {
  return position === 'single'
    ? { height: height - 8 }
    : ['first', 'last'].includes(position)
      ? { height: height - 6 }
      : { height };
};