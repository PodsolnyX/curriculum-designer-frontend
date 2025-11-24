import { useState } from 'react';
import { useDebouncedValue } from '@/shared/lib/hooks/useDebouncedValue.ts';
import { useTransformContext, useTransformEffect } from 'react-zoom-pan-pinch';

export const useViewScale = () => {
  const { props } = useTransformContext();

  const [currentScale, setCurrentScale] = useState(props.initialScale);

  const scale = useDebouncedValue(currentScale, 100);

  useTransformEffect(({ state }) => {
    setCurrentScale(state.scale);
    return () => {};
  });

  return scale;
};
