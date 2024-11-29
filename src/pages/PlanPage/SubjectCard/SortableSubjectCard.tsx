import {Position, SubjectCard, SubjectCardProps} from "@/pages/PlanPage/SubjectCard/SubjectCard.tsx";
import {useSortable} from "@dnd-kit/sortable";
import {Arguments} from "@dnd-kit/sortable/dist/hooks/useSortable";
import {CSS} from "@dnd-kit/utilities";
import React from "react";

interface SortableSubjectCard extends SubjectCardProps {
    activeIndex: number;
}

function SortableSubjectCard(props: SortableSubjectCard) {

    const {
        id,
        activeIndex,
        ...rest
    } = props;

    const {
        attributes,
        listeners,
        index,
        isDragging,
        isSorting,
        over,
        setNodeRef,
        transform,
        transition,
    } = useSortable({id, animateLayoutChanges: () => true} as Arguments);

    return (
        <SubjectCard
            ref={setNodeRef}
            id={id}
            active={isDragging}
            style={{
                transition,
                transform: isSorting ? undefined : CSS.Translate.toString(transform),
            }}
            insertPosition={
                over?.id === id
                    ? index > activeIndex
                        ? Position.After
                        : Position.Before
                    : undefined
            }
            {...props}
            {...attributes}
            {...listeners}
        />
    );
}

export default SortableSubjectCard;