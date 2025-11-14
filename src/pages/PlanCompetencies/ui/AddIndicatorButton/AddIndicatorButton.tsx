import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  getCompetencesQueryKey,
  useCreateIndicatorMutation,
} from '@/api/axios-client/CompetenceQuery.ts';
import { Button, Input, Skeleton, Typography } from 'antd';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';

interface AddCompetenceIndicatorButtonProps {
  competenceId: number;
  curriculumId: number;
}

const AddIndicatorButton = ({
  competenceId,
  curriculumId,
}: AddCompetenceIndicatorButtonProps) => {
  const [isEdit, setIsEdit] = useState(false);
  const [newIndicator, setNewIndicator] = useState<string>('');
  const queryClient = useQueryClient();

  const { mutate, isPending } = useCreateIndicatorMutation(competenceId, {
    onSuccess: () => {
      setIsEdit(false);
      setNewIndicator('');
      queryClient.invalidateQueries({
        queryKey: getCompetencesQueryKey(curriculumId),
      });
    },
  });

  return (
    <div className={''}>
      {isPending ? (
        <div className={'p-2 px-4 flex gap-2 items-center'}>
          <Skeleton.Input block size={'large'} />
          <Skeleton.Button shape={'circle'} size={'large'} />
          <Skeleton.Button shape={'circle'} size={'large'} />
        </div>
      ) : isEdit ? (
        <div className={'p-2 px-4 flex gap-2 items-center'}>
          <Input.TextArea
            placeholder={'Название индикатора'}
            autoSize={{ minRows: 2, maxRows: 5 }}
            value={newIndicator}
            onChange={(e) => setNewIndicator(e.target.value)}
          />
          <Button
            type={'primary'}
            icon={<PlusOutlined />}
            shape={'circle'}
            size={'large'}
            disabled={!newIndicator.length}
            onClick={() => mutate({ name: newIndicator })}
          />
          <Button
            icon={<CloseOutlined className={'text-stone-400'} />}
            shape={'circle'}
            size={'large'}
            onClick={() => setIsEdit(false)}
          />
        </div>
      ) : (
        <div
          className={
            'flex justify-start items-center gap-2 p-2 px-4 cursor-pointer hover:bg-stone-50 transition'
          }
          onClick={() => setIsEdit(true)}
        >
          <Typography className={'text-stone-600'}>
            Добавить индикатор
          </Typography>
          <PlusOutlined className={'text-stone-400'} />
        </div>
      )}
    </div>
  );
};

export default AddIndicatorButton;
