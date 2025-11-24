import { ItemType } from '@/pages/PlanView/types/types.ts';
import { IconName } from '@/shared/ui/Icon';

export interface ToolsItem {
  value: ItemType;
  name: string;
  icon: IconName;
}
