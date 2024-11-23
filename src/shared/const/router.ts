export enum AppRoutes {
    MAIN = 'main',
    LOGIN = 'login',
    PLAN = 'plan',
    NOT_FOUND = 'not_found'
}

export const getRouteMain = () => '/';

export const getRouteLogin = () => '/login';

export const getRoutePlan = (id: string) => `/curriculum/${id}/plan`;

export const AppRouteByPathPattern: Record<string, AppRoutes> = {
    [getRouteMain()]: AppRoutes.MAIN,
    [getRouteLogin()]: AppRoutes.LOGIN,
    [getRoutePlan(':id')]: AppRoutes.PLAN
};