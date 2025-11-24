import { Badge, Button, List, Popover } from 'antd';
import {
  CaretRightOutlined,
  DeleteOutlined,
  DownOutlined,
  PlusOutlined,
  TagOutlined,
  UpOutlined,
} from '@ant-design/icons';
import { AtomType } from '@/api/axios-client.types.ts';
import { componentsStore } from '@/pages/PlanView/stores/componentsStore/componentsStore.ts';
import React, { useState } from 'react';
import { AtomTypeFullName } from '@/shared/const/enumRecords.tsx';

export interface AtomContextMenuProps {
  id: string;
  type: AtomType;
  neighboringSemesters: {
    prev: number | null;
    next: number | null;
  };
  children?: React.ReactNode;

  expendSemester(direction: 'prev' | 'next'): void;
  onOpenChange?: (open: boolean) => void;
  deleteSubject(): void;
}

export const AtomContextMenu = (props: AtomContextMenuProps) => {
  const {
    type,
    id,
    neighboringSemesters,
    children,
    expendSemester,
    onOpenChange,
    deleteSubject,
  } = props;

  const [open, setOpen] = useState(false);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    onOpenChange?.(newOpen);
  };

  return (
    <div onClick={(event) => event.stopPropagation()}>
      <Popover
        trigger={'click'}
        placement={'right'}
        overlayInnerStyle={{ padding: 0 }}
        open={open}
        onOpenChange={handleOpenChange}
        content={
          <List
            size="small"
            itemLayout={'vertical'}
            dataSource={[
              {
                key: 'replace',
                label: 'Изменить тип',
                icon: <TagOutlined />,
                children: (
                  <List
                    size={'small'}
                    itemLayout={'vertical'}
                    dataSource={Object.values(AtomType).map((type) => {
                      return {
                        key: type,
                        label: (
                          <span className={'flex gap-2'}>
                            <Badge color={AtomTypeFullName[type].color} />
                            {AtomTypeFullName[type].name}
                          </span>
                        ),
                      };
                    })}
                    renderItem={(item) => (
                      <li className={'w-full'}>
                        <Button
                          type={'text'}
                          className={'w-full justify-start'}
                          disabled={item.key === type}
                          onClick={() =>
                            componentsStore.updateAtom(
                              id,
                              'type',
                              item.key as AtomType,
                            )
                          }
                        >
                          {item.label}
                        </Button>
                      </li>
                    )}
                  />
                ),
                onClick: () => {},
              },
              {
                key: 'addSemester',
                label: 'Продлить на семестр',
                icon: <PlusOutlined />,
                children: (
                  <List
                    size={'small'}
                    itemLayout={'vertical'}
                    dataSource={[
                      {
                        key: 'prev',
                        icon: <UpOutlined />,
                        label: 'Раньше',
                      },
                      { key: 'next', icon: <DownOutlined />, label: 'Позже' },
                    ]}
                    renderItem={(item) => (
                      <li className={'w-full'}>
                        <Button
                          type={'text'}
                          icon={item.icon}
                          className={'w-full justify-start'}
                          onClick={() => expendSemester(item.key)}
                          disabled={
                            (item.key === 'prev' &&
                              !neighboringSemesters.prev) ||
                            (item.key === 'next' && !neighboringSemesters.next)
                          }
                        >
                          {item.label}
                        </Button>
                      </li>
                    )}
                  />
                ),
              },
              {
                key: 'delete',
                label: 'Удалить',
                danger: true,
                icon: <DeleteOutlined />,
                onClick: () => deleteSubject(),
              },
            ]}
            renderItem={(item) => (
              <li className={'w-full'}>
                {item.children ? (
                  <Popover
                    content={item.children}
                    placement={'right'}
                    overlayInnerStyle={{ padding: 0 }}
                  >
                    <Button
                      type={'text'}
                      onClick={item.onClick}
                      icon={item.icon}
                      danger={item.danger}
                      className={'w-full justify-start'}
                    >
                      {item.label}
                      <CaretRightOutlined className={'ml-auto'} />
                    </Button>
                  </Popover>
                ) : (
                  <Button
                    type={'text'}
                    onClick={item.onClick}
                    icon={item.icon}
                    danger={item.danger}
                    className={'w-full justify-start'}
                  >
                    {item.label}
                  </Button>
                )}
              </li>
            )}
          />
        }
      >
        {children}
      </Popover>
    </div>
  );
};
