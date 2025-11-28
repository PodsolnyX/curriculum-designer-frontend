import { Badge, Button, List, Popover } from 'antd';
import {
  BgColorsOutlined,
  CaretRightOutlined,
  DeleteOutlined,
  PlusOutlined,
  SwapOutlined,
} from '@ant-design/icons';
import cls from './ModuleContextMenu.module.scss';
import React, { useState } from 'react';
import { commonStore } from '@/pages/PlanView/stores/commonStore.ts';
import clsx from 'clsx';
import { componentsStore } from '@/pages/PlanView/stores/componentsStore/componentsStore.ts';
import {
  getSemesterIdFromPrefix,
  setPrefixToId,
} from '@/pages/PlanView/helpers/prefixIdHelpers.ts';
import { Icon } from '@/shared/ui/Icon';
import { moduleColorsPresets } from '@/pages/PlanView/const/moduleColorsPresets.ts';

interface ModuleContextMenuProps extends React.HTMLAttributes<HTMLDivElement> {
  moduleId: string;
  isSelection: boolean;
  moduleColor: string | null;
}

export const ModuleContextMenu = (props: ModuleContextMenuProps) => {
  const { className, moduleId, isSelection, moduleColor, ...rest } = props;

  const [popoverVisible, setPopoverVisible] = useState(false);
  const semesters = commonStore.curriculumData?.semesters || [];

  return (
    <div onClick={(event) => event.stopPropagation()} {...rest}>
      <Popover
        trigger={'click'}
        placement={'right'}
        overlayInnerStyle={{ padding: 0 }}
        open={popoverVisible}
        onOpenChange={setPopoverVisible}
        content={
          <List
            size="small"
            itemLayout={'vertical'}
            dataSource={[
              {
                key: 'color',
                label: 'Цвет',
                icon: <BgColorsOutlined />,
                children: (
                  <List
                    size={'small'}
                    itemLayout={'vertical'}
                    dataSource={moduleColorsPresets.map((preset) => ({
                      key: preset.name,
                      value: preset.color,
                      label: (
                        <span className={'flex gap-2'}>
                          <Badge color={preset.color ?? undefined} />
                          {preset.name}
                        </span>
                      ),
                      disabled: preset.color === moduleColor,
                    }))}
                    renderItem={(item) => (
                      <li className={'w-full'}>
                        <Button
                          type={'text'}
                          disabled={item?.disabled}
                          onClick={() =>
                            componentsStore.updateModuleColor(
                              moduleId,
                              item.value,
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
          className={clsx(
            cls.MenuIcon,
            {
              [cls.Show]: popoverVisible,
            },
            className,
          )}
          onClick={(event) => event.stopPropagation()}
        >
          <Icon name={'more'} size={12} />
        </div>
      </Popover>
    </div>
  );
};
