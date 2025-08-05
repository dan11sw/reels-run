export const MAIN_SERVER_API = "http://localhost:5000/api"

const MainApi = {
    MAIN_SERVER: MAIN_SERVER_API,
    SIGN_IN: "/auth/management/sign-in",
    LOGOUT: "/auth/management/logout",
    REFRESH_TOKEN: "/auth/refresh/token",
};

export default MainApi;