import { Suspense, useCallback } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import WithToastify from "src/hoc-helpers/WithToastify";
import { useAppSelector } from "src/hooks/redux.hook";
import IRouteModel from "src/models/IRouteModel";
import BaseRouteConfig from "./configs/base.route";
import BaseRoute from "src/constants/routes/base.route";
import AuthRouteConfig from "./configs/auth.route";
import CreatorRouteConfig from "./configs/creator.route";
import Loader from "src/components/UI/Loader";

const createRoutes = (routes: IRouteModel[]) => {
    return routes.map((value, index) => {
        return <Route
            key={index}
            path={value.path}
            element={
                <Suspense fallback={<Loader />}>
                    <value.element />
                </Suspense>
            }
        />;
    });
};

/**
 * Хук для получения всех маршрутов
 * @param isAuthenticated Флаг авторизации пользователя
 * @returns {JSX.Element} Функциональный компонент по URL
 */
const useAppRoutes = () => {
    const authSelector = useAppSelector((s) => s.authReducer);

    return (
        <Routes>
            {createRoutes(AuthRouteConfig)}
            {!!authSelector.access_token && createRoutes(BaseRouteConfig)}
            {!!authSelector.access_token && createRoutes(CreatorRouteConfig)}

            <Route path="*" element={<Navigate to={BaseRoute.SIGN_IN} />} />
        </Routes>
    );
};

export default WithToastify(useAppRoutes);