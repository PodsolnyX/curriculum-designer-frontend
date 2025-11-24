import React, { useState } from 'react';
import cls from './AtomMenu.module.scss';
import { Icon, IconName } from '@/shared/ui/Icon';
import {
  AtomContextMenu,
  AtomContextMenuProps,
} from '@/pages/PlanView/ui/widgets/AtomCard/ui/AtomContextMenu/AtomContextMenu.tsx';
import clsx from 'clsx';
import { Tooltip } from 'antd';
import { componentsStore } from '@/pages/PlanView/stores/componentsStore/componentsStore.ts';

interface AtomMenuProps extends Omit<AtomContextMenuProps, 'children'> {
  isRequired?: boolean;
}

interface AtomMenuItemProps {
  itemKey: string;
  icon: IconName;
}

const items: AtomMenuItemProps[] = [
  {
    itemKey: 'comments',
    icon: 'comment',
  },
  {
    itemKey: 'required',
    icon: 'asterisk',
  },
  {
    itemKey: 'more',
    icon: 'more',
  },
] as const;

type ItemKeyType = (typeof items)[number]['itemKey'];

export const AtomMenu = (props: AtomMenuProps) => {
  const { id, isRequired, ...rest } = props;

  const [selectedItem, selectItem] = useState<ItemKeyType | null>(null);

  return (
    <div
      className={clsx(cls.Menu, { [cls.Opened]: !!selectedItem })}
      onClick={(event) => event.stopPropagation()}
    >
      {items.map((item) => {
        const content = (
          <div
            className={clsx(cls.MenuItem, {
              [cls.Selected]: selectedItem === item.itemKey,
              [cls.RequiredItem]: isRequired && item.itemKey === 'required',
            })}
            key={item.itemKey}
            onClick={() => {
              if (item.itemKey === 'required') {
                componentsStore.updateAtom(id, 'isRequired', !isRequired);
              }
            }}
          >
            <Icon name={item.icon} size={12} />
          </div>
        );

        if (item.itemKey === 'more') {
          return (
            <AtomContextMenu
              {...rest}
              id={id}
              onOpenChange={(open) => selectItem(open ? item.itemKey : null)}
            >
              {content}
            </AtomContextMenu>
          );
        } else if (item.itemKey === 'required') {
          return (
            <Tooltip
              title={!isRequired ? 'Сделать обязательным' : 'Сделать по выбору'}
            >
              {content}
            </Tooltip>
          );
        }

        return content;
      })}
    </div>
  );
};
