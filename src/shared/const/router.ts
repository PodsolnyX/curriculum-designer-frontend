export enum AppRoutes {
    MAIN = 'main',
    LOGIN = 'login',
    PLAN = 'plan',
    PLAN_TABLE = 'table',
    TITLE = 'title',
    COMPETENCIES = 'competencies',
    SETTINGS = 'settings',
    DEPARTMENTS = 'departments',
    NOT_FOUND = 'not_found'
}

export const getRouteMain = () => '/';

export const getRouteLogin = () => '/login';

export const getRoutePlan = (id: string | number) => `/curriculum/${id}/plan`;

export const getRoutePlanTable = (id: string | number) => `/curriculum/${id}/plan-table`;

export const getRoutePlanTitle = (id: string | number) => `/curriculum/${id}/title`;

export const getRoutePlanSettings = (id: string | number) => `/curriculum/${id}/settings`;

export const getRoutePlanCompetencies = (id: string | number) => `/curriculum/${id}/competencies`;

export const getRoutePlanDepartments = (id: string | number) => `/curriculum/${id}/departments`;

export const AppRouteByPathPattern: Record<string, AppRoutes> = {
    [getRouteMain()]: AppRoutes.MAIN,
    [getRouteLogin()]: AppRoutes.LOGIN,
    [getRoutePlan(':id')]: AppRoutes.PLAN
};