import { commonStore } from '@/pages/PlanView/stores/commonStore.ts';
import { observer } from 'mobx-react-lite';
import cls from './ValidationPanel.module.scss';
import clsx from 'clsx';
import { Icon, IconName } from '@/shared/ui/Icon';

const ValidationPanel = observer(() => {
  const hasErrors = commonStore.validationErrors?.length > 0;
  const icon: IconName = hasErrors ? 'warning' : 'success';

  const errorsCount = commonStore.validationErrors?.length;

  return (
    <div
      className={clsx(cls.ValidationPanel, {
        [cls.Success]: !hasErrors,
        [cls.Error]: hasErrors,
        [cls.Selected]: commonStore.sideBarContent === 'validation',
      })}
      onClick={() =>
        commonStore.sideBarContent !== 'validation'
          ? commonStore.setSideBarContent('validation')
          : commonStore.setSideBarContent(null)
      }
    >
      {errorsCount ? <span>{errorsCount}</span> : ''}
      <Icon name={icon} size={18} />
    </div>
  );
});

export default ValidationPanel;
