import { lazy } from "react";
import BaseRoute from "src/constants/routes/base.route";
import IRouteModel from "src/models/IRouteModel";

const SignInPage = lazy(() => import("src/containers/Auth/SignInPage"));

const AuthRouteConfig: IRouteModel[] = [
    {
        // URL: /auth/sign-in
        path: BaseRoute.SIGN_IN,
        element: SignInPage
    }
];

export default AuthRouteConfig;