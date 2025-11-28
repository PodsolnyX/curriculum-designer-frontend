import React from 'react';

export type IconType = 'fill' | 'stroke';

export type IconName =
  // Fill icons
  | 'board'
  | 'diagram'
  | 'document'
  | 'error'
  | 'hall'
  | 'hat'
  | 'info'
  | 'logout'
  | 'minus-lens'
  | 'more'
  | 'plus-lens'
  | 'profile'
  | 'settings'
  | 'success'
  | 'tracks'
  | 'warning'
  // Stroke icons
  | 'asterisk'
  | 'comment'
  | 'cursor'
  | 'hand'
  | 'minus'
  | 'module'
  | 'move'
  | 'plus'
  | 'selection'
  | 'subject';

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  name?: IconName;
  size?: number | string;
  color?: string;
  type?: IconType;
}
