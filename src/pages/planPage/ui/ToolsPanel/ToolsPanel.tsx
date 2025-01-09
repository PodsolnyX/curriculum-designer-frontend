import Icon from '@ant-design/icons';
import SubjectIcon from "@/shared/assets/icons/subject.svg?react";
import ModuleIcon from "@/shared/assets/icons/module.svg?react";
import SelectionIcon from "@/shared/assets/icons/selection.svg?react";
import TracksIcon from "@/shared/assets/icons/tracks.svg?react";
import cls from "./ToolsPanel.module.scss"
import classNames from "classnames";
import {ReactNode} from "react";
import {ItemType} from "@/pages/planPage/provider/types.ts";
import {usePlan} from "@/pages/planPage/provider/PlanProvider.tsx";

interface Item {
    key: ItemType;
    name: string;
    icon: ReactNode;
    iconStyle: "fill" | "stroke";
}

const Items: Item[] = [
    {
        key: "subjects",
        name: "Дисциплина",
        icon: SubjectIcon,
        iconStyle: "stroke"
    },
    {
        key: "modules",
        name: "Модуль",
        icon: ModuleIcon,
        iconStyle: "stroke"
    },
    {
        key: "selections",
        name: "Выбор дисциплин",
        icon: SelectionIcon,
        iconStyle: "fill"
    },
    {
        key: "Трек",
        name: "Трек",
        icon: TracksIcon,
        iconStyle: "fill"
    }
]

const ToolsPanel = () => {

    const {
        toolsOptions,
        setToolsOptions
    } = usePlan();

    const ItemsSelect = () => {
        return (
            <div className={"flex flex-col gap-2"}>
                {
                    Items.map(item =>
                        <div
                            className={classNames(cls.icon, toolsOptions.selectedEditItem === item.key && cls.icon__selected)}
                            key={item.key}
                            onClick={() => setToolsOptions({...toolsOptions, selectedEditItem: item.key})}
                        >
                            <Icon component={item.icon} className={item.iconStyle === "stroke" ? cls.stroke : cls.fill}/>
                            { item.name }
                        </div>
                    )
                }
            </div>
        )
    }
    const color = "#e5f1f3";
    return (
        <div className={"flex gap-2 bg-[#f0f4f9] p-3 rounded-2xl"}>
            {/*<div*/}
            {/*    className={classNames(cls.icon, !toolsOptions.editMode && cls.icon__selected)}*/}
            {/*    onClick={() => setToolsOptions({...toolsOptions, editMode: false})}*/}
            {/*>*/}
            {/*    <Icon component={CursorIcon} className={cls.stroke}/>*/}
            {/*</div>*/}
            {
                Items.map(item =>
                    <div
                        className={classNames(cls.icon, toolsOptions.editMode && cls.icon__selected)}
                        onClick={() => setToolsOptions({...toolsOptions, editMode: true})}
                    >
                        <Icon
                            component={item.icon}
                            className={item.iconStyle === "stroke" ? cls.stroke : cls.fill}
                        />
                    </div>
                )
            }
            {/*<Popover content={ItemsSelect}>*/}
            {/*    <div*/}
            {/*        className={classNames(cls.icon, toolsOptions.editMode && cls.icon__selected)}*/}
            {/*        onClick={() => setToolsOptions({...toolsOptions, editMode: true})}*/}
            {/*    >*/}
            {/*        <Icon*/}
            {/*            component={Items.find(item => item.key === toolsOptions.selectedEditItem)?.icon}*/}
            {/*            className={Items.find(item => item.key === toolsOptions.selectedEditItem)?.iconStyle === "stroke" ? cls.stroke : cls.fill}*/}
            {/*        />*/}
            {/*    </div>*/}
            {/*</Popover>*/}
        </div>
    )
}

export default ToolsPanel;