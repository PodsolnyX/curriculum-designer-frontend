import {Button, Checkbox, Popover, Select} from "antd";
import React from "react";
import {DisplaySettingsList, PreDisplaySettings} from "@/pages/PlanView/const/preDisplaySettings.ts";
import {Link, useParams} from "react-router-dom";
import {getRoutePlanTable} from "@/shared/const/router.ts";
import {optionsStore} from "@/pages/PlanView/lib/stores/optionsStore.ts";
import {observer} from "mobx-react-lite";

const DisplaySettingsPopover = observer(({children}: React.PropsWithChildren<{}>) => {

    const {id} = useParams<{id: string}>();

    const selectedPreSetting = PreDisplaySettings.find(setting => JSON.stringify(setting.settings) === JSON.stringify(optionsStore.displaySettings))?.key || "";
    // const disabledEditSettings = optionsStore.toolsOptions.cursorMode === CursorMode.Replace;
    const disabledEditSettings = false;

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
                    onChange={(value) => optionsStore.onSelectPreDisplaySetting(value)}
                />
                <div className={"grid grid-cols-1 gap-1 mb-2"}>
                    {
                        DisplaySettingsList.map(setting =>
                            <Checkbox
                                key={setting.key}
                                checked={optionsStore.displaySettings[setting.key]}
                                onChange={() => optionsStore.onChangeDisplaySetting(setting.key)}
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
})

export default DisplaySettingsPopover;