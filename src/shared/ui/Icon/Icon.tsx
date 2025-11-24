import React from 'react';
import { IconProps, IconType } from './Icon.types.ts';
import './Icon.scss';
import clsx from 'clsx';

const fillIcons = import.meta.glob('/src/shared/assets/icons/fill/*.svg', {
  eager: true,
  import: 'ReactComponent',
});

const strokeIcons = import.meta.glob('/src/shared/assets/icons/stroke/*.svg', {
  eager: true,
  import: 'ReactComponent',
});

const iconMap: Record<
  string,
  {
    component: React.FC<React.SVGProps<SVGSVGElement>>;
    type: IconType;
  }
> = {};

const parseIconsImports = (
  type: 'fill' | 'stroke',
  icons: Record<string, typeof fillIcons | typeof strokeIcons>,
) => {
  Object.entries(icons).forEach(([path, module]) => {
    const iconPath = path.split('/').pop();
    if (!iconPath) return;
    const iconName = iconPath.replace('.svg', '');

    iconMap[iconName] = {
      component: module as React.FC<React.SVGProps<SVGSVGElement>>,
      type,
    };
  });
};

parseIconsImports('fill', fillIcons);
parseIconsImports('stroke', strokeIcons);

export const Icon = (props: IconProps) => {
  const { name, size, color, className, type, style, ...rest } = props;

  if (!name) return null;

  const iconData = iconMap[name];

  if (!iconData) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  const { component: SvgIcon, type: autoType } = iconData;
  const finalType = type || autoType;

  const cssVars = {
    '--icon-size': typeof size === 'number' ? `${size}px` : size,
    '--icon-color': color,
  };

  const combinedStyle = { ...cssVars, ...style };

  const classNames = clsx('icon', `icon--${finalType}`, className);

  return (
    <SvgIcon
      className={classNames}
      style={combinedStyle}
      data-type={finalType}
      {...rest}
    />
  );
};
