import { App, Select, Typography } from 'antd';
import { CompetenceDistributionType } from '@/api/axios-client.types.ts';
import React from 'react';
import {
  getCurriculumQueryKey,
  useGetCurriculumQuery,
  useSetCurriculumSettingsMutation,
} from '@/api/axios-client/CurriculumQuery.ts';
import { useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

const CommonSettingsTab = () => {
  const { id } = useParams<{ id: string }>();

  const { data } = useGetCurriculumQuery({ id: Number(id) });
  const queryClient = useQueryClient();
  const { message } = App.useApp();

  const { mutate: setSettings } = useSetCurriculumSettingsMutation(Number(id), {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getCurriculumQueryKey(Number(id)),
      });
      message.success('Настройки успешно изменены');
    },
  });

  return (
    <div className={'flex flex-col gap-5'}>
      <Typography.Text className={'text-2xl'}>{'Компетенции'}</Typography.Text>
      <div
        className={
          'grid grid-cols-1 lg:grid-cols-2 gap-5 border-b border-b-stone-100 border-solid pb-5 mb-5'
        }
      >
        <div className={'flex gap-2 items-center'}>
          <Typography className={'text-stone-400'}>
            {'Распределение компетенций по:'}
          </Typography>
          <Select
            className={'flex-1 flex'}
            options={Object.keys(CompetenceDistributionType).map((key) => ({
              value: CompetenceDistributionType[key],
              label: CompetenceDistributionTypeName[key],
            }))}
            value={data?.settings.competenceDistributionType}
            onChange={(value) =>
              setSettings({
                competenceDistributionType: value as CompetenceDistributionType,
              })
            }
          />
        </div>
      </div>
    </div>
  );
};

const CompetenceDistributionTypeName: Record<
  CompetenceDistributionType,
  string
> = {
  [CompetenceDistributionType.Competence]: 'Компетенциям',
  [CompetenceDistributionType.CompetenceIndicator]: 'Индикаторам',
};

export default CommonSettingsTab;
