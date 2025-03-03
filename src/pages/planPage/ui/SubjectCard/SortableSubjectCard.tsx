import {Position, SubjectCard} from "@/pages/planPage/ui/SubjectCard/SubjectCard.tsx";
import {useSortable} from "@dnd-kit/sortable";
import {Arguments} from "@dnd-kit/sortable/dist/hooks/useSortable";
import {CSS} from "@dnd-kit/utilities";
import React, {memo, useMemo, useRef} from "react";
import {usePlan} from "@/pages/planPage/provider/PlanProvider.tsx";
import {useControls} from "react-zoom-pan-pinch";
import {createPortal} from "react-dom";
import {CursorMode} from "@/pages/planPage/provider/types.ts";
import {getIdFromPrefix, getSemesterIdFromPrefix} from "@/pages/planPage/provider/prefixIdHelpers.ts";

interface SortableSubjectCard {
    id: string;
}

const SortableSubjectCard = memo(({ id }: SortableSubjectCard) => {

    const {
        attributes,
        listeners,
        isDragging,
        isSorting,
        over,
        setNodeRef,
        transform,
        transition,
    } = useSortable({id, animateLayoutChanges: () => true} as Arguments);

    const { selectedAtom, toolsOptions, getIndex, getAtom } = usePlan();

    const atomInfo = useMemo(() => {
        const atomId = Number(getIdFromPrefix(id));
        return {...getAtom(atomId), index: getIndex(atomId)};
    }, [id, getAtom])

    if (!atomInfo) return null;
    const getPosition = (): Position | undefined => {
        if (over?.id === id) return Position.Before
        else return undefined;
    }

    const dndProps = (toolsOptions.cursorMode === CursorMode.Replace) ? {...attributes, ...listeners} : {};

    return (
        <SubjectCardOutView
            enable={getIdFromPrefix(selectedAtom || "") === getIdFromPrefix(id)}
            semesterOrder={atomInfo.semesters.findIndex(semester => semester.semester.id === Number(getSemesterIdFromPrefix(id))) + 1}
        >
            <SubjectCard
                ref={setNodeRef}
                {...atomInfo}
                id={id}
                isReplaceMode={toolsOptions.cursorMode === CursorMode.Replace}
                active={isDragging}
                style={{
                    transition,
                    transform: isSorting ? undefined : CSS.Transform.toString(transform),
                }}
                isSelected={getIdFromPrefix(selectedAtom || "") === getIdFromPrefix(id)}
                insertPosition={getPosition()}
                {...dndProps}
            />
        </SubjectCardOutView>
    );
})

interface SubjectCardOutViewProps extends React.PropsWithChildren {
    enable: boolean;
    semesterOrder?: number;
}

const SubjectCardOutView = ({enable, semesterOrder = 1, children}: SubjectCardOutViewProps) => {

    const Wrapper = ({children}: React.PropsWithChildren) => {

        const refScroll = useRef<HTMLDivElement | null>(null);
        const {zoomToElement} = useControls()

        const scrollToTarget = () => {
            if (refScroll?.current !== null)
                zoomToElement(refScroll.current as HTMLElement)
        };

        return (
            <div ref={refScroll}>
                <div>
                    { children }
                </div>
                {
                    createPortal(
                        <div
                            onClick={scrollToTarget}
                            style={{right: 340, bottom: 12 + ((semesterOrder - 1) * 32)}}
                            className={`h-[32px] w-[32px] cursor-pointer fixed bg-white/[.8] backdrop-blur hover:text-blue-500 transition z-50 flex justify-center items-center font-bold`}>
                            {(semesterOrder)}
                        </div>,
                        document.body,
                    )
                }
            </div>
        )
    }

    return (
        enable ? (
            <Wrapper>
                { children }
            </Wrapper>
        ) : children
    )
}

export default SortableSubjectCard;