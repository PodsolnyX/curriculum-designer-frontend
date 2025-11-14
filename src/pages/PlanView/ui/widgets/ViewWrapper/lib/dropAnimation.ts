import { defaultDropAnimationSideEffects, DropAnimation } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import pageStyles from '@/pages/PlanView/ui/widgets/AtomCard/AtomCard.module.scss';

export const dropAnimation: DropAnimation = {
  keyframes({ transform }) {
    return [
      {
        transform: CSS.Transform.toString(transform.initial),
      },
      {
        transform: CSS.Transform.toString({
          scaleX: 1,
          scaleY: 1,
          x: transform.final.x,
          y: transform.final.y,
        }),
      },
    ];
  },
  sideEffects: defaultDropAnimationSideEffects({
    className: {
      active: pageStyles.active,
    },
  }),
} as DropAnimation;