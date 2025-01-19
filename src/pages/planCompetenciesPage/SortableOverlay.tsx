import {defaultDropAnimationSideEffects, DragOverlay, DropAnimation} from "@dnd-kit/core";
import React, {PropsWithChildren} from "react";

const dropAnimationConfig: DropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
        styles: {
            active: {
                opacity: "0.2"
            }
        }
    })
};

export function SortableOverlay({children}: PropsWithChildren<{}>) {
    return (
        <DragOverlay dropAnimation={dropAnimationConfig}>{children}</DragOverlay>
    );
}