import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import ConfigApp from "src/config/config.app";
import { IAuthModel } from "src/models/IAuthModel";

export interface IAuthSlice extends IAuthModel {
  isLoading: boolean;
  isAuthenticated: boolean;
}

// Базовое состояние слайса
const initialState: IAuthSlice = {
  access_token: null,
  refresh_token: null,
  roles: [],
  isLoading: false,
  isAuthenticated: false,
};

/**
 * Создание слайса для авторизации пользователя
 */
export const authSlice = createSlice({
  name: "auth_slice",
  initialState,
  reducers: {
    loadingStart(state) {
      state.isLoading = true;
    },

    loadingEnd(state) {
      state.isLoading = false;
    },

    clear(state) {
      state.isLoading = false;
      state.isAuthenticated = false;

      state.access_token = null;
      state.refresh_token = null;
    },

    getAuthData(state) {
      const mainStore = localStorage.getItem(ConfigApp.MAIN_STORE_KEY);

      state.access_token = null;
      state.refresh_token = null;
      state.roles = [];

      if (mainStore) {
        const parse = JSON.parse(mainStore) as IAuthModel;

        if (mainStore) {
          state.access_token = parse.access_token;
          state.refresh_token = parse.refresh_token;
          state.roles = parse.roles;
        }

        state.isAuthenticated = !!state.access_token;
      }
    },

    setAuthData(state, action: PayloadAction<IAuthModel>) {
      state.access_token = action.payload.access_token;
      state.refresh_token = action.payload.refresh_token;
      state.roles = action.payload.roles;
      state.isAuthenticated = !!state.access_token;

      const slice = state as IAuthModel;

      localStorage.setItem(ConfigApp.MAIN_STORE_KEY, JSON.stringify(slice));
    },

    signInSuccess(state, action: PayloadAction<IAuthModel>) {
      state.isLoading = false;
      state.access_token = action.payload.access_token;
      state.refresh_token = action.payload.refresh_token;
      state.roles = action.payload.roles;
      state.isAuthenticated = !!state.access_token;

      const slice = state as IAuthModel;

      localStorage.setItem(ConfigApp.MAIN_STORE_KEY, JSON.stringify(slice));
    },

    /**
     * Разлогирование пользователя
     * @param state Состояние
     */
    logout(state) {
      state.isLoading = false;
      state.access_token = null;
      state.refresh_token = null;
      state.refresh_token = null;
      state.roles = [];
      state.isAuthenticated = false;

      localStorage.removeItem(ConfigApp.MAIN_STORE_KEY);
    },
  },
});

export default authSlice.reducer;
