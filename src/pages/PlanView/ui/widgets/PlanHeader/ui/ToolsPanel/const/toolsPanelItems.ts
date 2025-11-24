import { CursorMode } from '@/pages/PlanView/types/types.ts';
import { ToolsItem } from './../ToolsPanel.types.ts';

export const CursorItems: ToolsItem[] = [
  {
    value: CursorMode.Move,
    name: 'Курсор',
    icon: 'cursor',
  },
  {
    value: CursorMode.Hand,
    name: 'Рука',
    icon: 'hand',
  },
];

export const EditItems: ToolsItem[] = [
  {
    value: 'subjects',
    name: 'Дисциплина',
    icon: 'subject',
  },
  {
    value: 'modules',
    name: 'Модуль',
    icon: 'module',
  },
  {
    value: 'selections',
    name: 'Выбор дисциплин',
    icon: 'selection',
  },
  {
    value: 'Трек',
    name: 'Трек',
    icon: 'tracks',
  },
];
