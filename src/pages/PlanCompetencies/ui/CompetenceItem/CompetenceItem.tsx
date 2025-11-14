import {
  CompetenceDto,
  CompetenceIndicatorDto,
  CompetenceType,
} from '@/api/axios-client.types.ts';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Arguments } from '@dnd-kit/sortable/dist/hooks/useSortable';
import { useParams } from 'react-router-dom';
import React, { CSSProperties, useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  getCompetencesQueryKey,
  useDeleteCompetenceMutation,
  useUpdateCompetenceMutation,
} from '@/api/axios-client/CompetenceQuery.ts';
import { CSS } from '@dnd-kit/utilities';
import { Button, List, Popover, Typography } from 'antd';
import {
  DeleteOutlined,
  DownOutlined,
  HolderOutlined,
  LeftOutlined,
  MoreOutlined,
} from '@ant-design/icons';
import AddIndicatorButton from '@/pages/PlanCompetencies/ui/AddIndicatorButton/AddIndicatorButton.tsx';
import IndicatorItem from '@/pages/PlanCompetencies/ui/IndicatorItem/IndicatorItem.tsx';
import { CompetenceTypeName } from '@/shared/const/enumRecords.tsx';

const CompetenceItem = ({
  name,
  index,
  indicators: _indicators,
  id,
  type,
}: CompetenceDto) => {
  const {
    listeners,
    attributes,
    isDragging,
    transform,
    transition,
    setNodeRef,
    setActivatorNodeRef,
  } = useSortable({ id, animateLayoutChanges: () => true } as Arguments);

  const { id: curriculumId } = useParams<{ id: string }>();

  const [showIndicators, setShowIndicators] = useState(false);
  const [indicators, setIndicators] =
    useState<CompetenceIndicatorDto[]>(_indicators);
  const queryClient = useQueryClient();

  useEffect(() => {
    setIndicators(_indicators);
  }, [_indicators]);

  const { mutate: deleteCompetence } = useDeleteCompetenceMutation(id, {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getCompetencesQueryKey(Number(curriculumId) || 0),
      });
    },
  });

  const { mutate: editCompetence } = useUpdateCompetenceMutation(id, {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getCompetencesQueryKey(Number(curriculumId) || 0),
      });
    },
  });

  const [newName, setNewName] = useState(name);

  const style: CSSProperties = {
    opacity: isDragging ? 0.2 : 1,
    zIndex: isDragging ? 5 : 0,
    transform: CSS.Translate.toString(transform),
    transition,
  };

  const onNameChange = (value: string) => {
    setNewName(value);
    if (name !== value) {
      editCompetence({ name: value, type });
    }
  };

  const changeType = (newType: CompetenceType) => {
    editCompetence({ name, type: newType });
  };

  return (
    <div
      className={`border-b bg-white border-stone-100 hover:border-blue-400 border-solid py-3 pl-2 pr-5`}
      ref={setNodeRef}
      {...attributes}
      style={style}
    >
      <div className={'flex justify-between items-center gap-1'}>
        <div className={'flex gap-1 flex-1'}>
          <Button
            type="text"
            size="small"
            icon={<HolderOutlined />}
            ref={setActivatorNodeRef}
            {...listeners}
            className={'cursor-move text-stone-400'}
          />
          <div className={'flex flex-col flex-1'}>
            <span className={'text-[12px] text-stone-400'}>{index}</span>
            <Typography.Text
              editable={{
                triggerType: ['text'],
                onChange: onNameChange,
                icon: null,
              }}
              className={'cursor-text'}
            >
              {newName}
            </Typography.Text>
          </div>
        </div>
        <div
          className={'flex gap-1 items-center justify-end'}
          onClick={(event) => event.stopPropagation()}
        >
          <Popover
            trigger={'click'}
            placement={'bottom'}
            overlayInnerStyle={{ padding: 0 }}
            content={
              <List
                size="small"
                itemLayout={'vertical'}
                dataSource={[
                  {
                    key: 'replace',
                    label: 'Изменить тип',
                    icon: <LeftOutlined />,
                    children: (
                      <List
                        size={'small'}
                        itemLayout={'vertical'}
                        dataSource={Object.values(CompetenceType).map(
                          (type) => {
                            return {
                              key: type,
                              label: CompetenceTypeName[type].name,
                            };
                          },
                        )}
                        renderItem={(item) => (
                          <li className={'w-full'}>
                            <Button
                              type={'text'}
                              className={'w-full justify-start'}
                              disabled={item.key === type}
                              onClick={() =>
                                changeType(item.key as CompetenceType)
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
                    key: 'delete',
                    label: 'Удалить',
                    danger: true,
                    icon: <DeleteOutlined />,
                    onClick: () => deleteCompetence(),
                  },
                ]}
                renderItem={(item) => (
                  <li className={'w-full'}>
                    {item.children ? (
                      <Popover
                        content={item.children}
                        trigger={'click'}
                        placement={'left'}
                      >
                        <Button
                          type={'text'}
                          onClick={item.onClick}
                          icon={item.icon}
                          danger={item.danger}
                          className={'w-full justify-start'}
                        >
                          {item.label}
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
            <Button
              className={'text-stone-400'}
              shape={'circle'}
              icon={<MoreOutlined />}
            />
          </Popover>
          <Button
            shape={'circle'}
            icon={
              <DownOutlined
                className={'text-stone-400'}
                rotate={showIndicators ? 180 : 0}
              />
            }
            onClick={() => setShowIndicators(!showIndicators)}
          />
        </div>
      </div>
      {showIndicators && !isDragging ? (
        <SortableContext
          items={indicators.map((i) => i.id)}
          strategy={verticalListSortingStrategy}
          id={`competence-${id}`}
        >
          <div
            className={
              'flex flex-col gap-2 border-l border-stone-100 ml-2 mt-2'
            }
          >
            {indicators.map((indicator) => (
              <IndicatorItem
                key={indicator.id}
                {...indicator}
                competenceId={String(id)}
                curriculumId={Number(curriculumId) || 0}
              />
            ))}
            <AddIndicatorButton
              competenceId={id}
              curriculumId={Number(curriculumId) || 0}
            />
          </div>
        </SortableContext>
      ) : null}
    </div>
  );
};

export default CompetenceItem;
