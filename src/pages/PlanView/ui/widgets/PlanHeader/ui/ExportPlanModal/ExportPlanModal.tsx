import { Button, List, Modal } from 'antd';
import {
  useGenerateExcelMutation,
  useGeneratePdfMutation,
  useGenerateTxtMutation,
} from '@/api/axios-client/DocumentGenerationQuery.ts';
import { FileResponse, TableType } from '@/api/axios-client.types.ts';
import { useGetCurriculumQuery } from '@/api/axios-client/CurriculumQuery.ts';
import { observer } from 'mobx-react-lite';
import { useParams } from 'react-router-dom';
import PageLoader from '@/shared/ui/PageLoader/PageLoader.tsx';
import React from 'react';
import {
  FileExcelOutlined,
  FilePdfOutlined,
  FileTextOutlined,
} from '@ant-design/icons';

interface ExportPlanModalProps {
  open: boolean;

  onClose(): void;
}

export const ExportPlanModal = observer((props: ExportPlanModalProps) => {
  const { open, onClose } = props;

  const { id } = useParams<{ id: string | number }>();
  const { data: curriculumData } = useGetCurriculumQuery({ id: Number(id) });

  const { mutateAsync: generatePdf, isPending: isPendingPdf } =
    useGeneratePdfMutation(Number(id), {
      onSuccess: (data) => onSuccessExport(data),
    });

  const { mutateAsync: generateExel, isPending: isPendingExel } =
    useGenerateExcelMutation(Number(id), TableType.Summary, {
      onSuccess: (data) => onSuccessExport(data),
    });

  const { mutateAsync: generateTxt, isPending: isPendingTxt } =
    useGenerateTxtMutation(Number(id), TableType.Summary, {
      onSuccess: (data) => onSuccessExport(data),
    });

  const onSuccessExport = (data: FileResponse) => {
    triggerDownloadFileDialog(
      data.data,
      data?.fileName || curriculumData?.name || 'Учебный план',
    );
    onClose();
  };

  function triggerDownloadFileDialog(blob: Blob, fileName: string) {
    const data = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = data;
    link.download = fileName;
    link.click();
    setTimeout(function () {
      // For Firefox it is necessary to delay revoking the ObjectURL
      URL.revokeObjectURL(data);
    }, 100);
  }

  const exportOptions = [
    {
      key: 'pdf',
      icon: <FilePdfOutlined />,
      label: 'Экспорт в PDF',
      onClick: generatePdf,
      loading: isPendingPdf,
    },
    {
      key: 'txt',
      icon: <FileTextOutlined />,
      label: 'Экспорт в TXT',
      onClick: generateTxt,
      loading: isPendingTxt,
    },
    {
      key: 'excel',
      icon: <FileExcelOutlined />,
      label: 'Экспорт в Excel',
      onClick: generateExel,
      loading: isPendingExel,
    },
  ];

  return (
    <Modal open={open} title={'Экспорт плана'} onCancel={onClose} footer={null}>
      <PageLoader
        loading={isPendingExel || isPendingTxt || isPendingPdf}
        title={'Генерация документа...'}
      />
      <List
        dataSource={exportOptions}
        renderItem={(item) => (
          <List.Item>
            <Button
              type="default"
              icon={item.icon}
              loading={item.loading}
              onClick={() => item.onClick()}
              className="w-full justify-start"
              size="large"
            >
              {item.label}
            </Button>
          </List.Item>
        )}
      />
    </Modal>
  );
});
