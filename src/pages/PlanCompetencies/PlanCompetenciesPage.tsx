import PlanPageLayout from '@/widgets/PlanPageLayout/PlanPageLayout.tsx';
import { useParams } from 'react-router-dom';
import { Segmented, Typography } from 'antd';
import { getPlanMenuItems } from '@/shared/const/planMenuItems.ts';
import React, { useEffect, useMemo, useState } from 'react';
import { CompetenceTypeName } from '@/shared/const/enumRecords.tsx';
import { CompetenceDto, CompetenceType } from '@/api/axios-client.types.ts';
import {
  getCompetencesQueryKey,
  useGetCompetencesQuery,
  useUpdateCompetenceMutationWithParameters,
  useUpdateIndicatorMutationWithParameters,
} from '@/api/axios-client/CompetenceQuery.ts';
import {
  Active,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  restrictToParentElement,
  restrictToVerticalAxis,
} from '@dnd-kit/modifiers';
import CompetenceItem from '@/pages/PlanCompetencies/ui/CompetenceItem/CompetenceItem.tsx';
import IndicatorItem from '@/pages/PlanCompetencies/ui/IndicatorItem/IndicatorItem.tsx';
import AddCompetenceButton from '@/pages/PlanCompetencies/ui/AddCompetenceButton/AddCompetenceButton.tsx';
import { SortableOverlay } from '@/pages/PlanCompetencies/ui/SortableOverlay/SortableOverlay.tsx';
import { useQueryClient } from '@tanstack/react-query';
import { useGetCurriculumQuery } from '@/api/axios-client/CurriculumQuery.ts';

const PlanCompetenciesPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data } = useGetCompetencesQuery({ curriculumId: Number(id) });
  const { data: curriculumData } = useGetCurriculumQuery({ id: Number(id) });
  const queryClient = useQueryClient();

  const [selectedType, setSelectedType] = useState<string>(
    CompetenceTypeName[CompetenceType.Universal].name,
  );
  const [items, setItems] = useState<CompetenceDto[]>([]);

  const [active, setActive] = useState<Active | null>(null);

  const { mutate: updateCompetence } =
    useUpdateCompetenceMutationWithParameters({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getCompetencesQueryKey(Number(id)),
        });
      },
    });

  const { mutate: updateIndicator } = useUpdateIndicatorMutationWithParameters({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getCompetencesQueryKey(Number(id)),
      });
    },
  });

  useEffect(() => {
    if (data) {
      setItems(
        data.filter(
          (competence) =>
            CompetenceTypeName[competence.type].name === selectedType,
        ),
      );
    } else {
      setItems([]);
    }
  }, [selectedType, data]);

  const [activeCompetence, activeIndicator] = useMemo(() => {
    const competence = items.find((item) => item.id === active?.id);
    if (competence) return [competence, null];
    const indicatorCompetence = items.find(
      (item) =>
        item.id !== active?.id &&
        item?.indicators.find((indicator) => indicator.id === active?.id),
    );
    return [
      null,
      indicatorCompetence?.indicators.find(
        (indicator) => indicator.id === active?.id,
      ),
    ];
  }, [active, items]);

  const headerExtra = () => {
    return (
      <div className={'flex flex-col'}>
        <Typography className={'text-sm text-stone-400'}>
          {curriculumData?.name || ''}
        </Typography>
        <Typography className={'text-2xl'}>{'Компетенции'}</Typography>
      </div>
    );
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (over && active.id !== over?.id) {
      let activeIndex = items.findIndex(({ id }) => id === active.id);
      let overIndex = items.findIndex(({ id }) => id === over.id);
      if (activeIndex !== -1 && overIndex !== -1) {
        setItems(arrayMove(items, activeIndex, overIndex));
        updateCompetence({
          competenceId: Number(active.id),
          updateCompetenceDto: {
            order: activeIndex < overIndex ? overIndex + 1 : overIndex,
          },
        });
      } else {
        const indicatorCompetenceIndex = items.findIndex((item) =>
          item?.indicators.find((indicator) => indicator.id === active.id),
        );
        setItems([
          ...items.map((item, index) => {
            if (index === indicatorCompetenceIndex) {
              activeIndex = item.indicators.findIndex(
                (indicator) => indicator.id === active.id,
              );
              overIndex = item.indicators.findIndex(
                (indicator) => indicator.id === over.id,
              );
              return {
                ...item,
                indicators: arrayMove(item.indicators, activeIndex, overIndex),
              };
            } else return item;
          }),
        ]);

        updateIndicator({
          competenceId: String(
            active.data.current?.sortable.containerId.split('-')[1],
          ),
          indicatorId: Number(active.id),
          updateIndicatorDto: {
            order: activeIndex < overIndex ? overIndex + 1 : overIndex,
          },
        });
      }
    }
    setActive(null);
  };

  return (
    <PlanPageLayout
      menuItems={getPlanMenuItems(id || '')}
      currentMenuItem={'competencies'}
      headerExtra={headerExtra}
    >
      <div className={'flex flex-col'}>
        <div className={'sticky top-0 z-10'}>
          <Segmented
            options={Object.values(CompetenceType).map(
              (type) => CompetenceTypeName[type].name,
            )}
            value={selectedType}
            onChange={setSelectedType}
            block
            className={'px-5'}
          />
        </div>
        <DndContext
          modifiers={[restrictToVerticalAxis, restrictToParentElement]}
          sensors={sensors}
          onDragStart={({ active }) => setActive(active)}
          onDragEnd={onDragEnd}
          onDragCancel={({ active }) => setActive(active)}
        >
          <SortableContext
            items={items.map((i) => i.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className={'flex flex-col'}>
              {!items.length
                ? ''
                : items.map((competence) => (
                    <CompetenceItem key={competence.id} {...competence} />
                  ))}
              <AddCompetenceButton
                curriculumId={Number(id) || 0}
                type={
                  (Object.values(CompetenceType).find(
                    (type) => CompetenceTypeName[type].name === selectedType,
                  ) as CompetenceType) || CompetenceType.Basic
                }
              />
            </div>
          </SortableContext>
          <SortableOverlay>
            {activeCompetence ? <CompetenceItem {...activeCompetence} /> : null}
            {activeIndicator ? <IndicatorItem {...activeIndicator} /> : null}
          </SortableOverlay>
        </DndContext>
      </div>
    </PlanPageLayout>
  );
};

export default PlanCompetenciesPage;
