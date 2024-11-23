import {
    AppRoutes,
    getRouteLogin,
    getRouteMain, getRoutePlan
} from "@/shared/const/router";
import {AppRoutesProps} from "@/app/providers/router/AppRouter.tsx";
import PlanPage from "@/pages/PlanPage/PlanPage.tsx";

export const routeConfig = (): Record<AppRoutes, AppRoutesProps> => {
    return ({
        [AppRoutes.MAIN]: {
            path: getRouteMain(),
            element: <PlanPage/>
        },
        [AppRoutes.LOGIN]: {
            path: getRouteLogin(),
            element: <div></div>
        },
        [AppRoutes.PLAN]: {
            path: getRoutePlan(":id"),
            element: <PlanPage/>
        },
        [AppRoutes.NOT_FOUND]: {
            path: '*',
            element: <div></div>
        },
    })
};