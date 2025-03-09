import {
    AppRoutes,
    getRouteLogin,
    getRouteMain,
    getRoutePlan,
    getRoutePlanCompetencies,
    getRoutePlanDepartments,
    getRoutePlanSettings,
    getRoutePlanTable,
    getRoutePlanTitle, getRouteRegister
} from "@/shared/const/router";
import {AppRoutesProps} from "@/app/providers/router/AppRouter.tsx";
import PlanPage from "@/pages/planPage/PlanPage.tsx";
import PlansListPage from "@/pages/plansListPage/PlansaListPage.tsx";
import PlanTitlePage from "@/pages/planTitlePage/PlanTitlePage.tsx";
import PlanCompetenciesPage from "@/pages/planCompetenciesPage/PlanCompetenciesPage.tsx";
import PlanSettingsPage from "@/pages/planSettings/PlanSettingsPage.tsx";
import PlanTablePage from "@/pages/planTablePage/PlanTablePage.tsx";
import PlanDepartmentPage from "@/pages/planDepartmentPage/PlanDepartmentPage.tsx";
import LoginPage from "@/pages/loginPage/LoginPage.tsx";
import NotFound from "@/pages/notFound/NotFound.tsx";
import RegisterPage from "@/pages/registerPage/RegisterPage.tsx";

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
            element: <PlanPage/>,
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
        [AppRoutes.COMPETENCIES]: {
            path: getRoutePlanCompetencies(":id"),
            element: <PlanCompetenciesPage/>,
            authOnly: true
        },
        [AppRoutes.DEPARTMENTS]: {
            path: getRoutePlanDepartments(":id"),
            element: <PlanDepartmentPage/>,
            authOnly: true
        },
        [AppRoutes.NOT_FOUND]: {
            path: '*',
            element: <NotFound/>
        },
    })
};