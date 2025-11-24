import { Tooltip } from 'antd';
import React, { useState } from 'react';
import cls from './ZoomTools.module.scss';
import {
  useControls,
  useTransformContext,
  useTransformEffect,
} from 'react-zoom-pan-pinch';
import { ToolButton } from '@/pages/PlanView/ui/widgets/PlanHeader/ui/ToolsPanel/ui/ToolButton/ToolButton.tsx';

export const ZoomTools = () => {
  const { zoomIn, zoomOut } = useControls();
  const { props } = useTransformContext();

  const [currentScale, setCurrentScale] = useState(props.initialScale);

  useTransformEffect(({ state }) => {
    setCurrentScale(state.scale);
    return () => {};
  });

  return (
    <>
      <ToolButton
        name={'Приблизить'}
        icon={'plus-lens'}
        onClick={() => zoomIn(0.3)}
      />
      <ToolButton
        name={'Отдалить'}
        icon={'minus-lens'}
        onClick={() => zoomOut(0.3)}
      />
      <Tooltip title={'Масштаб'}>
        <span className={cls.ZoomLabel}>
          {(currentScale * 100).toFixed(0)}%
        </span>
      </Tooltip>
    </>
  );
};
