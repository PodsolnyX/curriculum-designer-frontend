import {getRoutePlan, getRoutePlanCompetencies, getRoutePlanTitle} from "@/shared/const/router.ts";
import {PlanPageLayoutMenuItem} from "@/widgets/PlanPageLayout/PlanPageLayout.tsx";
import DocumentIcon from "@/shared/assets/icons/document.svg?react";
import BoardIcon from "@/shared/assets/icons/board.svg?react";
import HatIcon from "@/shared/assets/icons/hat.svg?react";
import HallIcon from "@/shared/assets/icons/hall.svg?react";

export const getPlanMenuItems = (id: number | string): PlanPageLayoutMenuItem[] => [
    {
        value: "title",
        name: "Титул",
        icon: DocumentIcon,
        path: getRoutePlanTitle(id)
    },
    {
        value: "plan",
        name: "План",
        icon: BoardIcon,
        path: getRoutePlan(id)
    },
    {
        value: "competencies",
        name: "Компетенции",
        icon: HatIcon,
        path: getRoutePlanCompetencies(id)
    },
    {
        value: "departments",
        name: "Кафедры",
        icon: HallIcon,
        path: getRoutePlanTitle(id)
    }
];