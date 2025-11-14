import React from 'react';
import {
  ModuleSemestersPosition,
} from '@/pages/PlanView/types/types.ts';
import CreditsSelector from '@/pages/PlanView/ui/features/CreditsSelector/CreditsSelector.tsx';
import {
  concatIds,
  cutSemesterIdFromId,
  setPrefixToId,
} from '@/pages/PlanView/helpers/prefixIdHelpers.ts';
import { PositionContainer } from '@/pages/PlanView/ui/features/PositionContainer/PositionContainer.tsx';
import { getModuleRootStyles } from '@/pages/PlanView/ui/widgets/ModuleLayout/lib/getModuleRootStyles.ts';
import { SortableTrack } from '@/pages/PlanView/ui/widgets/TrackLayout/ui/SortableTrack/SortableTrack.tsx';

interface TrackSelectionProps {
  id: string;
  tracks: number[];
  name?: string;
  credits: number;
  semesterNumber?: number;
  semesterId: number;
  position?: ModuleSemestersPosition;
}

const TracksSelectionLayout = (props: TrackSelectionProps) => {
  const {
    id,
    name,
    tracks,
    credits,
    semesterNumber = 0,
    semesterId,
    position = 'single' as ModuleSemestersPosition,
  } = props;

  // const errors = commonStore.getValidationErrors(id);

  return (
    <PositionContainer
      id={cutSemesterIdFromId(id)}
      rowId={setPrefixToId(semesterId, 'semesters')}
      countHeights={true}
      countHorizontalCoordinates={true}
      rootStyles={(height) => getModuleRootStyles(height, position)}
      rootClassName={`relative px-2 flex`}
      childrenClassName={'flex flex-1 flex-col min-h-max'}
    >
      {position === 'first' || position === 'single' ? (
        <div className={'flex justify-center py-2 min-w-[200px]'}>
          <span
            className={
              'text-black font-bold text-center overflow-hidden text-nowrap text-ellipsis'
            }
          >
            {name}
          </span>
        </div>
      ) : null}
      <div className={'flex flex-1 relative gap-3'} id={id}>
        <div
          className={`w-full absolute left-0 z-10 py-2 px-3 ${position === 'first' ? 'top-9' : 'top-0'}`}
        >
          <div
            className={
              'p-2 px-3 bg-white rounded-lg shadow-md text-blue-500 items-center flex justify-between'
            }
          >
            {`Семестр ${semesterNumber}`}
            <CreditsSelector
              credits={credits}
              // error={errors ? errors.some(e => e.type === ValidationErrorType.CreditDistribution) : false}
            />
          </div>
        </div>
        <div
          className={`grid gap-3 ${position === 'last' ? 'pb-2' : ''}`}
          style={{
            gridTemplateColumns: `repeat(${tracks.length}, 1fr)`,
          }}
        >
          {tracks.map((track, index) => {
            const colors = ['#25b600', '#8019f1', '#e80319', '#f56b0a'];

            return (
              <SortableTrack
                key={track}
                id={concatIds(id, setPrefixToId(track, 'modules'))}
                semesterId={semesterId}
                color={colors[index]}
                position={position}
              />
            );
          })}
        </div>
      </div>
    </PositionContainer>
  );
};

export default TracksSelectionLayout;
