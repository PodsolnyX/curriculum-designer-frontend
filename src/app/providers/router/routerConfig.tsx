import {
    AppRoutes,
    getRouteLogin,
    getRouteMain,
    getRoutePlan,
    getRoutePlanCompetencies,
    getRoutePlanDepartments,
    getRoutePlanSettings,
    getRoutePlanTable,
    getRoutePlanTitle
} from "@/shared/const/router";
import {AppRoutesProps} from "@/app/providers/router/AppRouter.tsx";
import PlanPage from "@/pages/planPage/PlanPage.tsx";
import PlansListPage from "@/pages/plansListPage/PlansaListPage.tsx";
import PlanTitlePage from "@/pages/planTitlePage/PlanTitlePage.tsx";
import PlanCompetenciesPage from "@/pages/planCompetenciesPage/PlanCompetenciesPage.tsx";
import PlanSettingsPage from "@/pages/planSettings/PlanSettingsPage.tsx";
import PlanTablePage from "@/pages/planTablePage/PlanTablePage.tsx";
import PlanDepartmentPage from "@/pages/planDepartmentPage/PlanDepartmentPage.tsx";

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
        [AppRoutes.PLAN_TABLE]: {
            path: getRoutePlanTable(":id"),
            element: <PlanTablePage/>
        },
        [AppRoutes.TITLE]: {
            path: getRoutePlanTitle(":id"),
            element: <PlanTitlePage/>
        },
        [AppRoutes.SETTINGS]: {
            path: getRoutePlanSettings(":id"),
            element: <PlanSettingsPage/>
        },
        [AppRoutes.COMPETENCIES]: {
            path: getRoutePlanCompetencies(":id"),
            element: <PlanCompetenciesPage/>
        },
        [AppRoutes.DEPARTMENTS]: {
            path: getRoutePlanDepartments(":id"),
            element: <PlanDepartmentPage/>
        },
        [AppRoutes.NOT_FOUND]: {
            path: '*',
            element: <div></div>
        },
    })
};