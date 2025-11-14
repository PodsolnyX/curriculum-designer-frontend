import React from 'react';
import { componentsStore } from '@/pages/PlanView/stores/componentsStore/componentsStore.ts';
import { getIdFromPrefix } from '@/pages/PlanView/helpers/prefixIdHelpers.ts';
import { AtomCard } from '@/pages/PlanView/ui/widgets/AtomCard/AtomCard.tsx';

export const DraggableAtomCardOverlay = React.memo(
  ({ activeItemId, scale }: { scale: number; activeItemId: string }) => {
    const atomInfo = componentsStore.getAtom(
      Number(getIdFromPrefix(activeItemId)),
    );

    if (!atomInfo) return null;

    return (
      <AtomCard
        {...atomInfo}
        id={activeItemId as string}
        style={{ transform: `scale(${scale})` }}
      />
    );
  },
);