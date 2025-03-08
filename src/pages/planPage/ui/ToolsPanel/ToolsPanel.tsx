import Icon from '@ant-design/icons';
import SubjectIcon from "@/shared/assets/icons/subject.svg?react";
import ModuleIcon from "@/shared/assets/icons/module.svg?react";
import SelectionIcon from "@/shared/assets/icons/selection.svg?react";
import TracksIcon from "@/shared/assets/icons/tracks.svg?react";
import CursorIcon from "@/shared/assets/icons/cursor.svg?react";
import HandIcon from "@/shared/assets/icons/hand.svg?react";
import MinusIcon from "@/shared/assets/icons/minus-lens.svg?react";
import PlusIcon from "@/shared/assets/icons/plus-lens.svg?react";
import MoveIcon from "@/shared/assets/icons/move.svg?react";
import cls from "./ToolsPanel.module.scss"
import classNames from "classnames";
import React, {useState} from "react";
import {CursorMode, ItemType} from "@/pages/planPage/provider/types.ts";
import {Tooltip} from "antd";
import {useControls, useTransformContext, useTransformEffect} from "react-zoom-pan-pinch";
import {observer} from "mobx-react-lite";
import {optionsStore} from "@/pages/planPage/lib/stores/optionsStore.ts";

interface ToolsItem {
    value: ItemType;
    name: string;
    icon: React.SVGProps<SVGSVGElement>,
    iconStyle: "fill" | "stroke";
}

const CursorItems: ToolsItem[] = [
    {
        value: CursorMode.Move,
        name: "Курсор",
        icon: CursorIcon,
        iconStyle: "stroke"
    },
    {
        value: CursorMode.Hand,
        name: "Рука",
        icon: HandIcon,
        iconStyle: "stroke"
    },
    {
        value: CursorMode.Replace,
        name: "Перемещение",
        icon: MoveIcon,
        iconStyle: "stroke"
    }
]

const EditItems: ToolsItem[] = [
    {
        value: "subjects",
        name: "Дисциплина",
        icon: SubjectIcon,
        iconStyle: "stroke"
    },
    {
        value: "modules",
        name: "Модуль",
        icon: ModuleIcon,
        iconStyle: "stroke"
    },
    {
        value: "selections",
        name: "Выбор дисциплин",
        icon: SelectionIcon,
        iconStyle: "fill"
    },
    {
        value: "Трек",
        name: "Трек",
        icon: TracksIcon,
        iconStyle: "fill"
    }
]

const ToolsPanel = observer(() => {

    const { zoomIn, zoomOut } = useControls();
    const { props} = useTransformContext();

    const [currentScale, setCurrentScale] = useState(props.initialScale);

    useTransformEffect(({ state }) => {
        setCurrentScale(state.scale);
        return () => {}
    });

    return (
        <div className={"flex bg-[#f0f4f9] p-2 px-4 gap-2 rounded-2xl"}>
            <div className={"flex border-r-stone-300 border-r border-solid pr-2"}>
                {
                    CursorItems.map(item =>
                        <ToolsButton
                            {...item}
                            key={item.value}
                            selected={optionsStore.toolsOptions.cursorMode === item.value}
                            onClick={() => optionsStore.setToolsMode(item.value as CursorMode)}
                        />
                    )
                }
            </div>
            <div className={"flex border-r-stone-300 border-r border-solid pr-2"}>
                {
                    EditItems.map(item =>
                        <ToolsButton
                            {...item}
                            key={item.value}
                            selected={(optionsStore.toolsOptions.cursorMode === CursorMode.Create && optionsStore.toolsOptions.selectedCreateEntityType === item.value)}
                            onClick={() => {
                                optionsStore.setToolsMode(CursorMode.Create)
                                optionsStore.setToolsEntityType(item.value)
                            }}
                        />
                    )
                }
            </div>
            <div className={"flex items-center"}>
                <ToolsButton value={"zoomIn"} name={"Приблизить"} icon={PlusIcon} iconStyle={"fill"} onClick={() => zoomIn(0.3)}/>
                <ToolsButton value={"zoomOut"} name={"Отдалить"} icon={MinusIcon} iconStyle={"fill"} onClick={() => zoomOut(0.3)}/>
                <Tooltip title={"Масштаб"}>
                    <span className={"w-10 flex items-center ml-1 select-none"}>
                        {(currentScale * 100).toFixed(0)}%
                    </span>
                </Tooltip>
            </div>
        </div>
    )
})

interface ToolsButtonProps extends ToolsItem {
    selected?: boolean;
    onClick?(): void;
}

const ToolsButton = ({icon, name, value, iconStyle, selected, onClick}: ToolsButtonProps) => {

    return (
        <Tooltip title={name}>
            <div
                key={value}
                className={classNames(cls.icon, selected && cls.icon__selected)}
                onClick={onClick && (() => onClick())}
            >
                <Icon
                    component={icon}
                    className={iconStyle === "stroke" ? cls.stroke : cls.fill}
                />
            </div>
        </Tooltip>
    )
}

export default ToolsPanel;