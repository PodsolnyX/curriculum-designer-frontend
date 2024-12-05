import {usePlan} from "@/pages/PlanPage/provider/PlanProvider.tsx";
import {Checkbox, Tag, Typography} from "antd";
import React from "react";
import {DisplaySettingsList, PreDisplaySettings} from "@/pages/PlanPage/provider/displaySettings.ts";

const DisplaySettingsPopover = () => {

    const {onChangeDisplaySetting, onSelectPreDisplaySetting, displaySettings} = usePlan();

    const isSelectedPreSetting = (key: string): boolean => {
        return (
            JSON.stringify(PreDisplaySettings.find(setting => setting.key === key).settings) === JSON.stringify(displaySettings)
        )
    }

    return (
        <div className={"flex flex-col gap-1"}>
            <div className={"grid grid-cols-2 gap-1 mb-2"}>
                {
                    DisplaySettingsList.map(setting =>
                        <Checkbox
                            key={setting.key}
                            checked={displaySettings[setting.key]}
                            onChange={() => onChangeDisplaySetting(setting.key)}
                        >
                            {setting.name}
                        </Checkbox>
                    )
                }
            </div>
            <Typography.Text>Преднастройки:</Typography.Text>
            <div className={"flex flex-wrap gap-1"}>
                {
                    PreDisplaySettings.map(setting =>
                        <Tag
                            key={setting.key}
                            color={isSelectedPreSetting(setting.key) ? "blue" : "default"}
                            className={"m-0 bg-transparent cursor-pointer"}
                            onClick={() => onSelectPreDisplaySetting(setting.key)}
                        >
                            {setting.name}
                        </Tag>
                    )
                }
            </div>
        </div>
    )
}

export default DisplaySettingsPopover;