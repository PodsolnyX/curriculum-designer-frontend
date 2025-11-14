import { ReactNode } from 'react';
import {
  CloseCircleOutlined,
  InfoCircleOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { ValidationLevel } from '@/api/axios-client.types.ts';
import { Typography } from 'antd';
import {
  AtomType,
  CompetenceType,
  CurriculumStatusType,
} from '@/api/axios-client.ts';
import { CompetenceTypeName } from '@/pages/PlanView/types/types.ts';

export const ValidationLevelDisplay: Record<ValidationLevel, ReactNode> = {
  [ValidationLevel.Information]: (
    <Typography.Text className={'text-sm text-blue-500'}>
      <InfoCircleOutlined /> Информация
    </Typography.Text>
  ),
  [ValidationLevel.Warning]: (
    <Typography.Text className={'text-sm text-yellow-500'}>
      <WarningOutlined /> Предупреждение
    </Typography.Text>
  ),
  [ValidationLevel.Error]: (
    <Typography.Text className={'text-sm text-red-600'}>
      <CloseCircleOutlined /> Ошибка
    </Typography.Text>
  ),
};
export const CompetenceTypeName: Record<CompetenceType, CompetenceTypeName> = {
  [CompetenceType.Universal]: { name: 'Универсальные', shortName: 'УК' },
  [CompetenceType.Basic]: { name: 'Базовые', shortName: 'БК' },
  [CompetenceType.GeneralProfessional]: {
    name: 'Обще-профессиональные',
    shortName: 'ОПК',
  },
  [CompetenceType.Professional]: { name: 'Профессиональные', shortName: 'ПК' },
};

export const AtomTypeFullName: Record<
  AtomType,
  { name: string; color: string }
> = {
  [AtomType.Subject]: { name: 'Дисциплина', color: 'blue' },
  [AtomType.Practice]: { name: 'Практика', color: 'orange' },
  [AtomType.Attestation]: { name: 'ГИА', color: 'red' },
  [AtomType.Elective]: { name: 'Факультатив', color: 'purple' },
};

export const CurriculumStatusTypeName: Record<
  CurriculumStatusType,
  { name: string }
> = {
  [CurriculumStatusType.Draft]: { name: 'Черновик' },
  [CurriculumStatusType.ForApproval]: { name: 'На согласовании' },
  [CurriculumStatusType.Approved]: { name: 'Согласован' },
  [CurriculumStatusType.ActualForRecruitment]: { name: 'Актуален с набором' },
  [CurriculumStatusType.ActualWithoutRecruitment]: {
    name: 'Актуален без набора',
  },
  [CurriculumStatusType.Completed]: { name: 'Завершён' },
  [CurriculumStatusType.Archived]: { name: 'Архив' },
};
