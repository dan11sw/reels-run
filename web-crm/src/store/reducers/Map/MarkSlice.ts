import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import ConfigApp from "src/config/config.app";
import { IMarkModel } from "src/models/IMarkModel";

export interface IMarkSlice {
  freeMarks: IMarkModel[];
  isLoading: boolean;
  isAuthenticated: boolean;
}

// Базовое состояние слайса
const initialState: IMarkSlice = {
  freeMarks: [],
  isLoading: false,
  isAuthenticated: false,
};

/**
 * Создание слайса для авторизации пользователя
 */
export const markSlice = createSlice({
  name: "mark_slice",
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
      state.freeMarks = [];
    },

    setFreeMarks(state, action: PayloadAction<IMarkModel[]>) {
      state.freeMarks = action.payload;
    },
  },
});

export default markSlice.reducer;
