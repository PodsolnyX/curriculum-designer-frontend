import {Position, SubjectCard, SubjectCardProps} from "@/pages/PlanPage/SubjectCard/SubjectCard.tsx";
import {UniqueIdentifier, useDndContext} from "@dnd-kit/core";
import {isKeyboardEvent} from "@dnd-kit/utilities";
import React from "react";

interface SubjectCardOverlayProps extends Omit<SubjectCardProps, 'index'> {
    items: UniqueIdentifier[];
}

const SubjectCardOverlay = (props: SubjectCardOverlayProps) => {

    const {
        id,
        items,
        ...rest
    } = props;

    const {activatorEvent, over, active} = useDndContext();

    const isKeyboardSorting = isKeyboardEvent(activatorEvent);
    const activeIndex = over?.data?.current?.sortable?.items?.indexOf(id);
    const overIndex = over?.data?.current?.sortable?.items?.indexOf(over?.id);

    console.log(activeIndex, overIndex)

    return (
        <SubjectCard
            id={id}
            {...props}
            clone
            // insertPosition={
            //     overIndex !== activeIndex
            //         ? overIndex > activeIndex
            //             ? Position.After
            //             : Position.Before
            //         : undefined
            // }
        />
    );
}

export default SubjectCardOverlay;