import {
    AppRoutes,
    getRouteLogin,
    getRouteMain, getRoutePlan, getRoutePlanTitle
} from "@/shared/const/router";
import {AppRoutesProps} from "@/app/providers/router/AppRouter.tsx";
import PlanPage from "@/pages/PlanPage/PlanPage.tsx";
import PlansListPage from "@/pages/PlansListPage/PlansaListPage.tsx";
import PlanTitlePage from "@/pages/PlanTitlePage/PlanTitlePage.tsx";

export const routeConfig = (): Record<AppRoutes, AppRoutesProps> => {
    return ({
        [AppRoutes.MAIN]: {
            path: getRouteMain(),
            element: <PlansListPage/>
        },
        [AppRoutes.LOGIN]: {
            path: getRouteLogin(),
            element: <div></div>
        },
        [AppRoutes.PLAN]: {
            path: getRoutePlan(":id"),
            element: <PlanPage/>
        },
        [AppRoutes.TITLE]: {
            path: getRoutePlanTitle(":id"),
            element: <PlanTitlePage/>
        },
        [AppRoutes.NOT_FOUND]: {
            path: '*',
            element: <div></div>
        },
    })
};