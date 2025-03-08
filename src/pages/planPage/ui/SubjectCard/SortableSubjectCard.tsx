import {Position, SubjectCard} from "@/pages/planPage/ui/SubjectCard/SubjectCard.tsx";
import {useSortable} from "@dnd-kit/sortable";
import {Arguments} from "@dnd-kit/sortable/dist/hooks/useSortable";
import {CSS} from "@dnd-kit/utilities";
import React, {useMemo} from "react";
import {useControls} from "react-zoom-pan-pinch";
import {createPortal} from "react-dom";
import {CursorMode} from "@/pages/planPage/provider/types.ts";
import {getIdFromPrefix, getSemesterIdFromPrefix} from "@/pages/planPage/provider/prefixIdHelpers.ts";
import {usePlanParams} from "@/pages/planPage/hooks/usePlanParams.ts";
import {optionsStore} from "@/pages/planPage/lib/stores/optionsStore.ts";
import {componentsStore} from "@/pages/planPage/lib/stores/componentsStore.ts";
import {observer} from "mobx-react-lite";

interface SortableSubjectCard {
    id: string;
}

const SortableSubjectCard = observer(({ id }: SortableSubjectCard) => {

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

    const {sidebarValue: selectedAtom} = usePlanParams()

    const atomId = Number(getIdFromPrefix(id));
    const atom = componentsStore.getAtom(atomId);

    if (!atom) return null;

    const atomInfo =  {...atom, index: componentsStore.getIndex(atomId)};

    const getPosition = (): Position | undefined => {
        if (over?.id === id) return Position.Before
        else return undefined;
    }

    const dndProps = useMemo(() => {
        return optionsStore.toolsOptions.cursorMode === CursorMode.Replace ? {...attributes, ...listeners} : {}
    }, [optionsStore.toolsOptions.cursorMode]);

    const isReplaceMode = useMemo(() => optionsStore.toolsOptions.cursorMode === CursorMode.Replace, [optionsStore.toolsOptions.cursorMode]);

    return (
        <SubjectCardOutView
            id={id}
            enable={selectedAtom === getIdFromPrefix(id)}
            semesterOrder={atomInfo.semesters.findIndex(semester => semester.semester.id === Number(getSemesterIdFromPrefix(id))) + 1}
        >
            <SubjectCard
                ref={setNodeRef}
                {...atomInfo}
                id={id}
                isReplaceMode={isReplaceMode}
                active={isDragging}
                style={{
                    transition,
                    transform: isSorting ? undefined : CSS.Transform.toString(transform),
                }}
                isSelected={selectedAtom === getIdFromPrefix(id)}
                insertPosition={getPosition()}
                {...dndProps}
            />
        </SubjectCardOutView>
    );
})

interface SubjectCardOutViewProps extends React.PropsWithChildren {
    enable: boolean;
    semesterOrder?: number;
    id: string;
}

const SubjectCardOutView = ({enable, semesterOrder = 1, id, children}: SubjectCardOutViewProps) => {

    const Wrapper = ({children}: React.PropsWithChildren) => {

        const {zoomToElement} = useControls()

        const scrollToTarget = () => {
            zoomToElement(document.getElementById(id))
        };

        return (
            <div>
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