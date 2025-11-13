import {
    AppRoutes,
    getRouteLogin,
    getRouteMain,
    getRoutePlan, getRoutePlanAnalytics,
    getRoutePlanCompetencies,
    getRoutePlanDepartments,
    getRoutePlanSettings,
    getRoutePlanTable,
    getRoutePlanTitle, getRouteRegister
} from "@/shared/const/router";
import {AppRoutesProps} from "@/app/providers/router/AppRouter.tsx";
import PlanViewPage from "@/pages/PlanView/PlanViewPage.tsx";
import PlansListPage from "@/pages/PlansList/PlansListPage.tsx";
import PlanTitlePage from "@/pages/PlanTitle/PlanTitlePage.tsx";
import PlanCompetenciesPage from "@/pages/PlanCompetencies/PlanCompetenciesPage.tsx";
import PlanSettingsPage from "@/pages/PlanSettings/PlanSettingsPage.tsx";
import PlanTablePage from "@/pages/PlanTableView/PlanTablePage.tsx";
import PlanDepartmentsPage from "@/pages/PlanDepartments/PlanDepartmentsPage.tsx";
import LoginPage from "@/pages/Login/LoginPage.tsx";
import NotFound from "@/pages/NotFound/NotFound.tsx";
import RegisterPage from "@/pages/Register/RegisterPage.tsx";
import PlanAnalyticsPage from "@/pages/PlanAnalytics/PlanAnalyticsPage.tsx";

export const routeConfig = (isAuth: boolean): Record<AppRoutes, AppRoutesProps> => {
    return ({
        [AppRoutes.MAIN]: {
            path: getRouteMain(),
            element: isAuth ? <PlansListPage/> : <LoginPage/>
        },
        [AppRoutes.LOGIN]: {
            path: getRouteLogin(),
            element: <LoginPage/>,
            nonAuthOnly: true
        },
        [AppRoutes.REGISTER]: {
            path: getRouteRegister(),
            element: <RegisterPage/>,
            nonAuthOnly: true
        },
        [AppRoutes.PLAN]: {
            path: getRoutePlan(":id"),
            element: <PlanViewPage/>,
            authOnly: true
        },
        [AppRoutes.PLAN_TABLE]: {
            path: getRoutePlanTable(":id"),
            element: <PlanTablePage/>,
            authOnly: true
        },
        [AppRoutes.TITLE]: {
            path: getRoutePlanTitle(":id"),
            element: <PlanTitlePage/>,
            authOnly: true
        },
        [AppRoutes.SETTINGS]: {
            path: getRoutePlanSettings(":id"),
            element: <PlanSettingsPage/>,
            authOnly: true
        },
        [AppRoutes.ANALYTICS]: {
            path: getRoutePlanAnalytics(":id"),
            element: <PlanAnalyticsPage/>,
            authOnly: true
        },
        [AppRoutes.COMPETENCIES]: {
            path: getRoutePlanCompetencies(":id"),
            element: <PlanCompetenciesPage/>,
            authOnly: true
        },
        [AppRoutes.DEPARTMENTS]: {
            path: getRoutePlanDepartments(":id"),
            element: <PlanDepartmentsPage/>,
            authOnly: true
        },
        [AppRoutes.NOT_FOUND]: {
            path: '*',
            element: <NotFound/>
        },
    })
};