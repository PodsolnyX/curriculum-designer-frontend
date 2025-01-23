import {useState} from "react";
import {DisplaySettings} from "@/pages/planPage/provider/types.ts";
import {PreDisplaySettings} from "@/pages/planPage/provider/preDisplaySettings.ts";

export function useDisplaySettings() {

    const [displaySettings, setDisplaySettings] = useState<DisplaySettings>(PreDisplaySettings[1].settings)

    const disableSettings = () => {
        setDisplaySettings(PreDisplaySettings[0].settings)
    }

    const enableSettings = () => {
        setDisplaySettings(PreDisplaySettings[1].settings)
    }

    const onChangeDisplaySetting = (key: keyof DisplaySettings) => {
        setDisplaySettings({
            ...displaySettings,
            [key]: !displaySettings[key]
        })
    }

    const onSelectPreDisplaySetting = (key: string) => {
        setDisplaySettings({
            ...PreDisplaySettings.find(setting => setting.key === key).settings
        })
    }

    return {
        displaySettings,
        disableSettings,
        enableSettings,
        onChangeDisplaySetting,
        onSelectPreDisplaySetting
    }
}