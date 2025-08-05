/* Библиотеки */
import axios from "axios";
import { HeadersDefaultJSON } from "src/config/headers.default";

/* Константы */
import MainApi from "src/constants/api/main.api";
import AuthAction from "src/store/actions/AuthAction";
import store from "src/store/store";

const apiMainServer = axios.create({
  withCredentials: true,
  baseURL: MainApi.MAIN_SERVER,
  headers: {
    "Content-Type": "application/json",
  },
});

apiMainServer.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${
    store.getState().authReducer.access_token
  }`;
  return config;
});

apiMainServer.interceptors.response.use(
  (config) => {
    return config;
  },
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      error.config &&
      !error.config._isRetry
    ) {
      originalRequest._isRetry = true;

      try {
        const response = await apiMainServer.post(
          `${MainApi.REFRESH_TOKEN}`,
          {
            refresh_token: store.getState().authReducer.refresh_token,
          },
          {
            ...HeadersDefaultJSON,
          }
        );

        store.dispatch(AuthAction.refreshToken(response.data));
        return apiMainServer.request(originalRequest);
      } catch (e) {
        console.log(e);
      }
    }

    throw error;
  }
);

export default apiMainServer;
