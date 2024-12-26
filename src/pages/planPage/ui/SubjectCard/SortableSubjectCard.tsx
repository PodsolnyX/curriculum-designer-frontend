import {Position, SubjectCard, SubjectCardProps} from "@/pages/planPage/ui/SubjectCard/SubjectCard.tsx";
import {useSortable} from "@dnd-kit/sortable";
import {Arguments} from "@dnd-kit/sortable/dist/hooks/useSortable";
import {CSS} from "@dnd-kit/utilities";
import React, {useEffect} from "react";
import {usePlan} from "@/pages/planPage/provider/PlanProvider.tsx";

interface SortableSubjectCard extends SubjectCardProps {}

function SortableSubjectCard(props: SortableSubjectCard) {

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

    const { activeItemId, setActiveSubject } = usePlan();

    useEffect(() => {
        if (activeItemId === id) {
            setActiveSubject(props)
        }
    }, [activeItemId])

    const getPosition = (): Position | undefined => {
        if (over?.id === id) return Position.Before
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

// const getPosition = (): Position | undefined => {
//     if (over?.id === id) {
//         if (!over?.data.current?.sortable.items.includes(activeItemId)) {
//             return Position.Before
//         }
//         else {
//             return Position.Before
//             // return (
//             //     over?.data.current?.sortable.items.indexOf(over.id) > over?.data.current?.sortable.items.indexOf(activeId)
//             //         ? Position.Before : Position.After
//             // )
//         }
//     }
//     else return undefined;
// }

export default SortableSubjectCard;