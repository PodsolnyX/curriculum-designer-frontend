import { CurriculumStatusType } from '@/api/axios-client.types.ts';
import { Tag } from 'antd';
import { CurriculumStatusTypeName } from '@/shared/const/enumRecords.tsx';

interface CurriculumStatusBadgeProps {
  curriculumId: number | string;
  status?: CurriculumStatusType;
}

export const CurriculumStatusBadge = (props: CurriculumStatusBadgeProps) => {
  const { curriculumId, status } = props;

  if (!status) return null;

  return <Tag>{CurriculumStatusTypeName[status].name}</Tag>;
};
