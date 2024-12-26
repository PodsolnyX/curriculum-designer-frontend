export enum AppRoutes {
    MAIN = 'main',
    LOGIN = 'login',
    PLAN = 'plan',
    TITLE = 'title',
    COMPETENCIES = 'competencies',
    NOT_FOUND = 'not_found'
}

export const getRouteMain = () => '/';

export const getRouteLogin = () => '/login';

export const getRoutePlan = (id: string | number) => `/curriculum/${id}/plan`;

export const getRoutePlanTitle = (id: string | number) => `/curriculum/${id}/title`;

export const getRoutePlanCompetencies = (id: string | number) => `/curriculum/${id}/competencies`;

export const AppRouteByPathPattern: Record<string, AppRoutes> = {
    [getRouteMain()]: AppRoutes.MAIN,
    [getRouteLogin()]: AppRoutes.LOGIN,
    [getRoutePlan(':id')]: AppRoutes.PLAN
};