import {Position, AtomCard} from "@/pages/PlanView/ui/widgets/AtomCard/AtomCard.tsx";
import {useSortable} from "@dnd-kit/sortable";
import {Arguments} from "@dnd-kit/sortable/dist/hooks/useSortable";
import {CSS} from "@dnd-kit/utilities";
import React, {useMemo} from "react";
import {useControls} from "react-zoom-pan-pinch";
import {createPortal} from "react-dom";
import {CursorMode} from "@/pages/PlanView/types/types.ts";
import {getIdFromPrefix, getSemesterIdFromPrefix} from "@/pages/PlanView/lib/helpers/prefixIdHelpers.ts";
import {optionsStore} from "@/pages/PlanView/lib/stores/optionsStore.ts";
import {componentsStore} from "@/pages/PlanView/lib/stores/componentsStore/componentsStore.ts";
import {observer} from "mobx-react-lite";
import {commonStore} from "@/pages/PlanView/lib/stores/commonStore.ts";

interface SortableAtomCard {
    id: string;
}

const SortableSubjectCard = observer(({ id }: SortableAtomCard) => {

    const {
        attributes,
        listeners,
        isDragging,
        isSorting,
        setNodeRef,
        transform,
        transition,
    } = useSortable({id, animateLayoutChanges: () => true} as Arguments);

    const isOver = componentsStore.isOver(id);
    const isSelected = commonStore.isSelectedComponent(id);

    const atomId = Number(getIdFromPrefix(id));
    const atom = componentsStore.getAtom(atomId);

    const isReplaceMode = useMemo(() => optionsStore.toolsOptions.cursorMode === CursorMode.Replace, [optionsStore.toolsOptions.cursorMode]);

    if (!atom) return null;

    const atomInfo =  {...atom, index: componentsStore.getIndex(atomId)};

    const getPosition = (): Position | undefined => {
        if (isOver) return Position.Before
        else return undefined;
    }

    return (
        <SubjectCardOutView
            id={id}
            enable={isSelected}
            semesterOrder={atomInfo.semesters.findIndex(semester => semester.semester.id === Number(getSemesterIdFromPrefix(id))) + 1}
        >
            {
                isReplaceMode ? <div ref={setNodeRef} {...attributes} {...listeners} style={{
                    transition,
                    transform: isSorting ? undefined : CSS.Transform.toString(transform),
                }}>
                    <AtomCard
                        {...atomInfo}
                        id={id}
                        isReplaceMode={isReplaceMode}
                        active={isDragging}
                        isSelected={isSelected}
                        insertPosition={getPosition()}
                    />
                </div> : <AtomCard
                    {...atomInfo}
                    id={id}
                    isReplaceMode={isReplaceMode}
                    active={isDragging}
                    isSelected={isSelected}
                    insertPosition={getPosition()}
                />
            }

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