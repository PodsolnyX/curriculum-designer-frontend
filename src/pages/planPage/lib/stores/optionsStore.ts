import {makeAutoObservable} from "mobx";
import {CursorMode, DisplaySettings, ToolsOptions} from "@/pages/planPage/provider/types.ts";
import {PreDisplaySettings, ReplacePreDisplaySetting} from "@/pages/planPage/provider/preDisplaySettings.ts";


class OptionsStore {

    displaySettings: DisplaySettings = PreDisplaySettings[1].settings;
    toolsOptions: ToolsOptions = {
        cursorMode: CursorMode.Move,
        selectedCreateEntityType: "subjects"
    }

    constructor() {
        makeAutoObservable(this);
    }

    setToolsMode(mode: CursorMode) {
        this.toolsOptions.cursorMode = mode;
    }

    setToolsEntityType(type: string) {
        this.toolsOptions.selectedCreateEntityType = type;
    }

    disableSettings() {
        this.displaySettings = ReplacePreDisplaySetting.settings;
    }

    enableSettings() {
        this.displaySettings = PreDisplaySettings[1].settings;
    }

    onChangeDisplaySetting(key: keyof DisplaySettings) {
        this.displaySettings[key] = !this.displaySettings[key];
    }

    onSelectPreDisplaySetting(key: string) {
        this.displaySettings = {
            ...PreDisplaySettings.find(setting => setting.key === key).settings
        }
    }

}

export const optionsStore = new OptionsStore();