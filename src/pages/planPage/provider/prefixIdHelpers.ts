import {UniqueIdentifier} from "@dnd-kit/core";
import {PREFIX_ITEM_ID_KEYS, PrefixItemId} from "@/pages/planPage/provider/types.ts";

// ---------------------Общее----------------------

export const setPrefixToId = (id: UniqueIdentifier, key: typeof PREFIX_ITEM_ID_KEYS[number]): string => {
    return `${key}-${id}`
}

export const getIdFromPrefix = (id: string): string => {
    if (!id) return "";
    const ids = id.split("_");
    return ids.at(-1).split("-")[1] as PrefixItemId;
}

export const getParentIdFromPrefix = (id: string): string => {
    if (!id) return "";
    const ids = id.split("_");
    if (getPrefixFromId(ids.at(-1)) === "subjects") return getIdFromPrefix(ids.at(-2));
    return getIdFromPrefix(ids.at(-1));
}

export const getSemesterIdFromPrefix = (id: string): string => {
    if (!id) return "";
    const ids = id.split("_");
    return getIdFromPrefix(ids[0]);
}

export const getPrefixFromId = (id: string): string => {
    if (!id) return "";
    const ids = id.split("_");
    const type: PrefixItemId = ids.at(-1).split("-")[0] as PrefixItemId;
    return PREFIX_ITEM_ID_KEYS.includes(type) ? type : "";
}


export const concatIds = (parentId: string, childId: string): string => {
    return `${parentId}_${childId}`;
}

export const splitIds = (id: string): string[] => {
    const parts = id.split("_");
    const result: string[] = [];

    for (let i = 1; i <= parts.length; i += 1) {
        result.push(parts.slice(0, i).join("_"));
    }

    return result;
}

export const cutSemesterIdFromId = (id: string): string => {
    return id.split("_").slice(1).join("_");
}