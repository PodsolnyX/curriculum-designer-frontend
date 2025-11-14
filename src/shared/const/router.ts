export enum AppRoutes {
  MAIN = 'main',
  LOGIN = 'login',
  REGISTER = 'register',
  PLAN = 'plan',
  PLAN_TABLE = 'table',
  TITLE = 'title',
  COMPETENCIES = 'competencies',
  SETTINGS = 'settings',
  DEPARTMENTS = 'departments',
  ANALYTICS = 'analytics',
  NOT_FOUND = 'not_found',
}

export const getRouteMain = () => '/';

export const getRouteLogin = () => '/login';

export const getRouteRegister = () => '/register';

export const getRoutePlan = (id: string | number) => `/curriculum/${id}/plan`;

export const getRoutePlanTable = (id: string | number) =>
  `/curriculum/${id}/plan-table`;

export const getRoutePlanTitle = (id: string | number) =>
  `/curriculum/${id}/title`;

export const getRoutePlanSettings = (id: string | number) =>
  `/curriculum/${id}/settings`;

export const getRoutePlanCompetencies = (id: string | number) =>
  `/curriculum/${id}/competencies`;

export const getRoutePlanDepartments = (id: string | number) =>
  `/curriculum/${id}/departments`;

export const getRoutePlanAnalytics = (id: string | number) =>
  `/curriculum/${id}/analytics`;

export const AppRouteByPathPattern: Record<string, AppRoutes> = {
  [getRouteMain()]: AppRoutes.MAIN,
  [getRouteLogin()]: AppRoutes.LOGIN,
  [getRoutePlan(':id')]: AppRoutes.PLAN,
};
