import {Position, SubjectCard, SubjectCardProps} from "@/pages/PlanPage/ui/SubjectCard/SubjectCard.tsx";
import {useSortable} from "@dnd-kit/sortable";
import {Arguments} from "@dnd-kit/sortable/dist/hooks/useSortable";
import {CSS} from "@dnd-kit/utilities";
import React from "react";

interface SortableSubjectCard extends SubjectCardProps {}

function SortableSubjectCard(props: SortableSubjectCard) {

    const {
        id,
        activeId,
        ...rest
    } = props;

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

    const getPosition = (): Position | undefined => {
        if (over?.id === id) {
            if (!over?.data.current?.sortable.items.includes(activeId)) {
                return Position.Before
            }
            else {
                return Position.Before
                // return (
                //     over?.data.current?.sortable.items.indexOf(over.id) > over?.data.current?.sortable.items.indexOf(activeId)
                //         ? Position.Before : Position.After
                // )
            }
        }
        else return undefined;
    }

    return (
        <SubjectCard
            ref={setNodeRef}
            id={id}
            active={isDragging}
            style={{
                transition,
                transform: isSorting ? undefined : CSS.Translate.toString(transform),
            }}
            insertPosition={getPosition()}
            {...props}
            {...attributes}
            {...listeners}
        />
    );
}

export default SortableSubjectCard;