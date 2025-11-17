import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';
import {
  CursorMode,
  ModuleSemestersPosition,
} from '@/pages/PlanView/types/types.ts';
import { componentsStore } from '@/pages/PlanView/stores/componentsStore/componentsStore.ts';
import { getIdFromPrefix } from '@/pages/PlanView/helpers/prefixIdHelpers.ts';
import { getModuleAtomsIds } from '@/pages/PlanView/ui/widgets/ModuleLayout/lib/getModuleAtomsIds.ts';
import { optionsStore } from '@/pages/PlanView/stores/optionsStore.ts';
import { NameInput } from '@/pages/PlanView/ui/features/NameInput/NameInput.tsx';
import { ModuleContextMenu } from '@/pages/PlanView/ui/widgets/ModuleLayout/ui/ModuleContextMenu/ModuleContextMenu.tsx';
import { SortableContext } from '@dnd-kit/sortable';
import SortableSubjectCard from '@/pages/PlanView/ui/widgets/AtomCard/ui/SortableAtomCard/SortableAtomCard.tsx';

export interface TrackLayoutProps {
  id: string;
  color: string;
  semesterId: number;
  position?: ModuleSemestersPosition;
  isOver?: boolean;
}

export const TrackLayout = observer((props: TrackLayoutProps) => {
  const { id, color, position = 'single', semesterId, isOver } = props;

  const [isHover, setIsHover] = useState(false);

  const styles: Record<ModuleSemestersPosition, string> = {
    single: `border-2 rounded-lg`,
    first: `border-2 rounded-t-lg`,
    middle: `border-x-2 border-b-2`,
    last: `border-x-2 border-b-2 rounded-b-lg`,
  };

  const module = componentsStore.getModule(Number(getIdFromPrefix(id)));

  if (!module) return null;

  const { name, atoms } = module;

  const atomsIds = getModuleAtomsIds(
    componentsStore.getAtoms(atoms),
    semesterId,
    id,
  );

  const onClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (optionsStore.toolsOptions.cursorMode === CursorMode.Create) {
      event.stopPropagation();
      componentsStore.createAtom(id);
      // onCreate(semesterId, Number(getIdFromPrefix(id)))
    }
  };

  return (
    <div
      className={`${styles[position]} border-dotted relative h-full pb-2 px-3 min-w-[200px]`}
      style={{
        backgroundColor: isOver || isHover ? `${color}35` : `${color}20`,
        borderColor: color,
      }}
      onClick={onClick}
      onMouseLeave={() =>
        optionsStore.toolsOptions.cursorMode === CursorMode.Create &&
        setIsHover(false)
      }
      onMouseEnter={() =>
        optionsStore.toolsOptions.cursorMode === CursorMode.Create &&
        setIsHover(true)
      }
      id={id}
    >
      <div className={'flex flex-col group'}>
        {position === 'first' || position === 'single' ? (
          <div className={'flex justify-center py-2 max-w-[200px]'}>
            <NameInput
              value={name}
              onChange={(value) => componentsStore.updateModuleName(id, value)}
            >
              <span
                className={
                  'font-bold text-center overflow-hidden text-nowrap text-ellipsis'
                }
                style={{ color }}
              >
                {name}
              </span>
            </NameInput>
            <ModuleContextMenu
              className={'group-hover:opacity-100'}
              moduleId={id}
              isSelection={true}
            />
          </div>
        ) : null}
        <div className={`flex flex-col gap-3 items-center pt-14`}>
          <SortableContext items={atomsIds} id={id}>
            {atomsIds.map((atom) => (
              <SortableSubjectCard key={atom} id={atom} />
            ))}
          </SortableContext>
        </div>
      </div>
    </div>
  );
});
