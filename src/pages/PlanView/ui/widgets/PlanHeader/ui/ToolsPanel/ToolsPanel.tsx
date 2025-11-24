import cls from './ToolsPanel.module.scss';
import { CursorMode } from '@/pages/PlanView/types/types.ts';
import { observer } from 'mobx-react-lite';
import { optionsStore } from '@/pages/PlanView/stores/optionsStore.ts';
import { CursorItems, EditItems } from './const/toolsPanelItems.ts';
import { ZoomTools } from '@/pages/PlanView/ui/widgets/PlanHeader/ui/ToolsPanel/ui/ZoomTools/ZoomTools.tsx';
import { ToolButton } from '@/pages/PlanView/ui/widgets/PlanHeader/ui/ToolsPanel/ui/ToolButton/ToolButton.tsx';

const ToolsPanel = observer(() => {
  return (
    <div className={cls.ToolsPanel}>
      <div className={cls.ToolsBlock}>
        {CursorItems.map((item) => (
          <ToolButton
            {...item}
            key={item.value}
            selected={optionsStore.toolsOptions.cursorMode === item.value}
            onClick={() => optionsStore.setToolsMode(item.value as CursorMode)}
          />
        ))}
      </div>
      <div className={cls.ToolsBlock}>
        {EditItems.map((item) => (
          <ToolButton
            {...item}
            key={item.value}
            selected={
              optionsStore.toolsOptions.cursorMode === CursorMode.Create &&
              optionsStore.toolsOptions.selectedCreateEntityType === item.value
            }
            onClick={() => {
              optionsStore.setToolsMode(CursorMode.Create);
              optionsStore.setToolsEntityType(item.value);
            }}
          />
        ))}
      </div>
      <div className={cls.ToolsBlock}>
        <ZoomTools />
      </div>
    </div>
  );
});

export default ToolsPanel;
