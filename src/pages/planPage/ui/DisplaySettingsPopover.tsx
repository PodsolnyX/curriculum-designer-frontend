import {usePlan} from "@/pages/planPage/provider/PlanProvider.tsx";
import {Button, Checkbox, Popover, Select} from "antd";
import React from "react";
import {DisplaySettingsList, PreDisplaySettings} from "@/pages/planPage/provider/preDisplaySettings.ts";
import {CursorMode} from "@/pages/planPage/provider/types.ts";
import {Link, useParams} from "react-router-dom";
import {getRoutePlanTable} from "@/shared/const/router.ts";

const DisplaySettingsPopover = ({children}: React.PropsWithChildren<{}>) => {

    const {
        onChangeDisplaySetting,
        onSelectPreDisplaySetting,
        displaySettings,
        toolsOptions
    } = usePlan();

    const {id} = useParams<{id: string}>();

    const selectedPreSetting = PreDisplaySettings.find(setting => JSON.stringify(setting.settings) === JSON.stringify(displaySettings))?.key || "";
    const disabledEditSettings = toolsOptions.cursorMode === CursorMode.Replace;

    const Content = () => {
        return (
            <div className={"flex flex-col gap-3"}>
                <Select
                    placeholder={"Пред-настройка"}
                    className={"w-full"}
                    disabled={disabledEditSettings}
                    size={"small"}
                    value={selectedPreSetting}
                    options={PreDisplaySettings.map(setting => ({value: setting.key, label: setting.name}))}
                    onChange={(value) => onSelectPreDisplaySetting(value)}
                />
                <div className={"grid grid-cols-1 gap-1 mb-2"}>
                    {
                        DisplaySettingsList.map(setting =>
                            <Checkbox
                                key={setting.key}
                                checked={displaySettings[setting.key]}
                                onChange={() => onChangeDisplaySetting(setting.key)}
                                disabled={disabledEditSettings}
                            >
                                {setting.name}
                            </Checkbox>
                        )
                    }
                </div>
                <Link to={getRoutePlanTable(id || 0)} className={"w-full"}>
                    <Button type={"primary"} className={"w-full"}>Табличный вид</Button>
                </Link>
            </div>
        )
    }

    return (
        <Popover
            content={Content()}
            title={""}
            trigger={"click"}
            placement={"bottomLeft"}
        >
            {children}
        </Popover>
    )
}

export default DisplaySettingsPopover;