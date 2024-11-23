import {Navigate, Route, RouteProps, Routes} from "react-router-dom";
import React, {memo, ReactNode, Suspense, useCallback} from "react";
import {routeConfig} from "@/app/providers/router/routerConfig.tsx";
import {getRouteLogin, getRouteMain} from "@/shared/const/router.ts";
import {useAuth} from "@/app/providers/AuthProvider.tsx";

export type AppRoutesProps = RouteProps & {
    authOnly?: boolean;
    nonAuthOnly?: boolean;
};

const AppRouter = () => {

    const {isAuth} = useAuth();

    const renderWithWrapper = useCallback((route: AppRoutesProps) => {
        const element = (
            <Suspense fallback={<PageLoader />}>{route.element}</Suspense>
        );

        return (
            <Route
                key={route.path}
                path={route.path}
                element={
                    (route.nonAuthOnly && isAuth) ? <Navigate to={getRouteMain()}/> :
                    route.authOnly ? (
                        <PrivateRoute>{element}</PrivateRoute>
                    ) : (
                        element
                    )
                }
            />
        );
    }, [isAuth]);

    return <Routes>{Object.values(routeConfig()).map(renderWithWrapper)}</Routes>;
};

//Хок, делающий путь недоступным для неавторизованного пользователя
const PrivateRoute = ({children}: {children: ReactNode}) => {
    const {isAuth} = useAuth();

    return (
        isAuth ?
            children
            : <Navigate to={getRouteLogin()} replace />
    )
}

const PageLoader = () => {
    return (
        <div>

        </div>
    )
}

export default memo(AppRouter);