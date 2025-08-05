import { lazy } from "react";
import BaseRoute from "src/constants/routes/base.route";
import IRouteModel from "src/models/IRouteModel";

const HomePage = lazy(() => import("src/containers/HomePage"));

const BaseRouteConfig: IRouteModel[] = [
    {
        // URL: /
        path: BaseRoute.BASE,
        element: HomePage
    },
    {
        // URL: /home
        path: BaseRoute.HOME,
        element: HomePage
    }
];

export default BaseRouteConfig;