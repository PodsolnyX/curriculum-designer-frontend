import {Position, SubjectCard, SubjectCardProps} from "@/pages/planPage/ui/SubjectCard/SubjectCard.tsx";
import {useSortable} from "@dnd-kit/sortable";
import {Arguments} from "@dnd-kit/sortable/dist/hooks/useSortable";
import {CSS} from "@dnd-kit/utilities";
import React, {memo, useRef} from "react";
import {usePlan} from "@/pages/planPage/provider/PlanProvider.tsx";
import {useInView} from "react-intersection-observer";

interface SortableSubjectCard extends SubjectCardProps {}

const SortableSubjectCard = memo((props: SortableSubjectCard) => {

    const { id } = props;

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

    const { selectedSubject } = usePlan();
    const getPosition = (): Position | undefined => {
        if (over?.id === id) return Position.Before
        else return undefined;
    }

    return (
        <SubjectCardOutView
            enable={String(selectedSubject?.id) === String(props.id)}
            semesterOrder={props.semesterOrder}
        >
            <SubjectCard
                ref={setNodeRef}
                id={id}
                active={isDragging}
                style={{
                    transition,
                    // transform: isSorting ? undefined : CSS.Translate.toString(transform),
                    transform: isSorting ? undefined : CSS.Transform.toString(transform),
                }}
                insertPosition={getPosition()}
                {...props}
                {...attributes}
                {...listeners}
            />
        </SubjectCardOutView>
    );
})

interface SubjectCardOutViewProps extends React.PropsWithChildren {
    enable: boolean;
    semesterOrder?: number;
}

const SubjectCardOutView = ({enable, semesterOrder, children}: SubjectCardOutViewProps) => {

    const Wrapper = ({children}: React.PropsWithChildren) => {

        const refScroll = useRef<HTMLDivElement | null>(null);

        const scrollToTarget = () => {
            if (refScroll?.current && refScroll?.current?.scrollIntoView) {
                refScroll?.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        };

        const [positionLeft, positionY] = [refScroll?.current?.getBoundingClientRect().left + 60, refScroll?.current?.getBoundingClientRect().y < 0 ? -1 : 1]

        return (
            <div ref={refScroll}>
                <div>
                    { children }
                </div>
                <div
                    onClick={scrollToTarget}
                    style={{
                        left: positionLeft,
                    }}
                    className={`w-16 h-16 cursor-pointer fixed ${positionY === -1 ? "top-[80px]" : "bottom-5"} bg-sky-500/[.5] shadow-md z-50 rounded-full flex justify-center text-xl items-center text-white font-bold`}>
                    {(semesterOrder) || (positionY === -1 ? "↑" : "↓")}
                </div>
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