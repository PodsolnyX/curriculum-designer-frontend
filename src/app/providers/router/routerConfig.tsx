import {
    AppRoutes,
    getRouteLogin,
    getRouteMain, getRoutePlan, getRoutePlanCompetencies, getRoutePlanTitle
} from "@/shared/const/router";
import {AppRoutesProps} from "@/app/providers/router/AppRouter.tsx";
import PlanPage from "@/pages/planPage/PlanPage.tsx";
import PlansListPage from "@/pages/plansListPage/PlansaListPage.tsx";
import PlanTitlePage from "@/pages/planTitlePage/PlanTitlePage.tsx";
import PlanCompetenciesPage from "@/pages/planCompetenciesPage/PlanCompetenciesPage.tsx";

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
        [AppRoutes.COMPETENCIES]: {
            path: getRoutePlanCompetencies(":id"),
            element: <PlanCompetenciesPage/>
        },
        [AppRoutes.NOT_FOUND]: {
            path: '*',
            element: <div></div>
        },
    })
};