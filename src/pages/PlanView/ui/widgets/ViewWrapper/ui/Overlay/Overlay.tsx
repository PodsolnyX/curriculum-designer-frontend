import { useTransformContext } from 'react-zoom-pan-pinch';
import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { DragOverlay } from '@dnd-kit/core';
import { componentsStore } from '@/pages/PlanView/stores/componentsStore/componentsStore.ts';
import { dropAnimation } from './../../lib/dropAnimation.ts';
import {
  DraggableAtomCardOverlay
} from '@/pages/PlanView/ui/widgets/ViewWrapper/ui/DraggableAtomCardOverlay/DraggableAtomCardOverlay.tsx';

export const Overlay = () => {
  const { transformState } = useTransformContext();
  const scale = transformState.scale;
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let animationFrameId = null;

    const handleMouseMove = (event) => {
      if (event.clientX !== 0 && event.clientY !== 0) {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }
        animationFrameId = requestAnimationFrame(() => {
          setCoords({ x: event.clientX, y: event.clientY });
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  const overlayStyle: React.CSSProperties = useMemo(
    () => ({
      position: 'fixed',
      transform: 'translate(-70%, -70%)',
      left: coords.x,
      top: coords.y,
    }),
    [coords],
  );

  return createPortal(
    <DragOverlay dropAnimation={dropAnimation} style={overlayStyle}>
      {componentsStore.activeId ? (
        <DraggableAtomCardOverlay activeItemId={componentsStore.activeId} scale={scale} />
      ) : null}
    </DragOverlay>,
    document.body,
  );
};