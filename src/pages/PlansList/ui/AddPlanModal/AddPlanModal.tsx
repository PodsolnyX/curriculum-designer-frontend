import {
  searchCurriculumsQueryKey,
  useCreateCurriculumMutation,
} from '@/api/axios-client/CurriculumQuery.ts';
import {
  ModalForm,
  ModalFormField,
  ModalProps,
} from '@/shared/ui/ModalForm/ModalForm.tsx';
import { useNavigate } from 'react-router-dom';
import { getRoutePlan } from '@/shared/const/router.ts';
import { CreateCurriculumDto } from '@/api/axios-client.types.ts';
import React, { useState } from 'react';
import { Client } from '@/api/axios-client/ImportQuery.ts';
import { App, Spin, Typography } from 'antd';
import { useQueryClient } from '@tanstack/react-query';

interface FieldType extends CreateCurriculumDto {
  file: File;
}

export const AddPlanModal = (props: ModalProps) => {
  const { isOpen, onClose } = props;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { message } = App.useApp();
  const [loadingImport, setLoadingImport] = useState(false);

  const [file, setFile] = useState<File | null>(null);

  const { mutateAsync: addPlan, isPending: loadingCreate } =
    useCreateCurriculumMutation();

  const onSubmit = async (data: FieldType) => {
    const newPlanId = await addPlan(data);
    queryClient.invalidateQueries({ queryKey: searchCurriculumsQueryKey() });

    if (file) {
      setLoadingImport(true);
      try {
        await Client.import_(newPlanId, {
          data: file,
          fileName: 'file',
        });
        message.success('План успешно импортирован');
      } catch (error) {
        message.error('Ошибка при импорте плана');
      } finally {
        setLoadingImport(false);
      }
    } else {
      message.success('План успешно создан');
    }

    navigate(getRoutePlan(newPlanId));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];

    if (selectedFile && !selectedFile.name.toLowerCase().endsWith('.plx')) {
      message.warning('Выберите файл с расширением .plx');
    }

    setFile(selectedFile || null);
  };

  const formFields = [
    {
      name: 'name',
      label: 'Имя плана',
      isRequired: true,
      inputComponent: 'input',
    },
    {
      name: 'semesterCount',
      label: 'Количество семестров',
      isRequired: true,
      inputComponent: 'inputNumber',
    },
    {
      name: 'file',
      label: 'Файл плана в формате .plx',
      inputComponent: 'input',
      customInput: (
        <input
          type={'file'}
          className={'w-full'}
          onChange={handleFileChange}
          accept={'.plx'}
        />
      ),
    },
  ] as ModalFormField<FieldType>[];

  return (
    <ModalForm<FieldType>
      fields={formFields}
      onSubmit={onSubmit}
      title={'Добавление плана'}
      buttonLabel={'Добавить'}
      loading={loadingCreate || loadingImport}
      disabled={file !== null && !file.name.toLowerCase().endsWith('.plx')}
      isOpen={isOpen}
      onClose={onClose}
      initialValues={{ semesterCount: 8 }}
      loadingContent={
        <div
          className={'flex flex-col gap-12 items-center justify-center py-32'}
        >
          <Spin size={'large'} />
          <Typography.Text className={'text-2xl'}>
            {loadingCreate ? 'Создание плана...' : 'Импорт плана...'}
          </Typography.Text>
        </div>
      }
    />
  );
};
