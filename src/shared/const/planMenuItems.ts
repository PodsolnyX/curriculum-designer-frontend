import {
  getRoutePlan,
  getRoutePlanAnalytics,
  getRoutePlanCompetencies,
  getRoutePlanDepartments,
  getRoutePlanSettings,
  getRoutePlanTitle,
} from '@/shared/const/router.ts';
import { PlanPageLayoutMenuItem } from '@/widgets/PlanPageLayout/PlanPageLayout.tsx';

export const getPlanMenuItems = (
  id: number | string,
  withPlan = true,
): PlanPageLayoutMenuItem[] => [
  {
    value: 'title',
    name: 'Титул',
    icon: 'document',
    path: getRoutePlanTitle(id),
  },
  ...(withPlan
    ? [
        {
          value: 'plan',
          name: 'План',
          icon: 'board',
          path: getRoutePlan(id),
        },
      ]
    : []),
  {
    value: 'competencies',
    name: 'Компетенции',
    icon: 'hat',
    path: getRoutePlanCompetencies(id),
  },
  {
    value: 'departments',
    name: 'Кафедры',
    icon: 'hall',
    path: getRoutePlanDepartments(id),
  },
  {
    value: 'analytics',
    name: 'Аналитика',
    icon: 'diagram',
    path: getRoutePlanAnalytics(id),
  },
  {
    value: 'settings',
    name: 'Настройки',
    icon: 'settings',
    path: getRoutePlanSettings(id),
  },
];
