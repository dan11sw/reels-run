export const AuthRouteBase = "/api/auth";

const AuthRoute = {
    signUp: '/sign-up',
    signIn: '/sign-in',
    logout: '/logout',
    refreshToken: '/refresh/token',
    activateLink: '/activate',
    oauth: '/oauth',
    verification: '/verification',
    managementSignIn: '/management/sign-in',
    managementLogout: '/management/logout'
};

export default AuthRoute;