import {
  Position,
  AtomCard,
} from '@/pages/PlanView/ui/widgets/AtomCard/AtomCard.tsx';
import { useSortable } from '@dnd-kit/sortable';
import { Arguments } from '@dnd-kit/sortable/dist/hooks/useSortable';
import { CSS } from '@dnd-kit/utilities';
import { getIdFromPrefix } from '@/pages/PlanView/helpers/prefixIdHelpers.ts';
import { componentsStore } from '@/pages/PlanView/stores/componentsStore/componentsStore.ts';
import { observer } from 'mobx-react-lite';
import { commonStore } from '@/pages/PlanView/stores/commonStore.ts';

interface SortableAtomCard {
  id: string;
}

const SortableSubjectCard = observer(({ id }: SortableAtomCard) => {
  const {
    attributes,
    listeners,
    isDragging,
    isSorting,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id, animateLayoutChanges: () => true } as Arguments);

  const isOver = componentsStore.isOver(id);
  const isSelected = commonStore.isSelectedComponent(id);

  const atomId = Number(getIdFromPrefix(id));
  const atom = componentsStore.getAtom(atomId);

  if (!atom) return null;

  const atomInfo = { ...atom, index: componentsStore.getIndex(atomId) };

  const getPosition = (): Position | undefined => {
    if (isOver) return Position.Before;
    else return undefined;
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{
        transition,
        transform: isSorting ? undefined : CSS.Transform.toString(transform),
      }}
    >
      <AtomCard
        {...atomInfo}
        id={id}
        active={isDragging}
        isSelected={isSelected}
        insertPosition={getPosition()}
      />
    </div>
  );
});

export default SortableSubjectCard;
