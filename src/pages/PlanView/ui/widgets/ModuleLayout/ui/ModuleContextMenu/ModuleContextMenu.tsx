import { Button, List, Popover } from 'antd';
import Icon, {
  CaretRightOutlined,
  DeleteOutlined,
  PlusOutlined,
  SwapOutlined,
} from '@ant-design/icons';
import cls from './ModuleContextMenu.module.scss';
import React from 'react';
import { commonStore } from '@/pages/PlanView/stores/commonStore.ts';
import OptionIcon from '@/shared/assets/icons/more.svg?react';
import clsx from 'clsx';
import { componentsStore } from '@/pages/PlanView/stores/componentsStore/componentsStore.ts';
import {
  getSemesterIdFromPrefix,
  setPrefixToId,
} from '@/pages/PlanView/helpers/prefixIdHelpers.ts';

interface ModuleContextMenuProps extends React.HTMLAttributes<HTMLDivElement> {
  moduleId: string;
  isSelection: boolean;
}

export const ModuleContextMenu = (props: ModuleContextMenuProps) => {
  const { className, moduleId, isSelection, ...rest } = props;

  const semesters = commonStore.curriculumData?.semesters || [];

  return (
    <div onClick={(event) => event.stopPropagation()} {...rest}>
      <Popover
        trigger={'click'}
        placement={'right'}
        overlayInnerStyle={{ padding: 0 }}
        content={
          <List
            size="small"
            itemLayout={'vertical'}
            dataSource={[
              {
                key: 'move',
                label: 'Переместить',
                icon: <PlusOutlined />,
                children: (
                  <List
                    size={'small'}
                    itemLayout={'vertical'}
                    dataSource={semesters.map((semester) => ({
                      key: semester.id,
                      label: `Семестр ${semester.number}`,
                      disabled:
                        Number(getSemesterIdFromPrefix(moduleId)) ===
                        semester.id,
                    }))}
                    renderItem={(item) => (
                      <li className={'w-full'}>
                        <Button
                          type={'text'}
                          disabled={item?.disabled}
                          onClick={() =>
                            componentsStore.moveModule(
                              moduleId,
                              setPrefixToId(item.key, 'semesters'),
                            )
                          }
                        >
                          {item.label}
                        </Button>
                      </li>
                    )}
                  />
                ),
              },
              ...(isSelection
                ? [
                    {
                      key: 'transform_to_module',
                      label: 'Преобразовать в модуль',
                      icon: <SwapOutlined />,
                      onClick: () =>
                        componentsStore.transformSelectionToModule(moduleId),
                    },
                  ]
                : [
                    {
                      key: 'transform_to_selection',
                      label: 'Преобразовать в выбор',
                      icon: <SwapOutlined />,
                      onClick: () =>
                        componentsStore.transformModuleToSelection(moduleId),
                    },
                  ]),
              {
                key: 'delete',
                label: 'Удалить',
                danger: true,
                icon: <DeleteOutlined />,
                onClick: () => componentsStore.removeModule(moduleId),
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
        <div
          className={clsx(cls.MenuIcon, className)}
          onClick={(event) => event.stopPropagation()}
        >
          <Icon component={OptionIcon} />
        </div>
      </Popover>
    </div>
  );
};
